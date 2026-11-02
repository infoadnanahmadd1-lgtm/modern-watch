import { db } from "./index";
import { watches, reviews, orders, type NewWatchRecord } from "./schema";
import { count } from "drizzle-orm";

export const INITIAL_WATCHES: NewWatchRecord[] = [
  {
    slug: "royal-jubilee-twotone-fluted-luxury",
    name: "Royal Jubilee Two-Tone Fluted Luxury Watch",
    subtitle: "White-Silver Sunray Dial • Diamond Markers & Date Magnifier",
    brand: "Modern Watch Atelier",
    category: "luxury",
    pricePkr: 2999,
    compareAtPricePkr: 4800,
    badge: "⚡ 11.11 MEGA • 38% OFF",
    isPackOfTwo: false,
    isWaterproof: true,
    featured: true,
    movement: "Precision Japanese Quartz",
    waterResistance: "3 ATM Splash & Rain Resistant",
    caseMaterial: "316L Two-Tone Brushed Stainless Steel",
    strapType: "Jubilee Five-Link Fold-Over Clasp",
    caseSizeMm: 41,
    warranty: "1 Year Machine Warranty • 7-Day Easy Return",
    stock: 32,
    rating: 4.9,
    reviewCount: 42,
    imageUrl: "/images/watches/twotone-royal.jpg",
    galleryUrls: [
      "/images/watches/twotone-royal.jpg",
      "/images/watches/hero-chronograph.jpg",
    ],
    variants: [
      { name: "Silver & 18K Gold", hex: "#D4AF37" },
      { name: "Champagne Sunray", hex: "#E6C98F" },
      { name: "Obsidian Two-Tone", hex: "#1C1E24" },
    ],
    highlights: [
      "Fluted champagne-gold bezel with diamond-cut indices",
      "Magnified date display window at 3 o'clock",
      "Weighted Jubilee bracelet with secure master-lock clasp",
      "Delivered in Modern Watch cushioned gift box",
    ],
    description:
      "Timeless executive presence meets everyday reliability. Crafted with a luminous white-silver sunray dial, diamond-set hour markers, and an iconic fluted gold-tone bezel paired with a supple two-tone Jubilee bracelet.",
  },
  {
    slug: "obsidian-chronos-master-lock-executive",
    name: "Obsidian Chronos Master-Lock Executive Watch",
    subtitle: "Pitch-Black Sunray Dial • Champagne Bezel & Master Clasp",
    brand: "Modern Watch Atelier",
    category: "luxury",
    pricePkr: 3499,
    compareAtPricePkr: 5500,
    badge: "BESTSELLER • 36% OFF",
    isPackOfTwo: false,
    isWaterproof: true,
    featured: true,
    movement: "High-Torque Japanese Quartz Date",
    waterResistance: "5 ATM Waterproof Seal",
    caseMaterial: "Heavyweight Dual-Finish Stainless Steel",
    strapType: "Two-Tone Jubilee Master-Lock Bracelet",
    caseSizeMm: 42,
    warranty: "1 Year Machine Warranty • 7-Day Easy Return",
    stock: 19,
    rating: 5.0,
    reviewCount: 37,
    imageUrl: "/images/watches/hero-chronograph.jpg",
    galleryUrls: [
      "/images/watches/hero-chronograph.jpg",
      "/images/watches/twotone-royal.jpg",
    ],
    variants: [
      { name: "Obsidian & Gold", hex: "#141519" },
      { name: "Midnight Slate", hex: "#2C3340" },
    ],
    highlights: [
      "Scratch-resistant hardened mineral crystal with anti-glare coat",
      "Luminous baton hands & indices for night legibility",
      "Working date calendar with quick-set crown",
      "Balanced 138g wrist presence prized by collectors",
    ],
    description:
      "Our flagship flagship silhouette built for formal evenings and boardroom authority. Features an intense obsidian dial framed by a warm fluted champagne bezel and precision-machined steel links.",
  },
  {
    slug: "compani-quartz-pack-of-2-steel-bundle",
    name: "Compani Quartz Pack of 2 – Steel Bracelet Bundle",
    subtitle: "Midnight Blue + Jet Black Pair • Twin Luxury Gift Box",
    brand: "Compani Collection",
    category: "combo",
    pricePkr: 3500,
    compareAtPricePkr: 5600,
    badge: "PACK OF 2 OFFER • 38% OFF",
    isPackOfTwo: true,
    isWaterproof: true,
    featured: true,
    movement: "Dual Japanese Quartz Calibers",
    waterResistance: "3 ATM Everyday Waterproof",
    caseMaterial: "Polished Stainless Steel Alloy",
    strapType: "2x Solid Steel Link Bracelets",
    caseSizeMm: 41,
    warranty: "1 Year Machine Warranty • 7-Day Easy Return",
    stock: 28,
    rating: 4.9,
    reviewCount: 54,
    imageUrl: "/images/watches/pack2-steel-bundle.jpg",
    galleryUrls: [
      "/images/watches/pack2-steel-bundle.jpg",
      "/images/watches/obsidian-diver.jpg",
    ],
    variants: [
      { name: "Blue + Black Duo", hex: "#1E3A5F" },
      { name: "Silver + Black Duo", hex: "#8E95A2" },
    ],
    highlights: [
      "Includes TWO complete full-metal watches in one bundle price",
      "Switch effortlessly between Midnight Blue and Classic Black dials",
      "Ideal for gifting, brothers, or rotating office & weekend wear",
      "Ships in dual-slot velvet presentation case",
    ],
    description:
      "Our #1 customer-favorite combo offer. Receive two distinct stainless steel dress-sport timepieces—one in deep midnight blue sunray and one in classic jet black—engineered for daily durability and effortless polish.",
  },
  {
    slug: "tank-classic-rectangular-dress-pack-of-2",
    name: "Tank Classic Rectangular Dress Set – Pack of 2",
    subtitle: "Roman Numeral Ivory Dial • His & Hers Leather Duo",
    brand: "Modern Heritage",
    category: "combo",
    pricePkr: 2200,
    compareAtPricePkr: 4200,
    badge: "PACK OF 2 • 48% OFF",
    isPackOfTwo: true,
    isWaterproof: false,
    featured: true,
    movement: "Slimline Quartz Dress Movement",
    waterResistance: "Splash Resistant",
    caseMaterial: "Polished Gold-Tone Rectangular Case",
    strapType: "2x Embossed Alligator-Grain Leather Straps",
    caseSizeMm: 34,
    warranty: "1 Year Machine Warranty • 7-Day Easy Return",
    stock: 22,
    rating: 4.8,
    reviewCount: 29,
    imageUrl: "/images/watches/pack2-tank-dress.jpg",
    galleryUrls: ["/images/watches/pack2-tank-dress.jpg"],
    variants: [
      { name: "Gold Case / Black Leather", hex: "#1B1B1D" },
      { name: "Gold Case / Espresso Brown", hex: "#4A2E1B" },
    ],
    highlights: [
      "Iconic Parisian rectangular Art-Deco silhouette",
      "Crisp Roman numerals with blued sword-style hands",
      "Includes two matched watches—ideal couple or formal bundle",
      "Featherlight ultra-slim profile slides neatly under shirt cuffs",
    ],
    description:
      "Inspired by century-old Parisian dress watchmaking, the Tank Classic Pack of 2 pairs refined gold-finished rectangular cases with crisp Roman numeral dials and supple black embossed leather straps.",
  },
  {
    slug: "emerald-sub-aqua-5atm-weighted-diver",
    name: "Sub-Aqua Weighted 5ATM Waterproof Diver",
    subtitle: "Emerald Ceramic Bezel • Luminous Indices & Oyster Steel",
    brand: "Rick Marine",
    category: "waterproof",
    pricePkr: 2850,
    compareAtPricePkr: 4500,
    badge: "5ATM WATERPROOF • 37% OFF",
    isPackOfTwo: false,
    isWaterproof: true,
    featured: true,
    movement: "Sealed Quartz Diver Caliber",
    waterResistance: "5 ATM / 50M Swim & Wudu Waterproof",
    caseMaterial: "Weighted Solid 316L Stainless Steel",
    strapType: "Brushed Oyster 3-Link Safety Clasp",
    caseSizeMm: 42,
    warranty: "1 Year Waterproof & Machine Warranty",
    stock: 35,
    rating: 4.9,
    reviewCount: 31,
    imageUrl: "/images/watches/obsidian-diver.jpg",
    galleryUrls: [
      "/images/watches/obsidian-diver.jpg",
      "/images/watches/hero-chronograph.jpg",
    ],
    variants: [
      { name: "Emerald Green", hex: "#0F5132" },
      { name: "Deep Ocean Blue", hex: "#102A54" },
      { name: "Submariner Black", hex: "#15171A" },
    ],
    highlights: [
      "100% wudu, rain, and swim-safe 5ATM sealed caseback",
      "Unidirectional 120-click rotating timing bezel",
      "Super-bright nocturnal lume plots and hands",
      "Substantial weighted feel with solid steel end-links",
    ],
    description:
      "Built for water, heat, and relentless daily wear. Featuring a rich emerald sunray dial, scratch-resistant ceramic-finish bezel, and gaskets rated to 50 meters of water resistance.",
  },
  {
    slug: "x-gear-world-time-dual-tactical-watch",
    name: "X-Gear Waterproof World-Time Dual Watch",
    subtitle: "Analog + Negative LCD Digital • Shock-Armor Sports Case",
    brand: "X-Gear Sports",
    category: "sports",
    pricePkr: 3100,
    compareAtPricePkr: 5000,
    badge: "⚡ DUAL TIME • 38% OFF",
    isPackOfTwo: false,
    isWaterproof: true,
    featured: true,
    movement: "Dual Analog + Digital World-Time Module",
    waterResistance: "5 ATM Waterproof & Shock Resistant",
    caseMaterial: "Octagonal Brushed Metal & Carbon Resin",
    strapType: "Ventilated Tactical Silicone Strap",
    caseSizeMm: 45,
    warranty: "1 Year Machine Warranty • 7-Day Easy Return",
    stock: 27,
    rating: 4.9,
    reviewCount: 33,
    imageUrl: "/images/watches/dualtime-sports.jpg",
    galleryUrls: ["/images/watches/dualtime-sports.jpg"],
    variants: [
      { name: "Stealth Black / Crimson", hex: "#B91C1C" },
      { name: "Gunmetal / Cobalt", hex: "#1D4ED8" },
    ],
    highlights: [
      "Simultaneous analog hands + 31-city World Time LCD",
      "1/100th-second stopwatch, countdown timer & 5 daily alarms",
      "One-touch LED night illuminator",
      "5ATM waterproof construction built for gym, outdoor & travel",
    ],
    description:
      "Engineered for athletes and travelers who demand rugged durability without sacrificing modern octagonal styling. Combines high-contrast analog hands with crimson accents and multi-function digital sub-dials.",
  },
  {
    slug: "black-arabic-aura-matte-edition",
    name: "Black Arabic Aura Minimalist Matte Watch",
    subtitle: "Silver Eastern Arabic Numerals • Stealth Matte Finish",
    brand: "Modern Aura",
    category: "luxury",
    pricePkr: 1199,
    compareAtPricePkr: 2100,
    badge: "UNDER RS. 1,500 • 43% OFF",
    isPackOfTwo: false,
    isWaterproof: false,
    featured: true,
    movement: "Silent Sweep Quartz",
    waterResistance: "Daily Splash Resistant",
    caseMaterial: "Matte Ion-Plated Black Alloy",
    strapType: "Matte Black Link Bracelet",
    caseSizeMm: 40,
    warranty: "7-Day Replacement & 6-Month Machine Care",
    stock: 48,
    rating: 4.8,
    reviewCount: 64,
    imageUrl: "/images/watches/arabic-aura-black.jpg",
    galleryUrls: ["/images/watches/arabic-aura-black.jpg"],
    variants: [
      { name: "Matte Pitch Black", hex: "#111214" },
      { name: "Black & Frosted Silver", hex: "#6B7280" },
    ],
    highlights: [
      "Trending monochrome Arabic numeral dial aesthetic",
      "Ultra-clean minimalist bezel pairs with western & eastern attire",
      "Unbeatable Under Rs. 1,500 everyday value",
      "Adjustable matte black bracelet with complimentary pin tool",
    ],
    description:
      "A cultural design icon reimagined in stealth matte black. Crisp metallic silver Eastern Arabic numerals float effortlessly across a velvet-matte obsidian dial.",
  },
  {
    slug: "hb-lot-diamond-cut-skeleton-automatic",
    name: "HB-Lot Diamond-Cut Open-Heart Automatic",
    subtitle: "Battery-Free Mechanical Rotor • Integrated Brushed Chain",
    brand: "HB-Lot Atelier",
    category: "luxury",
    pricePkr: 3400,
    compareAtPricePkr: 4900,
    badge: "MECHANICAL AUTO • 31% OFF",
    isPackOfTwo: false,
    isWaterproof: true,
    featured: true,
    movement: "Self-Winding Mechanical Skeleton",
    waterResistance: "3 ATM Water Resistant",
    caseMaterial: "Diamond-Cut Octagonal Brushed Steel",
    strapType: "Integrated Diamond-Cut Steel Chain",
    caseSizeMm: 42,
    warranty: "1 Year Mechanical Warranty • 7-Day Return",
    stock: 15,
    rating: 4.9,
    reviewCount: 24,
    imageUrl: "/images/watches/skeleton-automatic.jpg",
    galleryUrls: ["/images/watches/skeleton-automatic.jpg"],
    variants: [
      { name: "Brushed Silver / Gold Gears", hex: "#C8A45D" },
      { name: "Gunmetal / Silver Gears", hex: "#4B5563" },
    ],
    highlights: [
      "Powered naturally by wrist motion—no battery required",
      "Mesmerizing open-heart dial showcasing live balance wheel",
      "Faceted diamond-cut bezel catches ambient light from every angle",
      "Exhibition mineral glass caseback",
    ],
    description:
      "Experience living horology on your wrist. Through its skeletonized architecture, watch the golden balance wheel oscillate at 21,600 vibrations per hour inside a geometric diamond-cut steel case.",
  },
  {
    slug: "g-series-rose-gold-metal-bezel-digital",
    name: "Casio-Style Rose Gold Metal Bezel Digital Watch",
    subtitle: "Retro-Octagonal Rose Steel • Alarm, Chrono & EL Light",
    brand: "Modern Retro",
    category: "sports",
    pricePkr: 1450,
    compareAtPricePkr: 2900,
    badge: "UNDER RS. 1,500 • 50% OFF",
    isPackOfTwo: false,
    isWaterproof: true,
    featured: false,
    movement: "Digital Chronograph Calendar Module",
    waterResistance: "3 ATM Water Resistant",
    caseMaterial: "Brushed Rose-Gold Stainless Bezel",
    strapType: "Rose-Gold Adjustable Clasp Bracelet",
    caseSizeMm: 38,
    warranty: "6-Month Machine Care • 7-Day Easy Return",
    stock: 41,
    rating: 4.8,
    reviewCount: 38,
    imageUrl: "/images/watches/rose-digital-metal.jpg",
    galleryUrls: ["/images/watches/rose-digital-metal.jpg"],
    variants: [
      { name: "Rose Gold Steel", hex: "#D49B87" },
      { name: "Classic Brushed Silver", hex: "#C0C6CF" },
    ],
    highlights: [
      "Half-price 11.11 Mega Deal under Rs. 1,500",
      "Unisex 38mm retro-modern octagonal metal silhouette",
      "Daily alarm, hourly chime, 12/24H format & LED backlight",
      "Slide-adjust clasp fits any wrist in seconds without tools",
    ],
    description:
      "Vintage digital charm meets brushed rose-gold refinement. Slim, lightweight, and effortlessly stylish for both men and women seeking an everyday icon under Rs. 1,500.",
  },
  {
    slug: "g9-pro-max-golden-edition-smartwatch",
    name: "G9 Pro Max Golden Edition AMOLED Smartwatch",
    subtitle: "2.02\" Curved AMOLED • Bluetooth Calling + Dual Straps",
    brand: "Modern Smart",
    category: "smart",
    pricePkr: 3850,
    compareAtPricePkr: 6200,
    badge: "GOLDEN EDITION • 38% OFF",
    isPackOfTwo: false,
    isWaterproof: true,
    featured: true,
    movement: "Dual-Core Smart Processor • BT 5.3",
    waterResistance: "IP68 Dust & Splash Rated",
    caseMaterial: "Brushed Gold Titanium-Finish Alloy",
    strapType: "Gold Steel Link Strap + Bonus Silicone Strap",
    caseSizeMm: 45,
    warranty: "1 Year Software & Hardware Support • 7-Day Return",
    stock: 21,
    rating: 4.8,
    reviewCount: 27,
    imageUrl: "/images/watches/golden-smartwatch.jpg",
    galleryUrls: ["/images/watches/golden-smartwatch.jpg"],
    variants: [
      { name: "18K Golden Edition", hex: "#D4AF37" },
      { name: "Titanium Silver", hex: "#9CA3AF" },
    ],
    highlights: [
      "HD Bluetooth voice calling directly from your wrist",
      "100+ customizable luxury analog & fitness watchfaces",
      "Heart-rate, SpO2, sleep insights & WhatsApp notifications",
      "Includes magnetic wireless charger + bonus sports strap",
    ],
    description:
      "All the prestige of a golden chronograph bracelet watch fused with flagship smartwatch intelligence. Features an edge-to-edge 60Hz AMOLED display and 5-day battery endurance.",
  },
  {
    slug: "skmei-2517-waterproof-tactical-digital",
    name: "Skmei 2517 50M Waterproof Swim & Sport Watch",
    subtitle: "50M Swim-Proof Seal • Dual Time & EL Night Glow",
    brand: "SKMEI Official",
    category: "waterproof",
    pricePkr: 1399,
    compareAtPricePkr: 2400,
    badge: "UNDER RS. 1,500 • 50M WATERPROOF",
    isPackOfTwo: false,
    isWaterproof: true,
    featured: false,
    movement: "Original SKMEI Digital Quartz",
    waterResistance: "5 ATM / 50M Full Swim Waterproof",
    caseMaterial: "ABS Shock-Guard & Stainless Backplate",
    strapType: "Soft Breathable PU Sports Band",
    caseSizeMm: 43,
    warranty: "1 Year SKMEI Movement Warranty",
    stock: 39,
    rating: 4.9,
    reviewCount: 45,
    imageUrl: "/images/watches/dualtime-sports.jpg",
    galleryUrls: ["/images/watches/dualtime-sports.jpg"],
    variants: [
      { name: "Tactical Black", hex: "#18181B" },
      { name: "Olive Ranger Green", hex: "#3F4E3A" },
    ],
    highlights: [
      "100% authentic SKMEI 50-meter waterproof engineering",
      "Priced under Rs. 1,500 for unbeatable everyday toughness",
      "Split-lap chronograph, dual timezone & full auto-calendar",
      "Stainless steel buckle & engraved waterproof caseback",
    ],
    description:
      "A legendary budget powerhouse. Tested for swimming, showering, and intense outdoor workouts, the Skmei 2517 delivers crisp digital legibility at an accessible under-1500 price.",
  },
  {
    slug: "crystal-time-twotone-pack-of-2-offer",
    name: "Crystal Time Two-Tone Watches – Pack of 2 Offer",
    subtitle: "2x Two-Tone Dress Watches • Value Mega Bundle",
    brand: "Crystal Time",
    category: "combo",
    pricePkr: 1499,
    compareAtPricePkr: 3000,
    badge: "PACK OF 2 • UNDER RS. 1,500",
    isPackOfTwo: true,
    isWaterproof: false,
    featured: false,
    movement: "Dual Quartz Analog Movements",
    waterResistance: "Splash Resistant",
    caseMaterial: "Two-Tone Silver & Gold Finish",
    strapType: "2x Two-Tone Link Bracelets",
    caseSizeMm: 39,
    warranty: "7-Day Return & 6-Month Machine Warranty",
    stock: 30,
    rating: 4.7,
    reviewCount: 36,
    imageUrl: "/images/watches/twotone-royal.jpg",
    galleryUrls: [
      "/images/watches/twotone-royal.jpg",
      "/images/watches/pack2-steel-bundle.jpg",
    ],
    variants: [{ name: "Classic Two-Tone Pair", hex: "#C8A45D" }],
    highlights: [
      "Two complete two-tone dress watches for just Rs. 1,499",
      "50% OFF 11.11 Mega Bundle pricing",
      "Polished gold-and-silver links match formal & festive wear",
      "Cash on Delivery available nationwide",
    ],
    description:
      "Our highest-value twin bundle under Rs. 1,500. Enjoy two matching two-tone quartz dress watches crafted for gifting, family events, and daily smart-casual wear.",
  },
];

