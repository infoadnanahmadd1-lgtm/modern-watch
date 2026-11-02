import React from "react";
import Link from "next/link";
import {
  Watch,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-amber-500/20">
      {/* Top 4-Guarantee Strip */}
      <div className="border-b border-zinc-800/80">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="flex items-start gap-3">
            <Award className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">
                100% Original Quality
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Hand-inspected calibers, clasps & dials
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Fast & Insured Dispatch
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                2–4 working days delivery nationwide
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Cash on Delivery (COD)
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Pay safely at your doorstep upon arrival
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <RotateCcw className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">
                7 Days Return Policy
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Easy replacement & 1-year machine care
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 ring-1 ring-amber-400/30">
              <Watch className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-serif text-lg font-bold tracking-wider text-white">
                MODERN WATCH
              </span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-amber-400">
                Est. Horological Store
              </span>
            </div>
          </Link>
          <p className="text-xs leading-relaxed text-zinc-400">
            Curating accessible luxury wristwatches, signature Pack-of-2 steel
            bundles, 5ATM waterproof sports calibers, and Golden Edition
            smartwatches with nationwide Cash on Delivery.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Watch Collections
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
            <li>
              <Link
                href="/#pack-of-2"
                className="hover:text-white transition-colors"
              >
                Pack of 2 Mega Offers
              </Link>
            </li>
            <li>
              <Link
                href="/#catalog"
                className="hover:text-white transition-colors"
              >
                Luxury Fluted & Jubilee
              </Link>
            </li>
            <li>
              <Link
                href="/#catalog"
                className="hover:text-white transition-colors"
              >
                5ATM Waterproof Collection
              </Link>
            </li>
            <li>
              <Link
                href="/#catalog"
                className="hover:text-white transition-colors"
              >
                Under Rs. 1,500 Value Deals
              </Link>
            </li>
            <li>
              <Link
                href="/#catalog"
                className="hover:text-white transition-colors"
              >
                Sports & Dual-Time Digital
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Customer Care
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
            <li>
              <Link
                href="/track-order"
                className="hover:text-white transition-colors"
              >
                Track Your Parcel
              </Link>
            </li>
            <li>
              <Link
                href="/#reviews"
                className="hover:text-white transition-colors"
              >
                Verified Customer Reviews
              </Link>
            </li>
            <li>
              <Link
                href="/#concierge"
                className="hover:text-white transition-colors"
              >
                Wholesale & Gift Concierge
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="hover:text-amber-300 transition-colors"
              >
                Merchant Admin Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Showroom & Dispatch
          </h3>
          <ul className="mt-4 space-y-3 text-xs text-zinc-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Modern Watch Company, Sarafa Bazar Heritage Arcade, Abbottabad
                22010
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-amber-400 shrink-0" />
              <span>+92 346 4653712 (10 AM – 10 PM)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-amber-400 shrink-0" />
              <span>concierge@modernwatch.fun</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-900 bg-black/40 py-5 text-center text-xs text-zinc-500">
        <p>
          © {new Date().getFullYear()} Modern Watch Company. Crafted for
          precision horology enthusiasts.
        </p>
      </div>
    </footer>
  );
}
