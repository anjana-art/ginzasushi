// lib/constants.ts

export const SITE = {
  name: "Ginza",
  tagline: "Japanese Sushi Takeaway",
  description:
    "Fresh, authentic Japanese sushi and ramen for takeaway and delivery. Order online for pickup or delivery in under 30 minutes.",

  phone: "+441234567890",
  phoneDisplay: "01234 567 890",
  email: "hello@ginza.co.uk",
  address: {
    line1: "123 Sushi Lane",
    line2: "",
    city: "London",
    postcode: "E1 6AN",
    country: "United Kingdom",
  },

  hours: {
    monday: "11:30 – 22:00",
    tuesday: "11:30 – 22:00",
    wednesday: "11:30 – 22:00",
    thursday: "11:30 – 22:00",
    friday: "11:30 – 23:00",
    saturday: "12:00 – 23:00",
    sunday: "12:00 – 21:30",
  },

  social: {
    instagram: "https://instagram.com/ginza",
    facebook: "https://facebook.com/ginza",
    tiktok: "https://tiktok.com/@ginza",
  },

  // Order
  minOrder: 15,
  deliveryFee: 0,
  deliveryRadiusKm: 1.5,
  deliveryRadius: "1.5 km",
  avgPrepTime: 25,

  // Restaurant location (from Google Maps)
  location: {
    lat: parseFloat(process.env.NEXT_PUBLIC_RESTAURANT_LAT || "51.5074"),
    lng: parseFloat(process.env.NEXT_PUBLIC_RESTAURANT_LNG || "-0.1278"),
  },

  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002",
} as const;

export const CATEGORIES_FALLBACK = [
  { name: "Nigiri", slug: "nigiri", sortOrder: 1 },
  { name: "Maki Rolls", slug: "maki-rolls", sortOrder: 2 },
  { name: "Gunkan", slug: "gunkan", sortOrder: 3 },
  { name: "Uramaki", slug: "uramaki", sortOrder: 4 },
  { name: "Special Rolls", slug: "special-rolls", sortOrder: 5 },
  { name: "Sashimi", slug: "sashimi", sortOrder: 6 },
  { name: "Ramen", slug: "ramen", sortOrder: 7 },
  { name: "Bento Boxes", slug: "bento", sortOrder: 8 },
  { name: "Hot Starters", slug: "hot-starters", sortOrder: 9 },
  { name: "Cold Starters", slug: "cold-starters", sortOrder: 10 },
  { name: "Sides", slug: "sides", sortOrder: 11 },
  { name: "Drinks", slug: "drinks", sortOrder: 12 },
  { name: "Desserts", slug: "desserts", sortOrder: 13 },
] as const;

export const ORDER_STATUS_LABELS = {
  PENDING: "Pending",
  PAID: "Paid",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
} as const;

export const TRACKING_STATUS_LABELS = {
  ORDER_RECEIVED: "Order received",
  ORDER_PREPARING: "Preparing your order",
  READY_FOR_PICKUP: "Ready for pickup",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  DELAYED: "Running slightly late",
} as const;

export const ALLERGEN_LABELS = {
  fish: "Fish",
  shellfish: "Shellfish",
  soy: "Soy",
  gluten: "Gluten",
  sesame: "Sesame",
  egg: "Egg",
  milk: "Milk",
  nuts: "Nuts",
} as const;

export const SPICE_LEVEL_LABELS = {
  NONE: "",
  MILD: "🌶️ Mild",
  MEDIUM: "🌶️🌶️ Medium",
  HOT: "🌶️🌶️🌶️ Hot",
  EXTRA_HOT: "🌶️🌶️🌶️🌶️ Extra Hot",
} as const;

export const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/frequentlyAskedQuestions" },
] as const;