import { NextResponse } from "next/server";
import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.createdAt))
      .limit(40);
    return NextResponse.json({ inquiries: list });
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json(
      { error: "Unable to load inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const topic = String(body.topic ?? "General Inquiry").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Please fill in your name, phone number, and message." },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(inquiries)
      .values({
        name,
        phone,
        email,
        topic,
        message,
      })
      .returning();

    return NextResponse.json({ inquiry: created }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return NextResponse.json(
      { error: "Unable to send inquiry" },
      { status: 500 }
    );
  }
}
