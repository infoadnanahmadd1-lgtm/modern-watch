import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, watches, type OrderLineItem } from "@/db/schema";
import { ensureStoreSeeded } from "@/db/seed";
import { desc, eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export function calculatePromoDiscount(
  subtotalPkr: number,
  rawCode: string
): { code: string; discountPkr: number; label: string } {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { code: "", discountPkr: 0, label: "" };

  if (code === "MEGA11") {
    return {
      code,
      discountPkr: Math.round(subtotalPkr * 0.11),
      label: "11.11 Mega Sale (11% OFF)",
    };
  }
  if (code === "MODERN10") {
    return {
      code,
      discountPkr: Math.round(subtotalPkr * 0.1),
      label: "Modern Collector (10% OFF)",
    };
  }
  if (code === "BUNDLE500" && subtotalPkr >= 3000) {
    return {
      code,
      discountPkr: 500,
      label: "Rs. 500 Bundle Bonus",
    };
  }

  return { code: "", discountPkr: 0, label: "" };
}

export async function GET(request: Request) {
  try {
    await ensureStoreSeeded();
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const query = searchParams.get("q")?.trim() ?? "";

    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt), desc(orders.id))
      .limit(50);

    if (all) {
      return NextResponse.json({ orders: allOrders });
    }

    if (!query) {
      return NextResponse.json({ orders: [] });
    }

    const normalizedQuery = query.toLowerCase();
    const digitsOnly = query.replace(/\D/g, "");

    const matched = allOrders.filter((ord) => {
      if (ord.orderNumber.toLowerCase().includes(normalizedQuery)) {
        return true;
      }
      if (
        digitsOnly.length >= 6 &&
        ord.phone.replace(/\D/g, "").includes(digitsOnly)
      ) {
        return true;
      }
      return false;
    });

    return NextResponse.json({ orders: matched });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Unable to query orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureStoreSeeded();
    const body = await request.json();

    const customerName = String(body.customerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const city = String(body.city ?? "").trim();
    const address = String(body.address ?? "").trim();
    const paymentMethod = String(body.paymentMethod ?? "cod").trim();
    const notes = String(body.notes ?? "").trim();
    const promoInput = String(body.promoCode ?? "").trim();
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !phone || !city || !address) {
      return NextResponse.json(
        {
          error:
            "Please enter your full name, mobile phone number, city, and delivery address.",
        },
        { status: 400 }
      );
    }

    if (rawItems.length === 0) {
      return NextResponse.json(
        { error: "Your shopping bag is empty." },
        { status: 400 }
      );
    }

    const watchIds = rawItems
      .map((i: { watchId?: number }) => Number(i.watchId))
      .filter((id: number) => Number.isFinite(id) && id > 0);

    const dbWatches =
      watchIds.length > 0
        ? await db.select().from(watches).where(inArray(watches.id, watchIds))
        : [];
    const watchMap = new Map(dbWatches.map((w) => [w.id, w]));

    const validatedItems: OrderLineItem[] = [];
    for (const item of rawItems) {
      const dbWatch = watchMap.get(Number(item.watchId));
      const qty = Math.max(1, Math.min(10, Number(item.quantity ?? 1)));
      if (dbWatch) {
        validatedItems.push({
          watchId: dbWatch.id,
          slug: dbWatch.slug,
          name: dbWatch.name,
          variant: String(
            item.variant || dbWatch.variants?.[0]?.name || "Standard Finish"
          ),
          pricePkr: dbWatch.pricePkr,
          quantity: qty,
          imageUrl: dbWatch.imageUrl,
        });
      }
    }

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { error: "Selected items are no longer available." },
        { status: 400 }
      );
    }

    const subtotalPkr = validatedItems.reduce(
      (sum, item) => sum + item.pricePkr * item.quantity,
      0
    );

    const promo = calculatePromoDiscount(subtotalPkr, promoInput);
    const shippingPkr = subtotalPkr >= 3000 ? 0 : 200;
    const totalPkr = Math.max(
      0,
      subtotalPkr - promo.discountPkr + shippingPkr
    );

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MW-2026-${randomCode}`;

    const [createdOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName,
        phone,
        email,
        city,
        address,
        paymentMethod,
        promoCode: promo.code,
        notes,
        subtotalPkr,
        discountPkr: promo.discountPkr,
        shippingPkr,
        totalPkr,
        status: "Confirmed",
        items: validatedItems,
      })
      .returning();

    // Decrement stock for each ordered watch
    for (const line of validatedItems) {
      const dbWatch = watchMap.get(line.watchId);
      if (dbWatch) {
        await db
          .update(watches)
          .set({ stock: Math.max(0, dbWatch.stock - line.quantity) })
          .where(eq(watches.id, dbWatch.id));
      }
    }

    return NextResponse.json({ order: createdOrder }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Unable to place order right now. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);
    const status = String(body.status ?? "").trim();
    const allowedStatuses = [
      "Confirmed",
      "Quality Checked",
      "Dispatched",
      "Delivered",
    ];

    if (!id || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid order ID or status" },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: updated });
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json(
      { error: "Unable to update order" },
      { status: 500 }
    );
  }
}
