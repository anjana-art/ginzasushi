// lib/constants.ts

export const SITE = {
  name: "",
  tagline: "",
  description:
    " A new sushi spot in Lisbon. Dine in with us — we seat 8–10 guests indoors and 8–10 on our outdoor terrace. Takeaway and pickup available, order by phone. Delivery via Uber Eats, Glovo, and Bolt.",

  phone: "211552468",
  phoneDisplay: "211552468",
  email: "ginzasushibarlisbon@gmail.com",
  address: {
    line1: "Rua luciano cordeiro 23 b",
    line2: "",
    city: "Lisbon",
    postcode: "1150-212",
    country: "portugal",
  },

  hours: {
    monday: "closed",
    tuesday: "12:00pm – 15:00pm & 18:00pm - 23:00pm",
    wednesday: "12:00pm – 15:00pm & 18:00pm - 23:00pm",
    thursday:  "12:00pm – 15:00pm & 18:00pm - 23:00pm",
    friday: "12:00pm – 15:00pm & 18:00pm - 23:00pm",
    saturday:  "12:00pm – 15:00pm & 18:00pm - 23:00pm",
    sunday:  "12:00pm – 15:00pm & 18:00pm - 23:00pm",
  },

  social: {
    instagram: "https://instagram.com/ginzasushi2026",
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