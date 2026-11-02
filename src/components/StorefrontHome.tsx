"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Search,
  SlidersHorizontal,
  Star,
  Zap,
  Layers,
  Droplets,
  Sparkles,
  CheckCircle2,
  MessageSquarePlus,
  Send,
  ArrowRight,
  Heart,
} from "lucide-react";
import type { WatchRecord, ReviewRecord } from "@/db/schema";
import { useStore } from "@/context/StoreContext";
import { WatchCard } from "./WatchCard";
import { LiveHorologyDial } from "./LiveHorologyDial";

interface StorefrontHomeProps {
  initialWatches: WatchRecord[];
  initialReviews: ReviewRecord[];
}

type FilterTab =
  | "all"
  | "combo"
  | "luxury"
  | "waterproof"
  | "under1500"
  | "sports"
  | "smart"
  | "wishlist";

type SortMode =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "discount"
  | "rating";

export function StorefrontHome({
  initialWatches,
  initialReviews,
}: StorefrontHomeProps) {
  const { formatPrice, addToCart, wishlistIds, showToast } = useStore();

  const [watchesList] = useState<WatchRecord[]>(initialWatches);
  const [reviewsList, setReviewsList] =
    useState<ReviewRecord[]>(initialReviews);

  // Catalog Filters
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [onlyWaterproof, setOnlyWaterproof] = useState(false);

  // Review Submission Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [revName, setRevName] = useState("");
  const [revCity, setRevCity] = useState("Lahore");
  const [revWatchId, setRevWatchId] = useState<number>(
    initialWatches[0]?.id ?? 1
  );
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Concierge Inquiry Form State
  const [inqName, setInqName] = useState("");
  const [inqPhone, setInqPhone] = useState("");
  const [inqEmail, setInqEmail] = useState("");
  const [inqTopic, setInqTopic] = useState("Gift / Pack of 2 Recommendation");
  const [inqMessage, setInqMessage] = useState("");
  const [submittingInq, setSubmittingInq] = useState(false);
  const [inqSuccess, setInqSuccess] = useState(false);

  const heroWatch =
    watchesList.find(
      (w) => w.slug === "obsidian-chronos-master-lock-executive"
    ) || watchesList[0];

  const packOfTwoWatches = useMemo(
    () => watchesList.filter((w) => w.isPackOfTwo),
    [watchesList]
  );

  const filteredWatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = watchesList.filter((w) => {
      if (activeTab === "combo" && !w.isPackOfTwo) return false;
      if (activeTab === "luxury" && w.category !== "luxury") return false;
      if (
        activeTab === "waterproof" &&
        w.category !== "waterproof" &&
        !w.isWaterproof
      )
        return false;
      if (activeTab === "under1500" && w.pricePkr > 1500) return false;
      if (activeTab === "sports" && w.category !== "sports") return false;
      if (activeTab === "smart" && w.category !== "smart") return false;
      if (activeTab === "wishlist" && !wishlistIds.includes(w.id)) return false;

      if (onlyWaterproof && !w.isWaterproof) return false;

      if (q) {
        const hay =
          `${w.name} ${w.subtitle} ${w.brand} ${w.category} ${w.movement} ${w.badge}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortMode === "price-asc") return a.pricePkr - b.pricePkr;
      if (sortMode === "price-desc") return b.pricePkr - a.pricePkr;
      if (sortMode === "rating") return b.rating - a.rating;
      if (sortMode === "discount") {
        const discA = (a.compareAtPricePkr - a.pricePkr) / a.compareAtPricePkr;
        const discB = (b.compareAtPricePkr - b.pricePkr) / b.compareAtPricePkr;
        return discB - discA;
      }
      return Number(b.featured) - Number(a.featured) || a.id - b.id;
    });
  }, [watchesList, activeTab, onlyWaterproof, searchQuery, sortMode, wishlistIds]);

  const jumpToCollection = (tab: FilterTab) => {
    setActiveTab(tab);
    const el = document.getElementById("catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || revComment.trim().length < 5) return;
    setSubmittingReview(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          watchId: revWatchId,
          customerName: revName,
          city: revCity,
          rating: revRating,
          comment: revComment,
        }),
      });
      const data = await res.json();
      if (res.ok && data.review) {
        setReviewsList((prev) => [data.review, ...prev]);
        setRevName("");
        setRevComment("");
        setShowReviewForm(false);
        showToast("Thank you! Your verified review is now live.");
      }
    } catch {
      showToast("Could not post review right now.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqName.trim() || !inqPhone.trim() || !inqMessage.trim()) return;
    setSubmittingInq(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inqName,
          phone: inqPhone,
          email: inqEmail,
          topic: inqTopic,
          message: inqMessage,
        }),
      });
      if (res.ok) {
        setInqSuccess(true);
        setInqName("");
        setInqPhone("");
        setInqEmail("");
        setInqMessage("");
        showToast("Message received by Modern Watch Concierge!");
      }
    } catch {
      showToast("Unable to send message right now.");
    } finally {
      setSubmittingInq(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900">
      {/* 1. LUXURY OBSIDIAN & CHAMPAGNE HERO */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        {/* Subtle Radial Champagne Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-amber-500/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-10 h-[360px] w-[360px] rounded-full bg-amber-600/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:py-20 lg:px-8">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300">
              <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>11.11 MEGA HOROLOGY SALE • UP TO 50% OFF SITEWIDE</span>
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
              Modern Timepieces,{" "}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                Crafted to Command
              </span>{" "}
              Every Second.
            </h1>

            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-zinc-300">
              From weighted Jubilee two-tone icons and 5ATM waterproof divers to
              our bestselling{" "}
              <strong className="text-white">Pack of 2 Steel Bundles</strong>{" "}
              and{" "}
              <strong className="text-amber-300">Under Rs. 1,500</strong> daily
              classics—delivered nationwide with Cash on Delivery.
            </p>

            {/* Primary Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => jumpToCollection("all")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-extrabold text-zinc-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300 transition-all cursor-pointer"
              >
                Explore All Watches
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => jumpToCollection("combo")}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/90 px-5 py-3.5 text-sm font-bold text-white hover:border-amber-400/60 hover:text-amber-300 transition-all cursor-pointer"
              >
                <Layers className="h-4 w-4 text-amber-400" />
                Pack of 2 Combos
              </button>

              <button
                type="button"
                onClick={() => jumpToCollection("under1500")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-amber-300 hover:border-amber-400/40 transition-all cursor-pointer"
              >
                Under {formatPrice(1500)}
              </button>
            </div>

            {/* Live Ticking Chronometer + Key Metrics */}
            <div className="pt-4 flex flex-wrap items-center gap-6">
              <LiveHorologyDial />

              <div className="flex items-center gap-6 border-l border-zinc-800 pl-6">
                <div>
                  <p className="font-mono text-2xl font-extrabold text-white">
                    4.9★
                  </p>
                  <p className="text-xs text-zinc-400">Verified Collectors</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-extrabold text-amber-300">
                    7-Day
                  </p>
                  <p className="text-xs text-zinc-400">Easy Return Policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Flagship Watch Showcase Card */}
          <div className="lg:col-span-5">
            {heroWatch && (
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-amber-400/25 bg-zinc-900/80 p-4 shadow-2xl backdrop-blur-md">
                <div className="relative aspect-[4/4.3] overflow-hidden rounded-2xl bg-zinc-950">
                  <img
                    src={heroWatch.imageUrl}
                    alt={heroWatch.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-zinc-950 shadow-md">
                    Flagship Edition
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/15 bg-zinc-950/85 p-3.5 backdrop-blur-md">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                          {heroWatch.brand}
                        </p>
                        <Link
                          href={`/watches/${heroWatch.slug}`}
                          className="mt-0.5 block font-serif text-lg font-bold text-white hover:text-amber-300 transition-colors"
                        >
                          {heroWatch.name}
                        </Link>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block font-mono text-lg font-extrabold text-amber-300">
                          {formatPrice(heroWatch.pricePkr)}
                        </span>
                        <span className="block font-mono text-xs text-zinc-400 line-through">
                          {formatPrice(heroWatch.compareAtPricePkr)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          addToCart(
                            heroWatch,
                            heroWatch.variants?.[0]?.name,
                            1,
                            true
                          )
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 py-2.5 text-xs font-extrabold text-zinc-950 hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        <Zap className="h-3.5 w-3.5 fill-zinc-950" />
                        Order on Cash on Delivery
                      </button>
                      <Link
                        href={`/watches/${heroWatch.slug}`}
                        className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-white hover:border-amber-400"
                      >
                        Specs
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. TRUST PROMISE BAR (Honoring modernwatch.fun's 4 pillars) */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            {
              icon: Award,
              title: "100% Original Products",
              sub: "Inspected dials, clasps & movements",
            },
            {
              icon: Truck,
              title: "Fast & Secure Delivery",
              sub: "Cushioned gift box • 2–4 days nationwide",
            },
            {
              icon: ShieldCheck,
              title: "Cash on Delivery",
              sub: "Zero risk • Pay courier at doorstep",
            },
            {
              icon: RotateCcw,
              title: "7 Days Return Policy",
              sub: "Instant exchange & 1-Yr machine care",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-stone-100 bg-stone-50/70 px-3.5 py-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-amber-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-950">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CURATED COLLECTION CARDS */}
      <section
        id="collections"
        className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">
              Shop By Signature Series
            </span>
            <h2 className="mt-1 font-serif text-3xl font-bold text-zinc-950">
              Curated Watch Collections
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500">
            Select any horological category below to filter the live catalog
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              tab: "combo" as FilterTab,
              title: "Pack of 2 Offers",
              tag: "2 Watches • Save 48%",
              img: "/images/watches/pack2-steel-bundle.jpg",
            },
            {
              tab: "luxury" as FilterTab,
              title: "Executive & Fluted",
              tag: "Jubilee & Automatic",
              img: "/images/watches/twotone-royal.jpg",
            },
            {
              tab: "waterproof" as FilterTab,
              title: "5ATM Waterproof",
              tag: "Swim & Wudu Safe",
              img: "/images/watches/obsidian-diver.jpg",
            },
            {
              tab: "under1500" as FilterTab,
              title: `Under ${formatPrice(1500)}`,
              tag: "Mega Budget Steals",
              img: "/images/watches/arabic-aura-black.jpg",
            },
            {
              tab: "sports" as FilterTab,
              title: "Sports & Dual-Time",
              tag: "Shock & World Time",
              img: "/images/watches/dualtime-sports.jpg",
            },
          ].map((col) => (
            <button
              key={col.tab}
              type="button"
              onClick={() => jumpToCollection(col.tab)}
              className="group relative aspect-[4/4.6] overflow-hidden rounded-2xl border border-stone-200 bg-zinc-950 text-left shadow-xs cursor-pointer"
            >
              <img
                src={col.img}
                alt={col.title}
                className="h-full w-full object-cover opacity-85 transition-transform duration-500 group-hover:scale-108 group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5">
                <span className="inline-block rounded-md bg-amber-400/95 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-950">
                  {col.tag}
                </span>
                <h3 className="mt-1.5 font-serif text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {col.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. PACK OF 2 OFFERS SPOTLIGHT (Direct homage to modernwatch.fun's #1 section) */}
      <section
        id="pack-of-2"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-8 lg:p-10 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
                <Layers className="h-3.5 w-3.5" />
                SIGNATURE TWIN BUNDLES
              </div>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-white">
                Pack of 2 Mega Combo Offers
              </h2>
              <p className="mt-1 text-sm text-zinc-300 max-w-2xl">
                Double your rotation or share a gift—receive{" "}
                <strong className="text-amber-300">
                  two complete wristwatches
                </strong>{" "}
                in a dual presentation box at one unbeatable bundle price.
              </p>
            </div>
            <button
              type="button"
              onClick={() => jumpToCollection("combo")}
              className="self-start md:self-auto rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-amber-300 hover:bg-amber-400 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              Filter All Bundles →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {packOfTwoWatches.map((watch) => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. MAIN INTERACTIVE WATCH CATALOG */}
      <section
        id="catalog"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">
              Complete Horological Showcase
            </span>
            <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-zinc-950">
              Explore Timepieces
            </h2>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Jubilee, Arabic, Skmei..."
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pr-3.5 pl-10 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyWaterproof((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                onlyWaterproof
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-stone-300 bg-white text-zinc-700 hover:border-zinc-900"
              }`}
            >
              <Droplets className="h-3.5 w-3.5" />
              Waterproof Only
            </button>

            <div className="relative inline-flex items-center">
              <SlidersHorizontal className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-zinc-500" />
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                aria-label="Sort watches"
                className="rounded-xl border border-stone-300 bg-white py-2.5 pr-8 pl-8 text-xs font-bold text-zinc-800 focus:border-zinc-950 focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Biggest % Discount</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { id: "all", label: "All Watches", count: watchesList.length },
            {
              id: "combo",
              label: "⚡ Pack of 2 Offers",
              count: watchesList.filter((w) => w.isPackOfTwo).length,
            },
            {
              id: "luxury",
              label: "Executive & Luxury",
              count: watchesList.filter((w) => w.category === "luxury").length,
            },
            {
              id: "waterproof",
              label: "Waterproof Collection",
              count: watchesList.filter((w) => w.isWaterproof).length,
            },
            {
              id: "under1500",
              label: `Under ${formatPrice(1500)}`,
              count: watchesList.filter((w) => w.pricePkr <= 1500).length,
            },
            {
              id: "sports",
              label: "Sports & Digital",
              count: watchesList.filter((w) => w.category === "sports").length,
            },
            {
              id: "smart",
              label: "Smart Watches",
              count: watchesList.filter((w) => w.category === "smart").length,
            },
            {
              id: "wishlist",
              label: "Saved Wishlist",
              count: wishlistIds.length,
            },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "border-zinc-950 bg-zinc-950 text-amber-300 shadow-sm"
                    : "border-stone-300 bg-white text-zinc-700 hover:border-zinc-900"
                }`}
              >
                {tab.id === "wishlist" && (
                  <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                )}
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    active
                      ? "bg-amber-400/20 text-amber-200"
                      : "bg-stone-100 text-zinc-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredWatches.length === 0 ? (
          <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-amber-600" />
            <h3 className="mt-3 font-serif text-xl font-bold text-zinc-950">
              No matching timepieces found
            </h3>
            <p className="mt-1 text-sm text-zinc-500">
              Try clearing your search or switching back to All Watches.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
                setOnlyWaterproof(false);
              }}
              className="mt-5 rounded-xl bg-zinc-950 px-5 py-2.5 text-xs font-bold text-amber-300 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWatches.map((watch) => (
              <WatchCard key={watch.id} watch={watch} />
            ))}
          </div>
        )}
      </section>

      {/* 6. "LET CUSTOMERS SPEAK FOR US" VERIFIED REVIEWS WALL */}
      <section
        id="reviews"
        className="border-t border-stone-200 bg-white py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                4.9 / 5.0 Average Rating • {reviewsList.length + 72}+ Reviews
              </div>
              <h2 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-zinc-950">
                Let Customers Speak For Us
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm((v) => !v)}
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-zinc-950 px-5 py-3 text-xs font-bold text-amber-300 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="h-4 w-4" />
              {showReviewForm ? "Close Review Form" : "Write a Customer Review"}
            </button>
          </div>

          {/* Interactive Write-a-Review Drawer */}
          {showReviewForm && (
            <form
              onSubmit={handleReviewSubmit}
              className="mb-10 rounded-3xl border border-amber-400/40 bg-[#FAF9F6] p-6 sm:p-8 shadow-md"
            >
              <h3 className="font-serif text-xl font-bold text-zinc-950">
                Share Your Modern Watch Experience
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Your review is stored directly in our verified collector ledger.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="e.g. Bilal Khan"
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={revCity}
                    onChange={(e) => setRevCity(e.target.value)}
                    placeholder="Lahore, Islamabad..."
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Timepiece Purchased
                  </label>
                  <select
                    value={revWatchId}
                    onChange={(e) => setRevWatchId(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-zinc-950 focus:outline-none"
                  >
                    {watchesList.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRevRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= revRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  Your Review *
                </label>
                <textarea
                  rows={3}
                  required
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  placeholder="How is the wrist weight, dial finish, and delivery speed?"
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="rounded-xl bg-zinc-950 px-6 py-3 text-xs font-bold text-amber-300 hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
                >
                  {submittingReview ? "Publishing..." : "Publish Verified Review"}
                </button>
              </div>
            </form>
          )}

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reviewsList.slice(0, 8).map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-[#FAF9F6] p-5 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-700">
                    “{rev.comment}”
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-stone-200/80">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="font-bold text-zinc-950">
                      {rev.customerName}
                    </strong>
                    <span className="text-zinc-400">{rev.city}</span>
                  </div>

                  {/* Miniature Purchased Watch Tag (signature modernwatch.fun detail) */}
                  <div className="mt-2.5 flex items-center gap-2.5 rounded-xl bg-white p-2 border border-stone-200/70">
                    <img
                      src={rev.watchImage}
                      alt={rev.watchName}
                      className="h-9 w-9 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <span className="line-clamp-2 text-[11px] font-semibold text-zinc-700 leading-tight">
                      {rev.watchName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONCIERGE, WHOLESALE & SHOWROOM INQUIRY SECTION */}
      <section
        id="concierge"
        className="border-t border-stone-200 bg-[#FAF9F6] py-16"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">
              Horological Concierge
            </span>
            <h2 className="font-serif text-3xl font-bold text-zinc-950">
              Need Gift Sizing, Bulk Corporate Sets, or Order Help?
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              Our watch specialists at Modern Watch Company inspect every clasp,
              date wheel, and gasket prior to dispatch. Reach out for wedding
              Pack-of-2 bundles, wholesale pricing, or parcel updates.
            </p>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-3 text-xs text-zinc-700">
              <div>
                <strong className="block text-zinc-950">
                  Heritage Showroom
                </strong>
                <span>Sarafa Bazar, Abbottabad 22010, Pakistan</span>
              </div>
              <div>
                <strong className="block text-zinc-950">
                  Direct WhatsApp & Support Line
                </strong>
                <span>+92 346 4653712 (Mon–Sun, 10:00 AM – 10:00 PM)</span>
              </div>
              <div className="pt-2">
                <Link
                  href="/track-order"
                  className="inline-flex items-center gap-1.5 font-bold text-amber-800 hover:text-zinc-950"
                >
                  Already placed an order? Track your Order ID live →
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleInquirySubmit}
              className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-4"
            >
              {inqSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800">
                  Thank you! Your inquiry has been logged and our watch
                  concierge will respond shortly.
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inqName}
                    onChange={(e) => setInqName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-zinc-950 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={inqPhone}
                    onChange={(e) => setInqPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-zinc-950 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={inqEmail}
                    onChange={(e) => setInqEmail(e.target.value)}
                    placeholder="optional@email.com"
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-zinc-950 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Topic
                  </label>
                  <select
                    value={inqTopic}
                    onChange={(e) => setInqTopic(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-zinc-950 focus:bg-white focus:outline-none"
                  >
                    <option>Gift / Pack of 2 Recommendation</option>
                    <option>Order Dispatch & COD Inquiry</option>
                    <option>Wholesale / Corporate Bulk Order</option>
                    <option>7-Day Return / Warranty Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  Message *
                </label>
                <textarea
                  rows={3}
                  required
                  value={inqMessage}
                  onChange={(e) => setInqMessage(e.target.value)}
                  placeholder="Tell us which watch or bundle you're interested in..."
                  className="w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm focus:border-zinc-950 focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingInq}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3.5 text-xs sm:text-sm font-bold text-amber-300 hover:bg-zinc-800 transition-colors disabled:opacity-60 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                {submittingInq ? "Sending..." : "Send Message to Atelier"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
