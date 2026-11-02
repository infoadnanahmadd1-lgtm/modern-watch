import React from "react";
import Link from "next/link";
import { Watch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-950 text-amber-400">
        <Watch className="h-8 w-8" />
      </div>
      <h1 className="mt-5 font-serif text-3xl font-bold text-zinc-950">
        Timepiece Not Found
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        The watch reference or collection you requested may have sold out or
        moved to our main showcase.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-bold text-amber-300 hover:bg-zinc-800 transition-colors"
      >
        Explore Modern Watch Catalog
      </Link>
    </div>
  );
}
