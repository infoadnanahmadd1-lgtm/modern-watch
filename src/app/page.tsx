import React from "react";
import { db } from "@/db";
import { watches, reviews, type WatchRecord, type ReviewRecord } from "@/db/schema";
import { ensureStoreSeeded, INITIAL_WATCHES } from "@/db/seed";
import { asc, desc } from "drizzle-orm";
import { StorefrontHome } from "@/components/StorefrontHome";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let watchesData: WatchRecord[] = [];
  let reviewsData: ReviewRecord[] = [];

  try {
    await ensureStoreSeeded();
    watchesData = await db
      .select()
      .from(watches)
      .orderBy(desc(watches.featured), asc(watches.id));

    reviewsData = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt), desc(reviews.id))
      .limit(20);
  } catch (err) {
    console.warn("Fallback to static catalog while DB initializes:", err);
    watchesData = INITIAL_WATCHES.map((w, idx) => ({
      id: idx + 1,
      slug: w.slug,
      name: w.name,
      subtitle: w.subtitle,
      brand: w.brand,
      category: w.category,
      pricePkr: w.pricePkr,
      compareAtPricePkr: w.compareAtPricePkr,
      badge: w.badge,
      isPackOfTwo: Boolean(w.isPackOfTwo),
      isWaterproof: w.isWaterproof !== false,
      featured: Boolean(w.featured),
      movement: w.movement,
      waterResistance: w.waterResistance,
      caseMaterial: w.caseMaterial,
      strapType: w.strapType,
      caseSizeMm: w.caseSizeMm,
      warranty: w.warranty ?? "1 Year Machine Warranty • 7-Day Easy Return",
      stock: w.stock ?? 24,
      rating: w.rating ?? 4.9,
      reviewCount: w.reviewCount ?? 18,
      imageUrl: w.imageUrl,
      galleryUrls: w.galleryUrls,
      variants: w.variants,
      highlights: w.highlights,
      description: w.description,
      createdAt: new Date(),
    }));
  }

  return (
    <StorefrontHome
      initialWatches={watchesData}
      initialReviews={reviewsData}
    />
  );
}
