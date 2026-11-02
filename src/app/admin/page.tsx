"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Watch,
  MessageSquare,
  PlusCircle,
  ArrowLeft,
  RefreshCw,
  Trash2,
} from "lucide-react";
import type {
  WatchRecord,
  OrderRecord,
  InquiryRecord,
} from "@/db/schema";
import { useStore } from "@/context/StoreContext";

const STUDIO_IMAGE_PRESETS = [
  {
    label: "Two-Tone Jubilee Fluted",
    url: "/images/watches/twotone-royal.jpg",
  },
  {
    label: "Obsidian Executive Chrono",
    url: "/images/watches/hero-chronograph.jpg",
  },
  {
    label: "Pack of 2 Steel Bundle",
    url: "/images/watches/pack2-steel-bundle.jpg",
  },
  {
    label: "Pack of 2 Tank Rectangular",
    url: "/images/watches/pack2-tank-dress.jpg",
  },
  {
    label: "5ATM Emerald Diver",
    url: "/images/watches/obsidian-diver.jpg",
  },
  {
    label: "Dual-Time Tactical Sports",
    url: "/images/watches/dualtime-sports.jpg",
  },
  {
    label: "Black Arabic Aura Matte",
    url: "/images/watches/arabic-aura-black.jpg",
  },
  {
    label: "Diamond-Cut Skeleton Auto",
    url: "/images/watches/skeleton-automatic.jpg",
  },
  {
    label: "Rose Gold Digital Retro",
    url: "/images/watches/rose-digital-metal.jpg",
  },
  {
    label: "Golden Edition Smartwatch",
    url: "/images/watches/golden-smartwatch.jpg",
  },
];

