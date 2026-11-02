import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, watches } from "@/db/schema";
import { ensureStoreSeeded } from "@/db/seed";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await ensureStoreSeeded();
    const { searchParams } = new URL(request.url);
    const watchIdParam = searchParams.get("watchId");

    if (watchIdParam) {
      const watchId = Number(watchIdParam);
      const list = await db
        .select()
        .from(reviews)
        .where(eq(reviews.watchId, watchId))
        .orderBy(desc(reviews.createdAt), desc(reviews.id));
      return NextResponse.json({ reviews: list });
    }

    const list = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt), desc(reviews.id))
      .limit(30);

    return NextResponse.json({ reviews: list });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { error: "Unable to load customer reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureStoreSeeded();
    const body = await request.json();

    const customerName = String(body.customerName ?? "").trim();
    const city = String(body.city ?? "Lahore").trim() || "Lahore";
    const comment = String(body.comment ?? "").trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating ?? 5)));
    const watchId = body.watchId ? Number(body.watchId) : null;

    if (!customerName || comment.length < 5) {
      return NextResponse.json(
        {
          error:
            "Please provide your name and a short review (at least 5 characters).",
        },
        { status: 400 }
      );
    }

    let watchName = String(body.watchName ?? "Modern Watch Timepiece").trim();
    let watchImage = String(
      body.watchImage ?? "/images/watches/twotone-royal.jpg"
    ).trim();

    if (watchId) {
      const [foundWatch] = await db
        .select()
        .from(watches)
        .where(eq(watches.id, watchId));

      if (foundWatch) {
        watchName = foundWatch.name;
        watchImage = foundWatch.imageUrl;

        const nextCount = foundWatch.reviewCount + 1;
        const nextRating = Number(
          (
            (foundWatch.rating * foundWatch.reviewCount + rating) /
            nextCount
          ).toFixed(1)
        );

        await db
          .update(watches)
          .set({
            reviewCount: nextCount,
            rating: nextRating,
          })
          .where(eq(watches.id, foundWatch.id));
      }
    }

    const [created] = await db
      .insert(reviews)
      .values({
        watchId,
        watchName,
        watchImage,
        customerName,
        city,
        rating,
        comment,
        verified: true,
      })
      .returning();

    return NextResponse.json({ review: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to post review:", error);
    return NextResponse.json(
      { error: "Unable to submit review" },
      { status: 500 }
    );
  }
}
