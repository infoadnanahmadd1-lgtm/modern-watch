import { NextResponse } from "next/server";
import { db } from "@/db";
import { watches } from "@/db/schema";
import { ensureStoreSeeded } from "@/db/seed";
import { asc, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await ensureStoreSeeded();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const under1500 = searchParams.get("under1500") === "true";
    const packOfTwo = searchParams.get("packOfTwo") === "true";
    const waterproof = searchParams.get("waterproof") === "true";
    const q = searchParams.get("q")?.trim().toLowerCase() ?? "";

    const allWatches = await db
      .select()
      .from(watches)
      .orderBy(desc(watches.featured), asc(watches.id));

    const filtered = allWatches.filter((item) => {
      if (category && category !== "all" && item.category !== category) {
        return false;
      }
      if (under1500 && item.pricePkr > 1500) {
        return false;
      }
      if (packOfTwo && !item.isPackOfTwo) {
        return false;
      }
      if (waterproof && !item.isWaterproof) {
        return false;
      }
      if (q) {
        const hay = `${item.name} ${item.subtitle} ${item.brand} ${item.category} ${item.movement}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return NextResponse.json({ watches: filtered });
  } catch (error) {
    console.error("Failed to fetch watches:", error);
    return NextResponse.json(
      { error: "Unable to load watches catalog" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureStoreSeeded();
    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const subtitle = String(
      body.subtitle ?? "Precision Horology • Modern Watch Collection"
    ).trim();
    const brand = String(body.brand ?? "Modern Watch Atelier").trim();
    const category = String(body.category ?? "luxury").trim();
    const pricePkr = Number(body.pricePkr ?? 0);
    const compareAtPricePkr = Number(
      body.compareAtPricePkr || Math.round(pricePkr * 1.45)
    );

    if (!name || !Number.isFinite(pricePkr) || pricePkr <= 0) {
      return NextResponse.json(
        { error: "Valid watch name and PKR price are required." },
        { status: 400 }
      );
    }

    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const discountPct =
      compareAtPricePkr > pricePkr
        ? Math.round(((compareAtPricePkr - pricePkr) / compareAtPricePkr) * 100)
        : 0;

    const defaultBadge =
      body.badge?.trim() ||
      (body.isPackOfTwo
        ? `PACK OF 2 • ${discountPct || 35}% OFF`
        : pricePkr <= 1500
          ? `UNDER RS. 1,500 • ${discountPct || 40}% OFF`
          : `⚡ NEW ARRIVAL${discountPct ? ` • ${discountPct}% OFF` : ""}`);

    const imageUrl =
      String(body.imageUrl ?? "").trim() || "/images/watches/twotone-royal.jpg";

    const [created] = await db
      .insert(watches)
      .values({
        slug,
        name,
        subtitle,
        brand,
        category,
        pricePkr: Math.round(pricePkr),
        compareAtPricePkr: Math.round(
          Math.max(compareAtPricePkr, pricePkr + 300)
        ),
        badge: defaultBadge,
        isPackOfTwo: Boolean(body.isPackOfTwo),
        isWaterproof: body.isWaterproof !== false,
        featured: Boolean(body.featured),
        movement: String(body.movement ?? "Precision Japanese Quartz").trim(),
        waterResistance: String(
          body.waterResistance ?? "3 ATM Everyday Waterproof"
        ).trim(),
        caseMaterial: String(
          body.caseMaterial ?? "316L Brushed Stainless Steel"
        ).trim(),
        strapType: String(
          body.strapType ?? "Stainless Steel Link Bracelet"
        ).trim(),
        caseSizeMm: Number(body.caseSizeMm ?? 41) || 41,
        stock: Number(body.stock ?? 25) || 25,
        rating: 5.0,
        reviewCount: 1,
        imageUrl,
        galleryUrls: [imageUrl],
        variants: Array.isArray(body.variants) && body.variants.length > 0
          ? body.variants
          : [
              { name: "Signature Obsidian", hex: "#15171C" },
              { name: "Champagne Two-Tone", hex: "#C8A45D" },
            ],
        highlights:
          Array.isArray(body.highlights) && body.highlights.length > 0
            ? body.highlights
            : [
                "100% original Modern Watch quality inspection",
                "Scratch-resistant hardened mineral crystal",
                "1 Year machine warranty & 7-day easy return policy",
                "Delivered nationwide in cushioned gift packaging",
              ],
        description:
          String(body.description ?? "").trim() ||
          `${name} combines modern horological craftsmanship with everyday resilience, backed by Modern Watch's 7-day inspection & return guarantee.`,
      })
      .returning();

    return NextResponse.json({ watch: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to create watch:", error);
    return NextResponse.json(
      { error: "Unable to create watch" },
      { status: 500 }
    );
  }
}
