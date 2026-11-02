"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ChevronRight,
  Droplets,
} from "lucide-react";
import type { WatchRecord, ReviewRecord } from "@/db/schema";
import { useStore } from "@/context/StoreContext";
import { WatchCard } from "./WatchCard";

interface WatchDetailClientProps {
  watch: WatchRecord;
  initialReviews: ReviewRecord[];
  relatedWatches: WatchRecord[];
}

export function WatchDetailClient({
  watch,
  initialReviews,
  relatedWatches,
}: WatchDetailClientProps) {
  const {
    formatPrice,
    addToCart,
    wishlistIds,
    toggleWishlist,
    showToast,
  } = useStore();

  const [selectedVariant, setSelectedVariant] = useState(
    watch.variants?.[0]?.name || "Signature Finish"
  );
  const [activeImage, setActiveImage] = useState(watch.imageUrl);
  const [quantity, setQuantity] = useState(1);
  const [reviewsList, setReviewsList] =
    useState<ReviewRecord[]>(initialReviews);

  // Review form
  const [revName, setRevName] = useState("");
  const [revCity, setRevCity] = useState("Lahore");
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState("");
  const [postingRev, setPostingRev] = useState(false);

  const isWishlisted = wishlistIds.includes(watch.id);
  const gallery =
    watch.galleryUrls && watch.galleryUrls.length > 0
      ? watch.galleryUrls
      : [watch.imageUrl];

  const savingsPkr = Math.max(0, watch.compareAtPricePkr - watch.pricePkr);
  const savingsPct =
    watch.compareAtPricePkr > watch.pricePkr
      ? Math.round((savingsPkr / watch.compareAtPricePkr) * 100)
      : 0;

  const submitWatchReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || revComment.trim().length < 5) return;
    setPostingRev(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          watchId: watch.id,
          watchName: watch.name,
          watchImage: watch.imageUrl,
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
        showToast("Your review has been added to this timepiece!");
      }
    } catch {
      showToast("Unable to submit review right now.");
    } finally {
      setPostingRev(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] pb-20">
      {/* Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs text-zinc-500 sm:px-6 lg:px-8">
          <Link href="/" className="hover:text-zinc-950">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/#catalog" className="capitalize hover:text-zinc-950">
            {watch.category} Collection
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate font-semibold text-zinc-900">
            {watch.name}
          </span>
        </div>
      </div>

      {/* Main Split Showcase */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left Studio Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <img
                src={activeImage}
                alt={watch.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-4 left-4 rounded-full bg-zinc-950 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300 shadow-md">
                {watch.badge}
              </span>
              <button
                type="button"
                onClick={() => toggleWishlist(watch.id)}
                aria-label="Toggle wishlist"
                className={`absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border transition-all cursor-pointer ${
                  isWishlisted
                    ? "border-rose-500 bg-rose-500 text-white"
                    : "border-stone-200 bg-white/90 text-zinc-700 hover:text-rose-600"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {gallery.length > 1 && (
              <div className="flex items-center gap-3">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`h-20 w-20 overflow-hidden rounded-2xl border-2 bg-white transition-all cursor-pointer ${
                      activeImage === imgUrl
                        ? "border-zinc-950 shadow-sm"
                        : "border-stone-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Purchase & Spec Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">
                  {watch.brand}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{watch.rating.toFixed(1)}</span>
                  <span className="text-zinc-400">
                    ({watch.reviewCount} verified reviews)
                  </span>
                </div>
              </div>

              <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-zinc-950 leading-tight">
                {watch.name}
              </h1>
              <p className="mt-1.5 text-sm font-medium text-zinc-500">
                {watch.subtitle}
              </p>
            </div>

            {/* Pricing Banner */}
            <div className="flex flex-wrap items-baseline gap-3 rounded-2xl border border-stone-200 bg-white p-4">
              <span className="font-mono text-3xl font-extrabold text-zinc-950">
                {formatPrice(watch.pricePkr)}
              </span>
              {watch.compareAtPricePkr > watch.pricePkr && (
                <>
                  <span className="font-mono text-base text-zinc-400 line-through">
                    {formatPrice(watch.compareAtPricePkr)}
                  </span>
                  <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                    Save {formatPrice(savingsPkr)} ({savingsPct}% OFF)
                  </span>
                </>
              )}
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-zinc-700">
              {watch.description}
            </p>

            {/* Variant Picker */}
            {watch.variants && watch.variants.length > 0 && (
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-2.5">
                  Dial & Bracelet Finish:{" "}
                  <span className="text-amber-800">{selectedVariant}</span>
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {watch.variants.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariant(v.name)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                        selectedVariant === v.name
                          ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                          : "border-stone-300 bg-white text-zinc-700 hover:border-zinc-900"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-white/60"
                        style={{ backgroundColor: v.hex }}
                      />
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Order CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center rounded-xl border border-stone-300 bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-zinc-700 hover:text-zinc-950 cursor-pointer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 font-mono text-sm font-bold text-zinc-950">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="p-3 text-zinc-700 hover:text-zinc-950 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addToCart(watch, selectedVariant, quantity, false)
                  }
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-zinc-950 bg-white px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Watch Bag
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  addToCart(watch, selectedVariant, quantity, true)
                }
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 py-4 text-sm font-extrabold text-amber-300 shadow-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
                Order Now with Cash on Delivery •{" "}
                {formatPrice(watch.pricePkr * quantity)}
              </button>
            </div>

            {/* Key Highlights */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Craftsmanship Highlights
              </h3>
              <ul className="space-y-2">
                {watch.highlights?.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Micro-Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-[11px] font-semibold text-zinc-700">
              <div className="rounded-xl border border-stone-200 bg-white p-3">
                <Truck className="mx-auto h-4 w-4 text-amber-700 mb-1" />
                2–4 Days COD Dispatch
              </div>
              <div className="rounded-xl border border-stone-200 bg-white p-3">
                <RotateCcw className="mx-auto h-4 w-4 text-amber-700 mb-1" />7
                Days Return Policy
              </div>
              <div className="rounded-xl border border-stone-200 bg-white p-3">
                <ShieldCheck className="mx-auto h-4 w-4 text-amber-700 mb-1" />1
                Yr Machine Care
              </div>
            </div>
          </div>
        </div>

        {/* Technical Horological Specifications Table */}
        <div className="mt-14 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-zinc-950">
            Horological Specifications
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {[
              {
                label: "Reference Code",
                val: `MW-${watch.id.toString().padStart(4, "0")}`,
              },
              { label: "Movement Caliber", val: watch.movement },
              { label: "Water Resistance", val: watch.waterResistance },
              { label: "Case Diameter", val: `${watch.caseSizeMm} mm` },
              { label: "Case Construction", val: watch.caseMaterial },
              { label: "Strap / Bracelet", val: watch.strapType },
              {
                label: "Bundle Configuration",
                val: watch.isPackOfTwo
                  ? "Pack of 2 Complete Watches"
                  : "Single Timepiece in Gift Box",
              },
              { label: "Warranty Coverage", val: watch.warranty },
              {
                label: "Availability",
                val:
                  watch.stock > 0
                    ? `In Stock (${watch.stock} units inspected)`
                    : "Out of Stock",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-stone-100 bg-[#FAF9F6] p-4"
              >
                <span className="block text-xs text-zinc-400">{row.label}</span>
                <strong className="mt-0.5 block font-semibold text-zinc-950">
                  {row.val}
                </strong>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews for this Watch + Review Form */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-zinc-950">
              Verified Collector Reviews ({reviewsList.length})
            </h2>

            {reviewsList.length === 0 ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-zinc-500">
                Be the first collector to review {watch.name}.
              </div>
            ) : (
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-stone-200 bg-white p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-zinc-950">
                          {rev.customerName}
                        </strong>
                        <span className="text-xs text-zinc-400">
                          • {rev.city}
                        </span>
                      </div>
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
                    </div>
                    <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                      “{rev.comment}”
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={submitWatchReview}
              className="rounded-3xl border border-stone-200 bg-white p-6 space-y-4"
            >
              <h3 className="font-serif text-xl font-bold text-zinc-950">
                Review This Timepiece
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="Name"
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={revCity}
                    onChange={(e) => setRevCity(e.target.value)}
                    placeholder="Lahore"
                    className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Star Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRevRating(s)}
                      className="p-0.5 cursor-pointer"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          s <= revRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Comment *
                </label>
                <textarea
                  rows={3}
                  required
                  value={revComment}
                  onChange={(e) => setRevComment(e.target.value)}
                  placeholder="Share your thoughts on build quality, weight, and style..."
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-zinc-950 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={postingRev}
                className="w-full rounded-xl bg-zinc-950 py-3 text-xs font-bold text-amber-300 hover:bg-zinc-800 cursor-pointer"
              >
                {postingRev ? "Submitting..." : "Submit Verified Review"}
              </button>
            </form>
          </div>
        </div>

        {/* Related Watches */}
        {relatedWatches.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950">
                You May Also Appreciate
              </h2>
              <Link
                href="/#catalog"
                className="text-xs font-bold text-amber-800 hover:text-zinc-950"
              >
                View All Watches →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedWatches.map((rw) => (
                <WatchCard key={rw.id} watch={rw} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
