"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Check,
  Banknote,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import type { OrderRecord } from "@/db/schema";

type DrawerStep = "bag" | "checkout" | "confirmed";

export function CartCheckoutDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    startInCheckout,
    setStartInCheckout,
    cartItems,
    subtotalPkr,
    updateQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
  } = useStore();

  const [step, setStep] = useState<DrawerStep>("bag");
  const [promoCode, setPromoCode] = useState("MEGA11");
  const [appliedPromo, setAppliedPromo] = useState("MEGA11");

  // Checkout form fields
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Lahore");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(
    null
  );
  const [copiedOrder, setCopiedOrder] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      if (startInCheckout && cartItems.length > 0) {
        setStep("checkout");
        setStartInCheckout(false);
      } else if (step === "confirmed" && cartItems.length > 0) {
        setStep("bag");
      }
    }
  }, [isCartOpen, startInCheckout, cartItems.length, setStartInCheckout, step]);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 3000;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - subtotalPkr
  );
  const shippingPkr =
    subtotalPkr === 0 ? 0 : subtotalPkr >= freeShippingThreshold ? 0 : 200;

  let discountPkr = 0;
  const upperPromo = appliedPromo.trim().toUpperCase();
  if (upperPromo === "MEGA11") {
    discountPkr = Math.round(subtotalPkr * 0.11);
  } else if (upperPromo === "MODERN10") {
    discountPkr = Math.round(subtotalPkr * 0.1);
  } else if (upperPromo === "BUNDLE500" && subtotalPkr >= 3000) {
    discountPkr = 500;
  }

  const totalPkr = Math.max(0, subtotalPkr - discountPkr + shippingPkr);

  const handleApplyPromo = (codeToApply?: string) => {
    const target = (codeToApply ?? promoCode).trim().toUpperCase();
    setPromoCode(target);
    setAppliedPromo(target);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          email,
          city,
          address,
          paymentMethod,
          promoCode: appliedPromo,
          notes,
          items: cartItems.map((item) => ({
            watchId: item.watchId,
            variant: item.variant,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Unable to place order.");
        setSubmitting(false);
        return;
      }

      setConfirmedOrder(data.order);
      clearCart();
      setStep("confirmed");
    } catch {
      setErrorMsg("Network error. Please try placing your order again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyTrackingId = () => {
    if (!confirmedOrder) return;
    navigator.clipboard?.writeText(confirmedOrder.orderNumber);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  const closeDrawer = () => {
    setIsCartOpen(false);
    if (step === "confirmed") {
      setStep("bag");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/65 backdrop-blur-xs"
      onClick={closeDrawer}
    >
      <aside
        className="relative flex h-full w-full max-w-lg flex-col bg-[#FAF9F6] shadow-2xl border-l border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            {step === "checkout" && (
              <button
                type="button"
                onClick={() => setStep("bag")}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-stone-200 text-zinc-700 hover:bg-stone-100 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <h2 className="font-serif text-lg font-bold text-zinc-950">
                {step === "bag" && "Your Watch Bag"}
                {step === "checkout" && "Express Cash on Delivery"}
                {step === "confirmed" && "Order Confirmed"}
              </h2>
              <p className="text-[11px] text-zinc-500">
                {step === "bag" &&
                  "100% Original Quality • 7-Day Return Guarantee"}
                {step === "checkout" &&
                  "Nationwide Insured Dispatch • Pay at Doorstep"}
                {step === "confirmed" &&
                  "Saved to Modern Watch Fulfillment System"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-zinc-700 hover:bg-zinc-950 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* STEP 1: SHOPPING BAG */}
        {step === "bag" && (
          <>
            {cartItems.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-200/70 text-zinc-600">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-bold text-zinc-950">
                  Your watch bag is empty
                </h3>
                <p className="mt-1.5 max-w-xs text-sm text-zinc-500">
                  Explore our Pack of 2 bundles, fluted two-tone icons, and 5ATM
                  waterproof watches.
                </p>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="mt-6 rounded-xl bg-zinc-950 px-6 py-3 text-sm font-bold text-amber-300 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Browse Watches
                </button>
              </div>
            ) : (
              <>
                {/* Free Shipping Progress Strip */}
                <div className="border-b border-stone-200 bg-amber-50/70 px-5 py-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-800">
                    <span className="inline-flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-amber-700" />
                      {remainingForFreeShipping === 0 ? (
                        <span className="text-emerald-800">
                          Unlocked! You qualify for FREE Express Delivery
                        </span>
                      ) : (
                        <span>
                          Add{" "}
                          <strong>
                            {formatPrice(remainingForFreeShipping)}
                          </strong>{" "}
                          more for FREE Delivery
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          (subtotalPkr / freeShippingThreshold) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex gap-3.5 rounded-2xl border border-stone-200 bg-white p-3 shadow-2xs"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-20 w-20 rounded-xl object-cover bg-stone-100 shrink-0"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-serif text-sm font-bold text-zinc-950 line-clamp-1">
                              {item.name}
                            </h4>
                            <p className="text-[11px] font-medium text-amber-800">
                              Finish: {item.variant}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.key)}
                            aria-label="Remove item"
                            className="text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-lg border border-stone-200 bg-stone-50">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity - 1)
                              }
                              className="p-1.5 text-zinc-700 hover:text-zinc-950 cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2.5 font-mono text-xs font-bold text-zinc-950">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                              className="p-1.5 text-zinc-700 hover:text-zinc-950 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="font-mono text-sm font-bold text-zinc-950">
                            {formatPrice(item.pricePkr * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Promo Code Widget */}
                  <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 mb-2">
                      <span className="inline-flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-amber-700" />
                        Mega Sale Promo Code
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApplyPromo("MEGA11")}
                          className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold cursor-pointer ${
                            upperPromo === "MEGA11"
                              ? "bg-zinc-950 text-amber-300"
                              : "bg-stone-100 text-zinc-700 hover:bg-stone-200"
                          }`}
                        >
                          MEGA11 (11%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPromo("BUNDLE500")}
                          className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold cursor-pointer ${
                            upperPromo === "BUNDLE500"
                              ? "bg-zinc-950 text-amber-300"
                              : "bg-stone-100 text-zinc-700 hover:bg-stone-200"
                          }`}
                        >
                          BUNDLE500
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 font-mono text-xs uppercase text-zinc-900 focus:border-zinc-900 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyPromo()}
                        className="rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-zinc-800 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                {/* Totals & Proceed CTA */}
                <div className="border-t border-stone-200 bg-white p-5 space-y-3">
                  <div className="space-y-1.5 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono font-semibold text-zinc-900">
                        {formatPrice(subtotalPkr)}
                      </span>
                    </div>
                    {discountPkr > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Promo Discount ({upperPromo})</span>
                        <span className="font-mono">
                          -{formatPrice(discountPkr)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Nationwide Insured Delivery</span>
                      <span className="font-mono font-semibold text-zinc-900">
                        {shippingPkr === 0 ? "FREE" : formatPrice(shippingPkr)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-bold text-zinc-950">
                      <span>Total Payable</span>
                      <span className="font-mono text-lg">
                        {formatPrice(totalPkr)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep("checkout")}
                    className="w-full rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-amber-300 shadow-md hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Proceed to Cash on Delivery • {formatPrice(totalPkr)}
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* STEP 2: EXPRESS CHECKOUT FORM */}
        {step === "checkout" && (
          <form
            onSubmit={handlePlaceOrder}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {errorMsg && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-700">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Muhammad Numan"
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Mobile / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lahore, Karachi, Islamabad..."
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-800 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Office #, Street, Block / Sector, Landmark"
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: "cod",
                      title: "Cash on Delivery (COD)",
                      desc: "Pay cash to courier upon doorstep delivery",
                      icon: Banknote,
                    },
                    {
                      id: "wallet",
                      title: "EasyPaisa / JazzCash / Bank Transfer",
                      desc: "Fast digital transfer with priority dispatch",
                      icon: Smartphone,
                    },
                    {
                      id: "card",
                      title: "Debit / Credit Card",
                      desc: "256-bit SSL secured Visa & Mastercard",
                      icon: CreditCard,
                    },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const active = paymentMethod === pm.id;
                    return (
                      <label
                        key={pm.id}
                        className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                          active
                            ? "border-zinc-950 bg-zinc-950 text-white"
                            : "border-stone-200 bg-white text-zinc-800 hover:border-stone-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.id}
                          checked={active}
                          onChange={() => setPaymentMethod(pm.id)}
                          className="sr-only"
                        />
                        <Icon
                          className={`h-5 w-5 shrink-0 ${
                            active ? "text-amber-400" : "text-zinc-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-xs font-bold">{pm.title}</p>
                          <p
                            className={`text-[11px] ${
                              active ? "text-zinc-300" : "text-zinc-500"
                            }`}
                          >
                            {pm.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-800 mb-1">
                  Order / Gift Wrapping Note (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before delivery or include gift note"
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none"
                />
              </div>
            </div>

            {/* Footer Submit */}
            <div className="border-t border-stone-200 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between text-sm font-bold text-zinc-950">
                <span>Order Total ({cartItems.length} item/s)</span>
                <span className="font-mono text-lg">
                  {formatPrice(totalPkr)}
                </span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-amber-300 shadow-md hover:bg-zinc-800 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {submitting
                  ? "Confirming Order..."
                  : `Confirm Order • ${formatPrice(totalPkr)}`}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />7 Days
                Return Policy • 100% Quality Checked Before Dispatch
              </p>
            </div>
          </form>
        )}

        {/* STEP 3: CONFIRMED RECEIPT */}
        {step === "confirmed" && confirmedOrder && (
          <div className="flex flex-1 flex-col justify-between overflow-y-auto p-6">
            <div className="space-y-5">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <h3 className="mt-2 font-serif text-2xl font-bold text-zinc-950">
                  Thank You, {confirmedOrder.customerName}!
                </h3>
                <p className="mt-1 text-xs text-zinc-600">
                  Your order has been registered with Modern Watch Atelier and
                  queued for horological quality check.
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-3.5 py-2">
                  <span className="text-xs text-zinc-500">Order ID:</span>
                  <strong className="font-mono text-sm font-bold text-zinc-950">
                    {confirmedOrder.orderNumber}
                  </strong>
                  <button
                    type="button"
                    onClick={copyTrackingId}
                    className="ml-1 text-zinc-500 hover:text-zinc-950 cursor-pointer"
                    title="Copy Order Number"
                  >
                    {copiedOrder ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Delivery City</span>
                  <span className="font-semibold text-zinc-900">
                    {confirmedOrder.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Payment Mode</span>
                  <span className="font-semibold uppercase text-zinc-900">
                    {confirmedOrder.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : confirmedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status</span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-bold text-amber-900">
                    {confirmedOrder.status}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-bold text-zinc-950">
                  <span>Total Amount</span>
                  <span className="font-mono">
                    {formatPrice(confirmedOrder.totalPkr)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <Link
                href={`/track-order?q=${encodeURIComponent(
                  confirmedOrder.orderNumber
                )}`}
                onClick={closeDrawer}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-amber-300 hover:bg-zinc-800 transition-colors"
              >
                <Truck className="h-4 w-4" />
                Track Live Order Status
              </Link>
              <button
                type="button"
                onClick={closeDrawer}
                className="w-full rounded-xl border border-stone-300 bg-white py-3 text-xs font-bold text-zinc-800 hover:bg-stone-100 cursor-pointer"
              >
                Continue Exploring Watches
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
