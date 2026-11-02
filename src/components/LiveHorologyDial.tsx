"use client";

import React, { useEffect, useState } from "react";

export function LiveHorologyDial() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => {
      setNow(new Date());
    }, 250);
    return () => clearInterval(interval);
  }, []);

  // Classic 10:10:35 horologist display pose prior to client hydration
  const hours = now ? now.getHours() % 12 : 10;
  const minutes = now ? now.getMinutes() : 10;
  const seconds = now ? now.getSeconds() + now.getMilliseconds() / 1000 : 35;
  const dateDay = now ? now.getDate() : 11;

  const hourAngle = hours * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  const digitalTime = now
    ? now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "10:10:35";

  return (
    <div className="inline-flex items-center gap-4 rounded-2xl border border-amber-400/25 bg-zinc-950/85 px-4 py-3 backdrop-blur-md shadow-2xl">
      <div className="relative h-16 w-16 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-md">
          <defs>
            <linearGradient id="goldBezel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5DDA4" />
              <stop offset="50%" stopColor="#C8A45D" />
              <stop offset="100%" stopColor="#8F6E2A" />
            </linearGradient>
            <radialGradient id="obsidianDial" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#232733" />
              <stop offset="100%" stopColor="#0B0C10" />
            </radialGradient>
          </defs>

          {/* Fluted Outer Gold Bezel */}
          <circle
            cx="60"
            cy="60"
            r="56"
            fill="url(#goldBezel)"
            stroke="#F8E7BA"
            strokeWidth="1"
          />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#594316"
            strokeWidth="2.5"
            strokeDasharray="2.2 2.2"
          />

          {/* Sunray Obsidian Dial */}
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="url(#obsidianDial)"
            stroke="#C8A45D"
            strokeWidth="1"
          />

          {/* 12 Hour Baton Markers */}
          {Array.from({ length: 12 }).map((_, idx) => {
            const angle = idx * 30;
            const isQuarter = idx % 3 === 0;
            if (idx === 3) return null; // Reserve 3 o'clock for date aperture
            return (
              <g key={idx} transform={`rotate(${angle} 60 60)`}>
                <rect
                  x={isQuarter ? "58.3" : "59"}
                  y="16"
                  width={isQuarter ? "3.4" : "2"}
                  height={isQuarter ? "8" : "5.5"}
                  rx="1"
                  fill={idx === 0 ? "#F5DDA4" : "#E5E7EB"}
                />
              </g>
            );
          })}

          {/* Cyclops Date Aperture at 3 o'clock */}
          <rect
            x="84"
            y="54.5"
            width="15"
            height="11"
            rx="2"
            fill="#FAF9F6"
            stroke="#C8A45D"
            strokeWidth="1.2"
          />
          <text
            x="91.5"
            y="62.7"
            textAnchor="middle"
            fontSize="7.5"
            fontWeight="700"
            fill="#111827"
            fontFamily="monospace"
          >
            {dateDay}
          </text>

          {/* Dial Crown Signature */}
          <text
            x="60"
            y="41"
            textAnchor="middle"
            fontSize="5.4"
            letterSpacing="1.2"
            fontWeight="700"
            fill="#D4AF37"
          >
            MODERN
          </text>
          <text
            x="60"
            y="84"
            textAnchor="middle"
            fontSize="4.5"
            letterSpacing="0.8"
            fill="#9CA3AF"
          >
            CHRONOMETER
          </text>

          {/* Hour Hand */}
          <g transform={`rotate(${hourAngle} 60 60)`}>
            <line
              x1="60"
              y1="64"
              x2="60"
              y2="35"
              stroke="#F3E5AB"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
          </g>

          {/* Minute Hand */}
          <g transform={`rotate(${minuteAngle} 60 60)`}>
            <line
              x1="60"
              y1="66"
              x2="60"
              y2="23"
              stroke="#FFFFFF"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
          </g>

          {/* Sweeping Champagne Seconds Hand */}
          <g transform={`rotate(${secondAngle} 60 60)`}>
            <line
              x1="60"
              y1="70"
              x2="60"
              y2="19"
              stroke="#D97706"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="60" cy="60" r="2.8" fill="#D4AF37" />
          </g>
        </svg>
      </div>

      <div className="text-left">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/90">
            Live Atelier Caliber
          </span>
        </div>
        <p className="mt-0.5 font-mono text-base font-bold tracking-wider text-white tabular-nums">
          {digitalTime}
        </p>
        <p className="text-[11px] text-zinc-400">
          28,800 vph • Certified Accuracy
        </p>
      </div>
    </div>
  );
}