export default function AdminDashboardPage() {
  const { formatPrice, showToast } = useStore();

  const [tab, setTab] = useState<"orders" | "catalog" | "inquiries">("orders");
  const [ordersList, setOrdersList] = useState<OrderRecord[]>([]);
  const [watchesList, setWatchesList] = useState<WatchRecord[]>([]);
  const [inquiriesList, setInquiriesList] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Watch Form State
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState(
    "Limited Atelier Edition • Precision Movement"
  );
  const [brand, setBrand] = useState("Modern Watch Atelier");
  const [category, setCategory] = useState("luxury");
  const [pricePkr, setPricePkr] = useState("2750");
  const [compareAtPricePkr, setCompareAtPricePkr] = useState("4500");
  const [movement, setMovement] = useState("Precision Japanese Quartz");
  const [imageUrl, setImageUrl] = useState(STUDIO_IMAGE_PRESETS[0].url);
  const [isPackOfTwo, setIsPackOfTwo] = useState(false);
  const [isWaterproof, setIsWaterproof] = useState(true);
  const [creatingWatch, setCreatingWatch] = useState(false);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordRes, watRes, inqRes] = await Promise.all([
        fetch("/api/orders?all=true"),
        fetch("/api/watches"),
        fetch("/api/inquiries"),
      ]);
      const [ordJson, watJson, inqJson] = await Promise.all([
        ordRes.json(),
        watRes.json(),
        inqRes.json(),
      ]);
      setOrdersList(Array.isArray(ordJson.orders) ? ordJson.orders : []);
      setWatchesList(Array.isArray(watJson.watches) ? watJson.watches : []);
      setInquiriesList(
        Array.isArray(inqJson.inquiries) ? inqJson.inquiries : []
      );
    } catch {
      showToast("Could not refresh store data.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status }),
      });
      if (res.ok) {
        setOrdersList((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
        showToast(`Order updated to "${status}"`);
      }
    } catch {
      showToast("Failed to update order status");
    }
  };

  const handleCreateWatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreatingWatch(true);

    try {
      const res = await fetch("/api/watches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          subtitle,
          brand,
          category,
          pricePkr: Number(pricePkr),
          compareAtPricePkr: Number(compareAtPricePkr),
          movement,
          imageUrl,
          isPackOfTwo,
          isWaterproof,
          featured: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.watch) {
        setWatchesList((prev) => [data.watch, ...prev]);
        setName("");
        showToast(`Published "${data.watch.name}" to live storefront!`);
      }
    } catch {
      showToast("Failed to add watch.");
    } finally {
      setCreatingWatch(false);
    }
  };

  const handleRestock = async (watch: WatchRecord) => {
    try {
      const nextStock = watch.stock + 10;
      const res = await fetch(`/api/watches/${watch.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: nextStock }),
      });
      if (res.ok) {
        setWatchesList((prev) =>
          prev.map((w) =>
            w.id === watch.id ? { ...w, stock: nextStock } : w
          )
        );
        showToast(`Restocked +10 units for ${watch.name}`);
      }
    } catch {
      showToast("Unable to restock");
    }
  };

  const handleDeleteWatch = async (watch: WatchRecord) => {
    try {
      const res = await fetch(`/api/watches/${watch.slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWatchesList((prev) => prev.filter((w) => w.id !== watch.id));
        showToast(`Removed ${watch.name} from catalog`);
      }
    } catch {
      showToast("Unable to remove watch");
    }
  };

  const totalRevenuePkr = ordersList.reduce((s, o) => s + o.totalPkr, 0);
  const totalStockUnits = watchesList.reduce((s, w) => s + w.stock, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-950"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Storefront
          </Link>
          <h1 className="mt-1 flex items-center gap-2.5 font-serif text-3xl font-bold text-zinc-950">
            <LayoutDashboard className="h-7 w-7 text-amber-700" />
            Modern Watch Merchant Desk
          </h1>
        </div>

        <button
          type="button"
          onClick={loadAdminData}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-zinc-800 hover:border-zinc-900 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Ledger
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <span className="text-xs font-semibold text-zinc-500">
            Order Volume Revenue
          </span>
          <p className="mt-1 font-mono text-2xl font-extrabold text-zinc-950">
            {formatPrice(totalRevenuePkr)}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <span className="text-xs font-semibold text-zinc-500">
            Total COD & Online Orders
          </span>
          <p className="mt-1 font-mono text-2xl font-extrabold text-zinc-950">
            {ordersList.length}
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <span className="text-xs font-semibold text-zinc-500">
            Active Watch SKUs
          </span>
          <p className="mt-1 font-mono text-2xl font-extrabold text-zinc-950">
            {watchesList.length}{" "}
            <span className="text-xs font-normal text-zinc-400">
              ({totalStockUnits} units)
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <span className="text-xs font-semibold text-zinc-500">
            Concierge Inquiries
          </span>
          <p className="mt-1 font-mono text-2xl font-extrabold text-zinc-950">
            {inquiriesList.length}
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {[
          {
            id: "orders" as const,
            label: `Orders & Fulfillment (${ordersList.length})`,
            icon: Package,
          },
          {
            id: "catalog" as const,
            label: `Catalog & Add Watch (${watchesList.length})`,
            icon: Watch,
          },
          {
            id: "inquiries" as const,
            label: `Customer Inquiries (${inquiriesList.length})`,
            icon: MessageSquare,
          },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                active
                  ? "bg-zinc-950 text-amber-300 shadow-sm"
                  : "border border-stone-300 bg-white text-zinc-700 hover:border-zinc-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS */}
      {tab === "orders" && (
        <div className="mt-6 space-y-4">
          {ordersList.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-zinc-500">
              No orders recorded yet.
            </div>
          ) : (
            ordersList.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-base font-extrabold text-zinc-950">
                        {order.orderNumber}
                      </span>
                      <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-bold uppercase text-zinc-700">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-600">
                      <strong>{order.customerName}</strong> • {order.phone} •{" "}
                      {order.city}
                    </p>
                    <p className="text-xs text-zinc-500">{order.address}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-extrabold text-zinc-950">
                      {formatPrice(order.totalPkr)}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      aria-label="Order fulfillment status"
                      className="rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-bold text-zinc-900 focus:border-zinc-950 focus:outline-none cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Quality Checked">Quality Checked</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
                  {order.items?.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-zinc-800"
                    >
                      {item.quantity}x {item.name} ({item.variant})
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: CATALOG & ADD NEW WATCH */}
      {tab === "catalog" && (
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Add New Watch Form */}
          <div className="lg:col-span-5">
            <form
              onSubmit={handleCreateWatch}
              className="rounded-3xl border border-stone-200 bg-white p-6 space-y-4 shadow-xs"
            >
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-zinc-950">
                <PlusCircle className="h-5 w-5 text-amber-700" />
                Publish New Watch SKU
              </h2>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Watch Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Imperial Gold Datejust Edition"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                  >
                    <option value="luxury">Luxury & Executive</option>
                    <option value="combo">Pack of 2 Combo</option>
                    <option value="waterproof">Waterproof</option>
                    <option value="sports">Sports & Digital</option>
                    <option value="smart">Smart Watch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Sale Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={500}
                    value={pricePkr}
                    onChange={(e) => setPricePkr(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 font-mono text-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Regular Price (PKR)
                  </label>
                  <input
                    type="number"
                    min={500}
                    value={compareAtPricePkr}
                    onChange={(e) => setCompareAtPricePkr(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 font-mono text-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Movement Caliber
                </label>
                <input
                  type="text"
                  value={movement}
                  onChange={(e) => setMovement(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Studio Photography Preset
                </label>
                <select
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                >
                  {STUDIO_IMAGE_PRESETS.map((p) => (
                    <option key={p.url} value={p.url}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-5 text-xs font-bold text-zinc-800 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPackOfTwo}
                    onChange={(e) => setIsPackOfTwo(e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  Pack of 2 Bundle
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWaterproof}
                    onChange={(e) => setIsWaterproof(e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  Waterproof Rated
                </label>
              </div>

              <button
                type="submit"
                disabled={creatingWatch}
                className="w-full rounded-xl bg-zinc-950 py-3 text-xs font-bold text-amber-300 hover:bg-zinc-800 cursor-pointer"
              >
                {creatingWatch
                  ? "Publishing Watch..."
                  : "Add Watch to Live Storefront"}
              </button>
            </form>
          </div>

          {/* Inventory List */}
          <div className="lg:col-span-7 space-y-3">
            {watchesList.map((w) => (
              <div
                key={w.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-3.5"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={w.imageUrl}
                    alt={w.name}
                    className="h-14 w-14 rounded-xl object-cover bg-stone-100"
                  />
                  <div>
                    <Link
                      href={`/watches/${w.slug}`}
                      className="font-serif text-sm font-bold text-zinc-950 hover:text-amber-800"
                    >
                      {w.name}
                    </Link>
                    <p className="text-xs text-zinc-500">
                      {formatPrice(w.pricePkr)} • Stock:{" "}
                      <strong className="text-zinc-900">{w.stock}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRestock(w)}
                    className="rounded-lg border border-stone-300 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-zinc-800 hover:bg-zinc-950 hover:text-white cursor-pointer"
                  >
                    +10 Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteWatch(w)}
                    aria-label="Delete SKU"
                    className="rounded-lg border border-stone-200 p-1.5 text-zinc-400 hover:border-rose-300 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INQUIRIES */}
      {tab === "inquiries" && (
        <div className="mt-6 space-y-4">
          {inquiriesList.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center text-sm text-zinc-500">
              No concierge messages submitted yet.
            </div>
          ) : (
            inquiriesList.map((inq) => (
              <div
                key={inq.id}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-sm font-bold text-zinc-950">
                    {inq.name} • {inq.phone}
                  </strong>
                  <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-bold text-amber-900">
                    {inq.topic}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-700">{inq.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
