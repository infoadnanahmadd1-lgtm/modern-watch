"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Eye,
  ShoppingBag,
  Star,
  Droplets,
  Layers,
  Zap,
} from "lucide-react";
import type { WatchRecord } from "@/db/schema";
import { useStore } from "@/context/StoreContext";

interface WatchCardProps {
  watch: WatchRecord;
}

export function WatchCard({ watch }: WatchCardProps) {
  const {
    formatPrice,
    addToCart,
    wishlistIds,
    toggleWishlist,
    setQuickViewWatch,
  } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<string>(
    watch.variants?.[0]?.name || "Signature Finish"
  );

  const isWishlisted = wishlistIds.includes(watch.id);
  const savingsPct =
    watch.compareAtPricePkr > watch.pricePkr
      ? Math.round(
          ((watch.compareAtPricePkr - watch.pricePkr) /
            watch.compareAtPricePkr) *
            100
        )
      : 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-xl">
      {/* Studio Image Container */}
      <div className="relative aspect-[4/4.2] w-full overflow-hidden bg-stone-100">
        <Link href={`/watches/${watch.slug}`} className="block h-full w-full">
          <img
            src={watch.imageUrl}
            alt={watch.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Top-left Mega Deal / Bundle Badge */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-950/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 backdrop-blur-xs shadow-sm">
            {watch.badge}
          </span>
          {watch.isPackOfTwo && (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-950 shadow-xs">
              <Layers className="h-3 w-3" /> 2 Watches Included
            </span>
          )}
        </div>

        {/* Top-right Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(watch.id)}
            aria-label="Save to wishlist"
            className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition-all cursor-pointer ${
              isWishlisted
                ? "border-rose-500 bg-rose-500 text-white shadow-md"
                : "border-white/60 bg-white/85 text-zinc-700 hover:bg-white hover:text-rose-600"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setQuickViewWatch(watch)}
            aria-label="Quick view specifications"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/85 text-zinc-700 backdrop-blur-md transition-all hover:bg-zinc-950 hover:text-amber-300 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Bottom Waterproof / Stock Pill */}
        <div className="pointer-events-none absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
          {watch.isWaterproof ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-zinc-800 backdrop-blur-xs shadow-2xs">
              <Droplets className="h-3 w-3 text-sky-600" />
              {watch.waterResistance.split(" ").slice(0, 2).join(" ")}
            </span>
          ) : (
            <span />
          )}

          {watch.stock <= 20 && watch.stock > 0 && (
            <span className="rounded-md bg-amber-100/95 px-2 py-0.5 text-[10px] font-bold text-amber-900">
              Only {watch.stock} left
            </span>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Brand & Rating Row */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold uppercase tracking-widest text-amber-800 text-[10px]">
            {watch.brand}
          </span>
          <div className="flex items-center gap-1 text-zinc-700">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{watch.rating.toFixed(1)}</span>
            <span className="text-zinc-400">({watch.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/watches/${watch.slug}`}
          className="mt-1.5 line-clamp-2 font-serif text-lg font-bold leading-snug text-zinc-950 group-hover:text-amber-800 transition-colors"
        >
          {watch.name}
        </Link>

        <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
          {watch.caseSizeMm}mm • {watch.movement}
        </p>

        {/* Variant Swatches */}
        {watch.variants && watch.variants.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            {watch.variants.map((v) => {
              const active = selectedVariant === v.name;
              return (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => setSelectedVariant(v.name)}
                  title={v.name}
                  className={`group/swatch relative flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all cursor-pointer ${
                    active
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-stone-200 bg-stone-50 text-zinc-600 hover:border-stone-400"
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-white/50 shrink-0"
                    style={{ backgroundColor: v.hex }}
                  />
                  <span className="max-w-[82px] truncate">{v.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Pricing Block */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-extrabold text-zinc-950 tabular-nums">
              {formatPrice(watch.pricePkr)}
            </span>
            {watch.compareAtPricePkr > watch.pricePkr && (
              <span className="font-mono text-xs text-zinc-400 line-through tabular-nums">
                {formatPrice(watch.compareAtPricePkr)}
              </span>
            )}
          </div>
          {savingsPct > 0 && (
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/70">
              -{savingsPct}%
            </span>
          )}
        </div>

        {/* Dual Action Buttons: Add to Bag + Express COD */}
        <div className="mt-3.5 grid grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => addToCart(watch, selectedVariant, 1, false)}
            disabled={watch.stock <= 0}
            className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-stone-50 px-2.5 py-2.5 text-xs font-semibold text-zinc-900 hover:border-zinc-900 hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>

          <button
            type="button"
            onClick={() => addToCart(watch, selectedVariant, 1, true)}
            disabled={watch.stock <= 0}
            className="col-span-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-950 px-3 py-2.5 text-xs font-bold text-amber-300 shadow-xs hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{watch.stock > 0 ? "Order COD" : "Sold Out"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
