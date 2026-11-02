import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuickViewModal } from "@/components/QuickViewModal";
import { CartCheckoutDrawer } from "@/components/CartCheckoutDrawer";

export const metadata: Metadata = {
  title:
    "Modern Watch — Luxury Timepieces, Pack of 2 Bundles & Waterproof Watches",
  description:
    "Shop 100% quality-inspected wristwatches, signature Pack of 2 steel bundles, 5ATM waterproof divers, and Under Rs. 1,500 classics with Cash on Delivery & 7-Day Returns.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900 antialiased">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <QuickViewModal />
          <CartCheckoutDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
