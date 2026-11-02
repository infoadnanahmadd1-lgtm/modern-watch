import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  real,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export interface WatchVariant {
  name: string;
  hex: string;
}

export interface OrderLineItem {
  watchId: number;
  slug: string;
  name: string;
  variant: string;
  pricePkr: number;
  quantity: number;
  imageUrl: string;
}

export const watches = pgTable("watches", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull(), // luxury | combo | waterproof | sports | smart
  pricePkr: integer("price_pkr").notNull(),
  compareAtPricePkr: integer("compare_at_price_pkr").notNull(),
  badge: text("badge").notNull(),
  isPackOfTwo: boolean("is_pack_of_two").notNull().default(false),
  isWaterproof: boolean("is_waterproof").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  movement: text("movement").notNull(),
  waterResistance: text("water_resistance").notNull(),
  caseMaterial: text("case_material").notNull(),
  strapType: text("strap_type").notNull(),
  caseSizeMm: integer("case_size_mm").notNull(),
  warranty: text("warranty")
    .notNull()
    .default("1 Year Machine Warranty • 7-Day Easy Return"),
  stock: integer("stock").notNull().default(24),
  rating: real("rating").notNull().default(4.9),
  reviewCount: integer("review_count").notNull().default(18),
  imageUrl: text("image_url").notNull(),
  galleryUrls: jsonb("gallery_urls").$type<string[]>().notNull(),
  variants: jsonb("variants").$type<WatchVariant[]>().notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  watchId: integer("watch_id").references(() => watches.id, {
    onDelete: "set null",
  }),
  watchName: text("watch_name").notNull(),
  watchImage: text("watch_image").notNull(),
  customerName: text("customer_name").notNull(),
  city: text("city").notNull().default("Lahore"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  verified: boolean("verified").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  city: text("city").notNull(),
  address: text("address").notNull(),
  paymentMethod: text("payment_method").notNull().default("cod"),
  promoCode: text("promo_code").notNull().default(""),
  notes: text("notes").notNull().default(""),
  subtotalPkr: integer("subtotal_pkr").notNull(),
  discountPkr: integer("discount_pkr").notNull().default(0),
  shippingPkr: integer("shipping_pkr").notNull().default(0),
  totalPkr: integer("total_pkr").notNull(),
  status: text("status").notNull().default("Confirmed"),
  items: jsonb("items").$type<OrderLineItem[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  topic: text("topic").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WatchRecord = typeof watches.$inferSelect;
export type NewWatchRecord = typeof watches.$inferInsert;
export type ReviewRecord = typeof reviews.$inferSelect;
export type OrderRecord = typeof orders.$inferSelect;
export type InquiryRecord = typeof inquiries.$inferSelect;