const INITIAL_REVIEWS = [
  {
    watchSlug: "obsidian-chronos-master-lock-executive",
    watchName: "Obsidian Chronos Master-Lock Executive Watch",
    watchImage: "/images/watches/hero-chronograph.jpg",
    customerName: "Muhammad Numan Fazal",
    city: "Islamabad",
    rating: 5,
    comment:
      "I’m really impressed with the timepiece. The watch looks even sharper than the studio pictures, solid weight on the wrist, and the master-lock clasp feels super premium for this budget!",
    verified: true,
  },
  {
    watchSlug: "compani-quartz-pack-of-2-steel-bundle",
    watchName: "Compani Quartz Pack of 2 – Steel Bracelet Bundle",
    watchImage: "/images/watches/pack2-steel-bundle.jpg",
    customerName: "Zaman Butt",
    city: "Lahore",
    rating: 5,
    comment:
      "Great quality in such a reasonable price. Kept the midnight blue dial for myself and gifted the black one to my brother. Highly recommended from my side!",
    verified: true,
  },
  {
    watchSlug: "royal-jubilee-twotone-fluted-luxury",
    watchName: "Royal Jubilee Two-Tone Fluted Luxury Watch",
    watchImage: "/images/watches/twotone-royal.jpg",
    customerName: "Israr Ahmed",
    city: "Abbottabad",
    rating: 5,
    comment:
      "Received the parcel on time via Cash on Delivery. It is an absolute masterpiece—fluted bezel shines beautifully under light with an affordable and elegant style. 10/10!",
    verified: true,
  },
  {
    watchSlug: "tank-classic-rectangular-dress-pack-of-2",
    watchName: "Tank Classic Rectangular Dress Set – Pack of 2",
    watchImage: "/images/watches/pack2-tank-dress.jpg",
    customerName: "Shahzad Bashir",
    city: "Karachi",
    rating: 5,
    comment:
      "Ordered the Tank rectangular Pack of 2 for an anniversary gift. Both watches arrived in pristine packaging and look genuinely classy on formal wear.",
    verified: true,
  },
  {
    watchSlug: "x-gear-world-time-dual-tactical-watch",
    watchName: "X-Gear Waterproof World-Time Dual Watch",
    watchImage: "/images/watches/dualtime-sports.jpg",
    customerName: "Sajid Imtiaz",
    city: "Rawalpindi",
    rating: 5,
    comment:
      "Tested it in rain and daily wudu for two weeks—100% waterproof and both analog and digital displays stay accurate. Best feel and build quality.",
    verified: true,
  },
  {
    watchSlug: "black-arabic-aura-matte-edition",
    watchName: "Black Arabic Aura Minimalist Matte Watch",
    watchImage: "/images/watches/arabic-aura-black.jpg",
    customerName: "Mahum Ayoub",
    city: "Faisalabad",
    rating: 5,
    comment:
      "Under Rs. 1,500 this Black Arabic Aura watch is unbeatable. Matte finish doesn't catch fingerprints and everyone asks where I got it from!",
    verified: true,
  },
  {
    watchSlug: "hb-lot-diamond-cut-skeleton-automatic",
    watchName: "HB-Lot Diamond-Cut Open-Heart Automatic",
    watchImage: "/images/watches/skeleton-automatic.jpg",
    customerName: "Hamza Tariq",
    city: "Multan",
    rating: 5,
    comment:
      "Watching the mechanical gears move without any battery is mesmerizing. The diamond-cut steel chain catches light like a luxury boutique watch.",
    verified: true,
  },
  {
    watchSlug: "g9-pro-max-golden-edition-smartwatch",
    watchName: "G9 Pro Max Golden Edition AMOLED Smartwatch",
    watchImage: "/images/watches/golden-smartwatch.jpg",
    customerName: "Zainab Malik",
    city: "Lahore",
    rating: 5,
    comment:
      "Smooth AMOLED screen, crystal clear call audio, and the golden metal bracelet gives it a real luxury watch vibe rather than a plastic gadget.",
    verified: true,
  },
];

