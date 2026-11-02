"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  PackageCheck,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowLeft,
  Clock,
} from "lucide-react";
import type { OrderRecord } from "@/db/schema";
import { useStore } from "@/context/StoreContext";

const STAGES = ["Confirmed", "Quality Checked", "Dispatched", "Delivered"];

export function OrderTrackerClient({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const { formatPrice } = useStore();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const runSearch = useCallback(async (qToRun: string) => {
    const trimmed = qToRun.trim();
    if (!trimmed) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      setResults(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      runSearch(initialQuery);
    }
  }, [initialQuery, runSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-950"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Modern Watch Store
      </Link>

      <div className="mt-5 rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">
          Nationwide Insured Dispatch
        </span>
        <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-zinc-950">
          Track Your Watch Parcel
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Enter your Order ID (e.g.{" "}
          <button
            type="button"
            onClick={() => {
              setQuery("MW-2026-1111");
              runSearch("MW-2026-1111");
            }}
            className="font-mono font-bold text-amber-800 underline hover:text-zinc-950 cursor-pointer"
          >
            MW-2026-1111
          </button>
          ) or the mobile phone number used during Cash-on-Delivery checkout.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order ID (MW-2026-XXXX) or Phone Number..."
              className="w-full rounded-xl border border-stone-300 bg-stone-50 py-3.5 pr-4 pl-11 text-sm text-zinc-950 focus:border-zinc-950 focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-zinc-950 px-7 py-3.5 text-sm font-bold text-amber-300 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {loading ? "Locating..." : "Track Order"}
          </button>
        </form>

        {/* Results */}
        {searched && !loading && results.length === 0 && (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center">
            <Clock className="mx-auto h-7 w-7 text-zinc-400" />
            <h3 className="mt-2 font-serif text-lg font-bold text-zinc-900">
              No matching order found
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Double-check your Order ID (such as MW-2026-1111) or phone number.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-8 space-y-6">
            {results.map((order) => {
              const stageIdx = Math.max(0, STAGES.indexOf(order.status));
              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-stone-200 bg-[#FAF9F6] p-6 space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
                    <div>
                      <span className="text-xs text-zinc-500">Order Reference</span>
                      <h3 className="font-mono text-lg font-extrabold text-zinc-950">
                        {order.orderNumber}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Recipient: <strong>{order.customerName}</strong> •{" "}
                        {order.city}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-950 px-3.5 py-1 text-xs font-bold text-amber-300">
                        {order.status}
                      </span>
                      <p className="mt-1 font-mono text-base font-extrabold text-zinc-950">
                        {formatPrice(order.totalPkr)}
                      </p>
                    </div>
                  </div>

                  {/* 4-Step Visual Fulfillment Timeline */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Confirmed", icon: PackageCheck },
                      { label: "Quality Checked", icon: ShieldCheck },
                      { label: "Dispatched", icon: Truck },
                      { label: "Delivered", icon: CheckCircle2 },
                    ].map((st, idx) => {
                      const Icon = st.icon;
                      const reached = idx <= stageIdx;
                      return (
                        <div
                          key={st.label}
                          className={`rounded-xl border p-3 text-center transition-all ${
                            reached
                              ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                              : "border-stone-200 bg-white text-zinc-400"
                          }`}
                        >
                          <Icon
                            className={`mx-auto h-5 w-5 ${
                              reached ? "text-emerald-600" : "text-zinc-300"
                            }`}
                          />
                          <span className="mt-1.5 block text-xs font-bold">
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Line Items */}
                  <div className="space-y-2.5">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-12 w-12 rounded-lg object-cover bg-stone-100"
                          />
                          <div>
                            <p className="font-serif text-sm font-bold text-zinc-950">
                              {item.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              Finish: {item.variant} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-bold text-zinc-950">
                          {formatPrice(item.pricePkr * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
