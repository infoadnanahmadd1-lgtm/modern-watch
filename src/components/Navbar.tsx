"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Menu,
  X,
  Watch,
  Zap,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function Navbar() {
  const {
    currency,
    setCurrency,
    cartCount,
    setIsCartOpen,
    setStartInCheckout,
    wishlistIds,
    toastMessage,
  } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openBag = () => {
    setStartInCheckout(false);
    setIsCartOpen(true);
  };

  return (
    <>
      {/* Top Promotional Announcement Strip */}
      <div className="bg-zinc-950 text-zinc-100 border-b border-amber-500/20 text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 border border-amber-400/30">
              <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />
              11.11 MEGA SALE
            </span>
            <span className="text-zinc-200">
              Use code{" "}
              <strong className="font-mono text-amber-300">MEGA11</strong> for
              extra 11% OFF • Free Delivery above Rs. 3,000
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-[11px] text-zinc-300">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              Cash on Delivery Nationwide
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-amber-400" />7 Days Return &
              Exchange
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-[#FAF9F6]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-amber-400 shadow-sm ring-1 ring-amber-500/30 transition-transform group-hover:scale-105">
              <Watch className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-serif text-xl font-bold tracking-wider text-zinc-950 leading-none">
                MODERN WATCH
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-700 mt-1">
                Horological Atelier
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-zinc-700">
            <Link
              href="/#catalog"
              className="hover:text-zinc-950 transition-colors"
            >
              All Watches
            </Link>
            <Link
              href="/#pack-of-2"
              className="inline-flex items-center gap-1.5 font-semibold text-amber-800 hover:text-amber-950 transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
              Pack of 2 Offers
            </Link>
            <Link
              href="/#collections"
              className="hover:text-zinc-950 transition-colors"
            >
              Collections
            </Link>
            <Link
              href="/#reviews"
              className="hover:text-zinc-950 transition-colors"
            >
              Customer Reviews
            </Link>
            <Link
              href="/track-order"
              className="inline-flex items-center gap-1.5 hover:text-zinc-950 transition-colors"
            >
              <Truck className="h-4 w-4 text-zinc-500" />
              Track Order
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:border-zinc-900 hover:text-zinc-950 transition-colors"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-amber-700" />
              Store Admin
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Currency Switcher */}
            <div
              className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5 text-xs font-semibold shadow-2xs"
              role="group"
              aria-label="Currency selector"
            >
              <button
                type="button"
                onClick={() => setCurrency("PKR")}
                className={`rounded-md px-2 py-1 transition-colors cursor-pointer ${
                  currency === "PKR"
                    ? "bg-zinc-950 text-amber-300"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                Rs.
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`rounded-md px-2 py-1 transition-colors cursor-pointer ${
                  currency === "USD"
                    ? "bg-zinc-950 text-amber-300"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                USD
              </button>
            </div>

            {/* Wishlist Indicator */}
            <Link
              href="/#catalog"
              title="Saved Wishlist Watches"
              className="relative hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-300 bg-white text-zinc-700 hover:border-zinc-900 hover:text-zinc-950 transition-colors"
            >
              <Heart className="h-4 w-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-[10px] font-bold text-white">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Drawer Button */}
            <button
              type="button"
              onClick={openBag}
              className="relative inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Bag</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 font-mono text-xs font-bold text-zinc-950">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border border-stone-300 bg-white text-zinc-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2.5 text-sm font-medium text-zinc-800">
            <Link
              href="/#catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-stone-100"
            >
              All Watches Catalog
            </Link>
            <Link
              href="/#pack-of-2"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 font-semibold text-amber-800 hover:bg-amber-50"
            >
              ⚡ Pack of 2 Mega Combos
            </Link>
            <Link
              href="/#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-stone-100"
            >
              Verified Customer Reviews
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-stone-100"
            >
              Track Your Order
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-zinc-900 font-semibold bg-stone-100"
            >
              Store Admin & Inventory Desk
            </Link>
          </div>
        )}
      </header>

      {/* Non-intrusive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-amber-400/40 bg-zinc-950 px-4 py-3 text-sm font-medium text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
