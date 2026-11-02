"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { WatchRecord } from "@/db/schema";

export type CurrencyCode = "PKR" | "USD";

export interface CartItem {
  key: string;
  watchId: number;
  slug: string;
  name: string;
  brand: string;
  variant: string;
  pricePkr: number;
  compareAtPricePkr: number;
  quantity: number;
  imageUrl: string;
}

interface StoreContextValue {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (pricePkr: number) => string;
  cartItems: CartItem[];
  cartCount: number;
  subtotalPkr: number;
  addToCart: (
    watch: WatchRecord,
    variant?: string,
    quantity?: number,
    openCheckoutDirectly?: boolean
  ) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  startInCheckout: boolean;
  setStartInCheckout: (val: boolean) => void;
  wishlistIds: number[];
  toggleWishlist: (watchId: number) => void;
  quickViewWatch: WatchRecord | null;
  setQuickViewWatch: (watch: WatchRecord | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "modernwatch_bag_v1";
const WISHLIST_STORAGE_KEY = "modernwatch_wishlist_v1";
const CURRENCY_STORAGE_KEY = "modernwatch_currency_v1";
const PKR_PER_USD = 278;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("PKR");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [startInCheckout, setStartInCheckout] = useState(false);
  const [quickViewWatch, setQuickViewWatch] = useState<WatchRecord | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCartItems(parsed);
      }
      const savedWish = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWish) {
        const parsedWish = JSON.parse(savedWish);
        if (Array.isArray(parsedWish)) setWishlistIds(parsedWish);
      }
      const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (savedCurrency === "PKR" || savedCurrency === "USD") {
        setCurrencyState(savedCurrency);
      }
    } catch {
      // Ignore storage errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // Ignore
    }
  }, [wishlistIds, hydrated]);

  const setCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, next);
    } catch {
      // Ignore
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const formatPrice = useCallback(
    (pricePkr: number) => {
      if (currency === "USD") {
        const usd = pricePkr / PKR_PER_USD;
        return `$${usd.toFixed(2)}`;
      }
      return `Rs. ${Math.round(pricePkr).toLocaleString("en-PK")}`;
    },
    [currency]
  );

  const addToCart = useCallback(
    (
      watch: WatchRecord,
      variant?: string,
      quantity = 1,
      openCheckoutDirectly = false
    ) => {
      const chosenVariant =
        variant || watch.variants?.[0]?.name || "Signature Finish";
      const key = `${watch.id}::${chosenVariant}`;

      setCartItems((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.min(10, item.quantity + quantity) }
              : item
          );
        }
        return [
          ...prev,
          {
            key,
            watchId: watch.id,
            slug: watch.slug,
            name: watch.name,
            brand: watch.brand,
            variant: chosenVariant,
            pricePkr: watch.pricePkr,
            compareAtPricePkr: watch.compareAtPricePkr,
            quantity,
            imageUrl: watch.imageUrl,
          },
        ];
      });

      setStartInCheckout(openCheckoutDirectly);
      setIsCartOpen(true);
      showToast(
        openCheckoutDirectly
          ? `Express COD ready for ${watch.name}`
          : `Added "${watch.name}" to your bag`
      );
    },
    [showToast]
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.key !== key));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, quantity: Math.min(10, quantity) } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const toggleWishlist = useCallback(
    (watchId: number) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(watchId);
        showToast(
          exists ? "Removed from saved timepieces" : "Saved to your wishlist"
        );
        return exists
          ? prev.filter((id) => id !== watchId)
          : [...prev, watchId];
      });
    },
    [showToast]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotalPkr = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + item.pricePkr * item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatPrice,
      cartItems,
      cartCount,
      subtotalPkr,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      startInCheckout,
      setStartInCheckout,
      wishlistIds,
      toggleWishlist,
      quickViewWatch,
      setQuickViewWatch,
      toastMessage,
      showToast,
    }),
    [
      currency,
      setCurrency,
      formatPrice,
      cartItems,
      cartCount,
      subtotalPkr,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      isCartOpen,
      startInCheckout,
      wishlistIds,
      toggleWishlist,
      quickViewWatch,
      toastMessage,
      showToast,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return ctx;
}
