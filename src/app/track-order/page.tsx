import React from "react";
import { OrderTrackerClient } from "@/components/OrderTrackerClient";

export const dynamic = "force-dynamic";

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolved = await searchParams;
  return <OrderTrackerClient initialQuery={resolved.q ?? ""} />;
}
