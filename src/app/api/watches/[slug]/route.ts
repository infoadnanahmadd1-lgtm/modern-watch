import { NextResponse } from "next/server";
import { db } from "@/db";
import { watches, reviews } from "@/db/schema";
import { ensureStoreSeeded } from "@/db/seed";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureStoreSeeded();
    const { slug } = await context.params;

    const [watch] = await db
      .select()
      .from(watches)
      .where(eq(watches.slug, slug));

    if (!watch) {
      return NextResponse.json({ error: "Watch not found" }, { status: 404 });
    }

    const watchReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.watchId, watch.id))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ watch, reviews: watchReviews });
  } catch (error) {
    console.error("Failed to fetch watch details:", error);
    return NextResponse.json(
      { error: "Unable to load watch details" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();

    const updates: Partial<typeof watches.$inferInsert> = {};
    if (typeof body.pricePkr === "number" && body.pricePkr > 0) {
      updates.pricePkr = Math.round(body.pricePkr);
    }
    if (
      typeof body.compareAtPricePkr === "number" &&
      body.compareAtPricePkr > 0
    ) {
      updates.compareAtPricePkr = Math.round(body.compareAtPricePkr);
    }
    if (typeof body.stock === "number" && body.stock >= 0) {
      updates.stock = Math.round(body.stock);
    }
    if (typeof body.featured === "boolean") {
      updates.featured = body.featured;
    }
    if (typeof body.badge === "string" && body.badge.trim()) {
      updates.badge = body.badge.trim();
    }

    const [updated] = await db
      .update(watches)
      .set(updates)
      .where(eq(watches.slug, slug))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Watch not found" }, { status: 404 });
    }

    return NextResponse.json({ watch: updated });
  } catch (error) {
    console.error("Failed to update watch:", error);
    return NextResponse.json(
      { error: "Unable to update watch" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const [deleted] = await db
      .delete(watches)
      .where(eq(watches.slug, slug))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Watch not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete watch:", error);
    return NextResponse.json(
      { error: "Unable to delete watch" },
      { status: 500 }
    );
  }
}
