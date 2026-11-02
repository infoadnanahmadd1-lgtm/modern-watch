CREATE TABLE "inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"topic" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"customer_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text DEFAULT '' NOT NULL,
	"city" text NOT NULL,
	"address" text NOT NULL,
	"payment_method" text DEFAULT 'cod' NOT NULL,
	"promo_code" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"subtotal_pkr" integer NOT NULL,
	"discount_pkr" integer DEFAULT 0 NOT NULL,
	"shipping_pkr" integer DEFAULT 0 NOT NULL,
	"total_pkr" integer NOT NULL,
	"status" text DEFAULT 'Confirmed' NOT NULL,
	"items" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"watch_id" integer,
	"watch_name" text NOT NULL,
	"watch_image" text NOT NULL,
	"customer_name" text NOT NULL,
	"city" text DEFAULT 'Lahore' NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"verified" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "watches" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"subtitle" text NOT NULL,
	"brand" text NOT NULL,
	"category" text NOT NULL,
	"price_pkr" integer NOT NULL,
	"compare_at_price_pkr" integer NOT NULL,
	"badge" text NOT NULL,
	"is_pack_of_two" boolean DEFAULT false NOT NULL,
	"is_waterproof" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"movement" text NOT NULL,
	"water_resistance" text NOT NULL,
	"case_material" text NOT NULL,
	"strap_type" text NOT NULL,
	"case_size_mm" integer NOT NULL,
	"warranty" text DEFAULT '1 Year Machine Warranty • 7-Day Easy Return' NOT NULL,
	"stock" integer DEFAULT 24 NOT NULL,
	"rating" real DEFAULT 4.9 NOT NULL,
	"review_count" integer DEFAULT 18 NOT NULL,
	"image_url" text NOT NULL,
	"gallery_urls" jsonb NOT NULL,
	"variants" jsonb NOT NULL,
	"highlights" jsonb NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "watches_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_watch_id_watches_id_fk" FOREIGN KEY ("watch_id") REFERENCES "public"."watches"("id") ON DELETE set null ON UPDATE no action;