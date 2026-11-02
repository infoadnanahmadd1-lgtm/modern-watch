import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { watches, reviews } from "@/db/schema";
import { ensureStoreSeeded } from "@/db/seed";
import { desc, eq, ne } from "drizzle-orm";
import { WatchDetailClient } from "@/components/WatchDetailClient";

export const dynamic = "force-dynamic";

export default async function WatchProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await ensureStoreSeeded();
  const { slug } = await params;

  const [watch] = await db
    .select()
    .from(watches)
    .where(eq(watches.slug, slug));

  if (!watch) {
    notFound();
  }

  const watchReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.watchId, watch.id))
    .orderBy(desc(reviews.createdAt), desc(reviews.id));

  const related = await db
    .select()
    .from(watches)
    .where(ne(watches.id, watch.id))
    .orderBy(desc(watches.featured))
    .limit(4);

  return (
    <WatchDetailClient
      watch={watch}
      initialReviews={watchReviews}
      relatedWatches={related}
    />
  );
}
