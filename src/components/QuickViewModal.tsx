"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Star,
  CheckCircle2,
  ShoppingBag,
  Zap,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function QuickViewModal() {
  const { quickViewWatch, setQuickViewWatch, formatPrice, addToCart } =
    useStore();
  const [selectedVariant, setSelectedVariant] = useState("");
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (quickViewWatch) {
      setSelectedVariant(
        quickViewWatch.variants?.[0]?.name || "Signature Finish"
      );
      setActiveImage(quickViewWatch.imageUrl);
    }
  }, [quickViewWatch]);

  if (!quickViewWatch) return null;

  const images =
    quickViewWatch.galleryUrls && quickViewWatch.galleryUrls.length > 0
      ? quickViewWatch.galleryUrls
      : [quickViewWatch.imageUrl];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm"
      onClick={() => setQuickViewWatch(null)}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-stone-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setQuickViewWatch(null)}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-zinc-700 hover:bg-zinc-950 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Image Gallery */}
          <div className="bg-stone-100 p-6 flex flex-col justify-between">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-xs">
              <img
                src={activeImage || quickViewWatch.imageUrl}
                alt={quickViewWatch.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute top-3 left-3 rounded-full bg-zinc-950 px-3 py-1 text-[11px] font-bold text-amber-300">
                {quickViewWatch.badge}
              </span>
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex items-center gap-2.5">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                      activeImage === imgUrl
                        ? "border-zinc-950 shadow-sm"
                        : "border-transparent opacity-70 hover:opacity-100"
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

          {/* Right Specifications & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
                  {quickViewWatch.brand}
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-700 mr-8">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{quickViewWatch.rating.toFixed(1)}</span>
                  <span className="text-zinc-400">
                    ({quickViewWatch.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <h3 className="mt-2 font-serif text-2xl font-bold text-zinc-950 leading-tight">
                {quickViewWatch.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-zinc-500">
                {quickViewWatch.subtitle}
              </p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-mono text-2xl font-extrabold text-zinc-950">
                  {formatPrice(quickViewWatch.pricePkr)}
                </span>
                {quickViewWatch.compareAtPricePkr > quickViewWatch.pricePkr && (
                  <span className="font-mono text-sm text-zinc-400 line-through">
                    {formatPrice(quickViewWatch.compareAtPricePkr)}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                {quickViewWatch.description}
              </p>

              {/* Finish Swatches */}
              {quickViewWatch.variants && quickViewWatch.variants.length > 0 && (
                <div className="mt-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                    Select Finish:{" "}
                    <span className="text-amber-800">{selectedVariant}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {quickViewWatch.variants.map((v) => (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => setSelectedVariant(v.name)}
                        className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                          selectedVariant === v.name
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : "border-stone-300 bg-stone-50 text-zinc-700 hover:border-zinc-700"
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-white/50"
                          style={{ backgroundColor: v.hex }}
                        />
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Compact Horological Spec Grid */}
              <div className="mt-5 grid grid-cols-2 gap-2.5 rounded-2xl bg-stone-50 p-3.5 text-xs border border-stone-200/80">
                <div>
                  <span className="text-zinc-400 block">Caliber</span>
                  <span className="font-semibold text-zinc-900">
                    {quickViewWatch.movement}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Water Resistance</span>
                  <span className="font-semibold text-zinc-900">
                    {quickViewWatch.waterResistance}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Case & Diameter</span>
                  <span className="font-semibold text-zinc-900">
                    {quickViewWatch.caseSizeMm}mm •{" "}
                    {quickViewWatch.caseMaterial.split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Strap / Bracelet</span>
                  <span className="font-semibold text-zinc-900">
                    {quickViewWatch.strapType}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <ul className="mt-4 space-y-1.5">
                {quickViewWatch.highlights?.slice(0, 3).map((hl, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-zinc-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 space-y-3 pt-4 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const w = quickViewWatch;
                    setQuickViewWatch(null);
                    addToCart(w, selectedVariant, 1, false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-white px-4 py-3 text-xs sm:text-sm font-bold text-zinc-950 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Bag
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const w = quickViewWatch;
                    setQuickViewWatch(null);
                    addToCart(w, selectedVariant, 1, true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-xs sm:text-sm font-bold text-amber-300 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Zap className="h-4 w-4 fill-amber-400 text-amber-400" />
                  Buy on COD
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Cash on Delivery • 7-Day Easy Return
                </span>
                <Link
                  href={`/watches/${quickViewWatch.slug}`}
                  onClick={() => setQuickViewWatch(null)}
                  className="inline-flex items-center gap-1 font-semibold text-zinc-900 hover:text-amber-800"
                >
                  Full Details & Reviews
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