let seedPromise: Promise<void> | null = null;

export async function ensureStoreSeeded(): Promise<void> {
  if (seedPromise) {
    return seedPromise;
  }

  seedPromise = (async () => {
    try {
      const [{ value: existingCount }] = await db
        .select({ value: count() })
        .from(watches);

      if (existingCount > 0) {
        return;
      }

      const insertedWatches = await db
        .insert(watches)
        .values(INITIAL_WATCHES)
        .returning();

      const slugToId = new Map(insertedWatches.map((w) => [w.slug, w.id]));

      await db.insert(reviews).values(
        INITIAL_REVIEWS.map((rev) => ({
          watchId: slugToId.get(rev.watchSlug) ?? null,
          watchName: rev.watchName,
          watchImage: rev.watchImage,
          customerName: rev.customerName,
          city: rev.city,
          rating: rev.rating,
          comment: rev.comment,
          verified: rev.verified,
        }))
      );

      const sampleWatch = insertedWatches[0];
      if (sampleWatch) {
        await db
          .insert(orders)
          .values({
            orderNumber: "MW-2026-1111",
            customerName: "Israr Ahmed",
            phone: "+92 346 4653712",
            email: "collector@modernwatch.fun",
            city: "Abbottabad",
            address: "Suite 14, Sarafa Bazar Heritage Plaza, Abbottabad",
            paymentMethod: "cod",
            promoCode: "MEGA11",
            notes: "Gift wrap requested",
            subtotalPkr: sampleWatch.pricePkr,
            discountPkr: 330,
            shippingPkr: 0,
            totalPkr: sampleWatch.pricePkr - 330,
            status: "Dispatched",
            items: [
              {
                watchId: sampleWatch.id,
                slug: sampleWatch.slug,
                name: sampleWatch.name,
                variant: "Silver & 18K Gold",
                pricePkr: sampleWatch.pricePkr,
                quantity: 1,
                imageUrl: sampleWatch.imageUrl,
              },
            ],
          })
          .onConflictDoNothing();
      }
    } catch (err) {
      // Allow seed retry on next request if database schema has not been pushed yet
      seedPromise = null;
      console.warn("Store seed skipped or deferred:", err);
    }
  })();

  return seedPromise;
}
