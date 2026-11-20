// prisma/seed.ts
import { PrismaClient, SpiceLevel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Ginza...");

  // ==================== ADMIN USER ====================
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ginza.com" },
    update: {},
    create: {
      email: "admin@ginza.com",
      name: "Ginza Admin",
      password: adminPassword,
      isAdmin: true,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // ==================== CATEGORIES ====================
  const categories = [
    { name: "Hoso Maki",       slug: "hoso-maki",       description: "Thin sushi rolls", sortOrder: 1 },
    { name: "Uramaki",         slug: "uramaki",         description: "Inside-out rolls with rice on the outside", sortOrder: 2 },
    { name: "Futo Maki",       slug: "futo-maki",       description: "Thick sushi rolls", sortOrder: 3 },
    { name: "Temaki",          slug: "temaki",          description: "Hand-rolled cone sushi", sortOrder: 4 },
    { name: "Nigiri",          slug: "nigiri",          description: "Hand-pressed sushi over rice", sortOrder: 5 },
    { name: "Gunkan",          slug: "gunkan",          description: "Battleship-style sushi", sortOrder: 6 },
    { name: "Sashimi",         slug: "sashimi",         description: "Fresh sliced raw fish", sortOrder: 7 },
    { name: "Hot Rolls",       slug: "hot-rolls",       description: "Fried and warm sushi rolls", sortOrder: 8 },
    { name: "Combinado",       slug: "combinado",       description: "Combination platters", sortOrder: 9 },
    { name: "Hot Starters",    slug: "hot-starters",    description: "Warm appetisers to begin your meal", sortOrder: 10 },
    { name: "Cold Starters",   slug: "cold-starters",   description: "Chilled appetisers and small bites", sortOrder: 11 },
    { name: "Ramen",           slug: "ramen",           description: "Japanese noodle soups", sortOrder: 12 },
    { name: "Extra",           slug: "extra",           description: "Add-ons and sides", sortOrder: 13 },
    { name: "Drinks",          slug: "drinks",          description: "Green tea, sake, soft drinks", sortOrder: 14 },
    { name: "Cocktails",       slug: "cocktails",       description: "Signature mixed drinks", sortOrder: 15 },
    { name: "Desserts",        slug: "desserts",        description: "Mochi, matcha cheesecake", sortOrder: 16 },
    { name: "Wine List",       slug: "wine-list",       description: "Red, white, and sake selections", sortOrder: 17 },
    { name: "Poké",            slug: "poke-bowl",       description: "Poké bowls", sortOrder: 18 },
  ];

  const catMap: Record<string, string> = {};
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    catMap[cat.slug] = c.id;
  }
  console.log(`✅ ${categories.length} categories created`);

  // ==================== MENU ITEMS ====================
  const items = [
    // ---------- COMBINADOS ----------
    {
      name: "Ginza Mini Box - 12 peças", slug: "ginza-mini", categorySlug: "combinado",
      description: "12 Peças (4 California de salmão e abacate, 4 hosomaki de salmão, 2 nigiri de salmão e 2 hot rolls)",
      price: 9.90, images: ["/Menu/combinado/ginza_mini_box.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Ginza Bento Box - 16 peças", slug: "ginza-bento-box", categorySlug: "combinado",
      description: "16 Peças (8 California de salmão e abacate, 4 hosomaki de salmão e 4 hot rolls)",
      price: 12.90, images: ["/Menu/combinado/ginza_bento_box.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Ginza Hot Lovers - 16 peças", slug: "ginza-hot", categorySlug: "combinado",
      description: "16 Peças (8 uramaki hot rolls de salmão e 8 hosomaki hot rolls de salmão, fritos e crocantes)",
      price: 12.90, images: ["/Menu/combinado/ginza_hot_lovers.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Ginza Salmão Lovers - 16 peças", slug: "ginza-salmon-lovers", categorySlug: "combinado",
      description: "16 Peças (8 California de salmão e abacate, 4 hosomaki de salmão, 2 nigiri de salmão e 2 gunkan de salmão.)",
      price: 14.90, images: ["/Menu/combinado/ginza_salmon_lovers.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Ginza Rainbow - 16 peças", slug: "ginza-rainbow", categorySlug: "combinado",
      description: "16 Peças (8 California variados, 2 nigiri de salmão, 1 nigiri de atum, 1 nigiri de camarão, 2 gunkan de salmão e 2 gunkan de abacate e manga.)",
      price: 15.90, images: ["/Menu/combinado/ginza_rainbow.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Ginza California Lovers - 16 peças", slug: "clifornia-lovers", categorySlug: "combinado",
      description: "16 Peças Seleção de California com recheios variados",
      price: 16.00, images: ["/Menu/combinado/ginza_california_lovers.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Ginza Duo Box - 32 peças", slug: "ginza-duo-box", categorySlug: "combinado",
      description: "32 Peças (8 California de salmão e manga, 8 California de salmão e abacate, 8 hosomaki de salmão e 8 hot rolls)",
      price: 24.90, images: ["/Menu/combinado/ginza_duo_box.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Alma de Ginza - 20 peças", slug: "alma-de-ginza", categorySlug: "combinado",
      description: "20 peças (8 california salmão, 4 hosomaki salmão, 2 nigiri salmão, 2 nigiri atum, 2 gunkan salmão roll, 2 sashimi salmão)",
      price: 20.00, images: ["/Menu/combinado/example.jpg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Combinado Ginza - 23 peças", slug: "ginza-combo-20pic", categorySlug: "combinado",
      description: "23 Peças (8 california salmão, 4 hosomaki salmão, 2 nigiri salmão, 2 nigiri atum, 2 gunkan salmão roll, 2 sashimi salmão, 3 peças extras)",
      price: 24.00, images: ["/Menu/combinado/ginza-combo-20pic.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Combinado Ginkyoko - 48 peças", slug: "combinado-ginkyo", categorySlug: "combinado",
      description: "48 peças de seleção variada de sushi",
      price: 42.00, images: ["/Menu/combinado/example.jpg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- FUTO MAKI ----------
    {
      name: "Futomaki - 5 peças", slug: "futo-maki", categorySlug: "futo-maki",
      description: "Salmão e delícias do mar",
      price: 5.00, images: ["/Menu/futo-maki/Futomaki.jpeg"],
      allergens: ["fish", "soy"], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- NIGIRI ----------
    {
      name: "Nigiri Salmão - 2 peças", slug: "salmon-nigiri", categorySlug: "nigiri",
      description: "Salmão fresco sobre arroz temperado",
      price: 3.60, images: ["/Menu/nigiri/nigiri-salmon.png"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Nigiri Atum - 2 peças", slug: "tuna-nigiri", categorySlug: "nigiri",
      description: "Atum premium sobre arroz temperado",
      price: 4.50, images: ["/Menu/nigiri/nigiri-tuna.png"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Nigiri Camarão - 2 peças", slug: "shrimp-nigiri", categorySlug: "nigiri",
      description: "Camarão sobre arroz temperado",
      price: 4.50, images: ["/Menu/nigiri/nigiri-shrimp.png"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Nigiri Salmão braseado - 2 peças", slug: "braised salmon", categorySlug: "nigiri",
      description: "Salmão braseado premium sobre arroz temperado",
      price: 4.00, images: ["/Menu/nigiri/nigiri-salmon-braseado.png"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Nigiri Abacate - 2 peças", slug: "abacate-nigiri", categorySlug: "nigiri",
      description: "Abacate sobre arroz temperado",
      price: 3.00, images: ["/Menu/nigiri/nigiri-abacado.png"],
      allergens: ["shellfish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Nigiri Polvo - 2 peças", slug: "octopus-nigiri", categorySlug: "nigiri",
      description: "Polvo premium sobre arroz temperado",
      price: 4.50, images: ["/Menu/nigiri/nigiri-octopus.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- HOSO MAKI ----------
    {
      name: "Hosomaki Salmão (Sake Maki) - 8 peças", slug: "hosomaki-salmon", categorySlug: "hoso-maki",
      description: "Salmão fresco enrolado em nori e arroz",
      price: 6.80, images: ["/Menu/hosomaki/hosomaki-salmon.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Hosomaki Atum (Tekka Maki) - 8 peças", slug: "hosomaki-tuna", categorySlug: "hoso-maki",
      description: "Atum fresco enrolado em nori e arroz",
      price: 8.00, images: ["/Menu/hosomaki/hosomaki-tuna.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Hosomaki Pepino (Kappa Maki) - 8 peças", slug: "hosomaki-pepino", categorySlug: "hoso-maki",
      description: "Pepino enrolado em nori e arroz",
      price: 6.30, images: ["/Menu/hosomaki/hosomaki-pipino.jpg"],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Hosomaki Camarão (Ebi Maki) - 8 peças", slug: "hosomaki-camarao", categorySlug: "hoso-maki",
      description: "Camarão cozido enrolado em nori e arroz",
      price: 6.60, images: ["/Menu/hosomaki/hosomaki-camarao.png"],
      isContainsRawFish: true, allergens: ["fish", "egg"],
    },
    {
      name: "Hosomaki Abacate - 8 peças", slug: "hosomaki-avocado", categorySlug: "hoso-maki",
      description: "Abacate enrolado em nori e arroz",
      price: 6.30, images: ["/Menu/hosomaki/hosomaki-abacado.jpg"],
      allergens: ["shellfish", "sesame"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Hosomaki Manga - 8 peças", slug: "hosomaki-mango", categorySlug: "hoso-maki",
      description: "Manga doce enrolada em nori e arroz",
      price: 6.30, images: ["/Menu/hosomaki/hosomaki-mango.jpg"],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- URAMAKI / CALIFORNIA ----------
    {
      name: "California de Salmão - 8 peças", slug: "california-salmon", categorySlug: "uramaki",
      description: "Rolo de arroz com salmão, abacate, pepino e queijo Philadelphia.",
      price: 7.50, images: ["/Menu/uramaki/california_salmon.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "California de Salmão e Manga - 8 peças", slug: "uramaki-salmon-manga", categorySlug: "uramaki",
      description: "Rolo de arroz com salmão, manga e queijo Philadelphia.",
      price: 7.50, images: ["/Menu/uramaki/salmon_manga_uramaki.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "California de Salmão com Cobertura de Salmão - 8 peças", slug: "california-salmon-with-salmon", categorySlug: "uramaki",
      description: "Rolo de arroz com salmão, abacate, pepino e queijo Philadelphia, coberto com fatias de salmão.",
      price: 8.50, images: ["/Menu/uramaki/uramaki_salmon_cobertura_salmon.jpeg"],
      allergens: ["shellfish", "fish", "soy"], spiceLevel: SpiceLevel.MILD,
    },
    {
      name: "California de Salmão com Cobertura de Salmão Braseado - 8 peças", slug: "uramaki-salmon-braised-salmon-topping", categorySlug: "uramaki",
      description: "Rolo de arroz com salmão, abacate, pepino e queijo Philadelphia, coberto com fatias de salmão braseado.",
      price: 9.00, images: ["/Menu/uramaki/uramaki_salmon_cobertura_salmon_braseado.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "California de Atum - 8 peças", slug: "uramaki-atun", categorySlug: "uramaki",
      description: "Rolo de arroz com atum, abacate e pepino",
      price: 9.00, images: ["/Menu/uramaki/uramaki_atun_pipino_abacate.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "Uramaki de Camarão (Ebi) - 8 peças", slug: "uramaki-camarao", categorySlug: "uramaki",
      description: "Rolo de arroz com camarão cozido, abacate, pepino e queijo Philadelphia.",
      price: 7.00, images: ["/Menu/uramaki/uramaki_camarao.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "California de Delícias do Mar - 8 peças", slug: "uramaki-delicia", categorySlug: "uramaki",
      description: "Rolo de arroz com delícias do mar.",
      price: 7.50, images: ["/Menu/uramaki/uramaki_delicia_domar.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "Spicy Salmon Roll - 8 peças", slug: "spicy-salmon-roll", categorySlug: "uramaki",
      description: "Rolo de arroz com salmão picante",
      price: 7.50, images: ["/Menu/uramaki/spicy_roll.png"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
      spiceLevel: SpiceLevel.MILD,
    },
    {
      name: "Chicken Crunchy Roll - 8 peças", slug: "uramaki-chicken", categorySlug: "uramaki",
      description: "Rolo de arroz com frango panado e queijo Philadelphia.",
      price: 6.00, images: ["/Menu/uramaki/crispy_chicken.png"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "Vegan Roll - 8 peças", slug: "vegan-roll", categorySlug: "uramaki",
      description: "Rolo de arroz vegano",
      price: 6.00, images: ["/Menu/uramaki/example.jpg"],
      isVegetarian: true, isVegan: true,
      allergens: ["sesame"], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- TEMAKI ----------
    {
      name: "Temaki Salmão", slug: "salmon-temaki", categorySlug: "temaki",
      description: "Cone enrolado à mão com salmão",
      price: 5.60, images: ["/Menu/temaki/Temaki-salmon.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Temaki Atum", slug: "temaki-atun", categorySlug: "temaki",
      description: "Cone enrolado à mão com atum",
      price: 8.00, images: ["/Menu/temaki/Temaki-atum.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Temaki Salmão e Philadelphia", slug: "salmon-temaki-philadelphia", categorySlug: "temaki",
      description: "Cone enrolado à mão com salmão e Philadelphia",
      price: 6.30, images: ["/Menu/temaki/Temaki-salmon-philadelphia.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Temaki Vegetariano", slug: "vegeterian-temaki", categorySlug: "temaki",
      description: "Cone enrolado à mão vegetariano",
      price: 5.00, images: ["/Menu/temaki/temaki-veggie.jpeg"],
      isVegetarian: true, isVegan: true,
      allergens: [], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- GUNKAN ----------
    {
      name: "Gunkan Salmão - 2 peças", slug: "salmon-gunkan", categorySlug: "gunkan",
      description: "Salmão sobre arroz, envolto em nori",
      price: 2.90, images: ["/Menu/gunkan/gunkan_salmon_ai.png"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      isFeatured: true,
    },
    {
      name: "Gunkan Atum - 2 peças", slug: "tuna-gunkan", categorySlug: "gunkan",
      description: "Atum sobre arroz, envolto em nori",
      price: 3.20, images: ["/Menu/gunkan/gunkan-tuna.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      isFeatured: true,
    },
    {
      name: "Gunkan Wakame - 2 peças", slug: "wakami-gunkan", categorySlug: "gunkan",
      description: "Wakame sobre arroz, envolto em nori",
      price: 2.50, images: ["/Menu/gunkan/gunkan_wakami.png"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      isFeatured: true,
    },
    {
      name: "Gunkan Abacate e Manga - 2 peças", slug: "gunkan-abacate-manga", categorySlug: "gunkan",
      description: "Abacate e manga sobre arroz, envolto em nori",
      price: 2.20, images: ["/Menu/gunkan/gunkan-mangaabacate.jpeg"],
      isVegetarian: true, isVegan: true,
      allergens: [], spiceLevel: SpiceLevel.NONE,
      isFeatured: true,
    },
    {
      name: "Gunkan Envolto em Salmão com Atum - 2 peças", slug: "gunkan-tuna-topping", categorySlug: "gunkan",
      description: "Atum sobre arroz, envolto em salmão",
      price: 5.00, images: ["/Menu/gunkan/gunkan-atum-with-salmon-roll.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      isFeatured: true,
    },
    {
      name: "Gunkan Envolto em Salmão com Salmão Picado - 2 peças", slug: "gunkan-salmon-roll", categorySlug: "gunkan",
      description: "Salmão picado sobre arroz, envolto em salmão",
      price: 3.00, images: ["/Menu/gunkan/gunkan-salmon-roll.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      isFeatured: true,
    },
    {
      name: "Gunkan Envolto em Salmão com Salmão Braseado - 2 peças", slug: "gunkan-braised-salmon", categorySlug: "gunkan",
      description: "Salmão braseado sobre arroz, envolto em salmão",
      price: 3.90, images: ["/Menu/gunkan/gunkan-salmon-braseado.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      isFeatured: true,
    },
    {
      name: "Gunkan Envolto em Salmão com Philadelphia - 2 peças", slug: "gunkan-philadelphia-topping", categorySlug: "gunkan",
      description: "Philadelphia sobre arroz, envolto em salmão",
      price: 2.60, images: ["/Menu/gunkan/gunkan-philadelphia-with-salmon-roll.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      isFeatured: true,
    },

    // ---------- SASHIMI ----------
    {
      name: "Sashimi Salmão - 5 peças", slug: "salmon-sashimi", categorySlug: "sashimi",
      description: "Fatias de salmão fresco premium",
      price: 4.00, images: ["/Menu/sashimi/sashimi-salmon.jpg"],
      isContainsRawFish: true, isGlutenFree: true, allergens: ["fish"],
      spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Sashimi Atum - 5 peças", slug: "tuna-sashimi", categorySlug: "sashimi",
      description: "Fatias de atum fresco premium",
      price: 7.00, images: ["/Menu/sashimi/sashimi-tuna.jpg"],
      isContainsRawFish: true, isGlutenFree: true, allergens: ["fish"],
      spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Sashimi Salmão Braseado - 5 peças", slug: "braised-salmon-sashimi", categorySlug: "sashimi",
      description: "Fatias de salmão braseado",
      price: 5.00, images: ["/Menu/sashimi/sashimi_salmao_braseado.png"],
      isContainsRawFish: true, isGlutenFree: true, allergens: ["fish"],
      spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Sashimi Polvo - 5 peças", slug: "octopus-sashimi", categorySlug: "sashimi",
      description: "Fatias de polvo premium",
      price: 6.50, images: ["/Menu/sashimi/sashimi-octopus.jpg"],
      isContainsRawFish: true, isGlutenFree: true, allergens: ["fish"],
      spiceLevel: SpiceLevel.NONE,
    },

    // ---------- HOT ROLLS ----------
    {
      name: "Uramaki de Salmão (Hot) - 8 peças", slug: "uramaki-salmon-hot", categorySlug: "hot-rolls",
      description: "Rolo de salmão frito",
      price: 9.50, images: ["/Menu/hot-rolls/clifornia_hot_roll.png"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Hosomaki de Salmão (Hot) - 8 peças", slug: "hosomaki-salmon-hot", categorySlug: "hot-rolls",
      description: "Rolo de salmão frito",
      price: 8.00, images: ["/Menu/hot-rolls/hosomaki_hot_roll.jpg"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- HOT STARTERS ----------
    {
      name: "Sopa", slug: "miso-sopa", categorySlug: "hot-starters",
      description: "Sopa de miso",
      price: 4.50, images: ["/Menu/hot-starters/miso-sopa.jpeg"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Ebi Tempura - 4 peças", slug: "ebi-tempura", categorySlug: "hot-starters",
      description: "Camarão empanado com tentsuyu",
      price: 6.50, images: ["/Menu/hot-starters/ebi-tempura.jpeg"],
      allergens: ["gluten", "soy"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Crepes de Vegetais - 4 peças", slug: "crepe", categorySlug: "hot-starters",
      description: "Crepes vegetarianas",
      price: 5.00, images: ["/Menu/hot-starters/crepe.jpeg"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Edamame com Sal Marinho", slug: "edamame", categorySlug: "hot-starters",
      description: "Edamame cozido com sal",
      price: 4.80, images: ["/Menu/hot-starters/edamame.png"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Gyozas de Vegetais - 5 peças", slug: "gyoza-veggie", categorySlug: "hot-starters",
      description: "Gyozas vegetarianas com molho ponzu",
      price: 5.50, images: ["/Menu/hot-starters/gyoza_veggie.png"],
      allergens: ["gluten", "soy", "sesame"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Gyozas de Frango - 5 peças", slug: "gyoza", categorySlug: "hot-starters",
      description: "Gyozas de frango com molho ponzu",
      price: 6.00, images: ["/Menu/hot-starters/gyoza.jpg"],
      allergens: ["gluten", "soy", "sesame"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Hot Roll - 4 peças", slug: "hot-roll-4pc", categorySlug: "hot-starters",
      description: "Rolo frito",
      price: 5.00, images: ["/Menu/hot-starters/hot-roll.jpg"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- COLD STARTERS ----------
    {
      name: "Tártaro de Salmão", slug: "salmon-ceviche", categorySlug: "cold-starters",
      description: "Salmão fresco cortado em pequenos cubos e delicadamente temperado",
      price: 9.00, images: ["/Menu/cold-starters/tartaro-de-salmao.jpeg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Sunomono", slug: "sunomono-salad", categorySlug: "cold-starters",
      description: "Pepino marinado com sésamo e gengibre",
      price: 5.00, images: ["/Menu/cold-starters/sunomono.png"],
      isVegetarian: true, isVegan: true, allergens: ["sesame", "soy"],
    },
    {
      name: "Salada de Wakame", slug: "seaweed-salad", categorySlug: "cold-starters",
      description: "Wakame marinado com sésamo e gengibre",
      price: 4.00, images: ["/Menu/cold-starters/wakame.jpg"],
      isVegetarian: true, isVegan: true, allergens: ["sesame", "soy"],
    },

    // ---------- RAMEN ----------
    {
      name: "Ramen de Frango", slug: "chicken-ramen", categorySlug: "ramen",
      description: "Ramen de frango",
      price: 12.50, images: ["/Menu/ramen/example.jpg"],
      allergens: ["gluten", "soy", "sesame"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Ramen Vegetariano", slug: "veggie-ramen", categorySlug: "ramen",
      description: "Ramen vegetariano",
      price: 12.00, images: ["/Menu/ramen/example.jpg"],
      isVegetarian: true, allergens: ["gluten", "soy", "sesame"],
      spiceLevel: SpiceLevel.NONE,
    },

    // ---------- POKÉ ----------
    {
      name: "Poké Ginza", slug: "poke-ginza", categorySlug: "poke-bowl",
      description: "Salmão, sunomono, abacate, manga, camarão ebi e edamame",
      price: 9.90, images: ["/Menu/poke-bowl/example.jpg"],
      isContainsRawFish: true, allergens: ["fish", "soy", "sesame"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Poké Vegan", slug: "poke-vegan", categorySlug: "poke-bowl",
      description: "Tofu, cogumelos shiitake, manga, sunomono, abacate e edamame",
      price: 9.00, images: ["/Menu/poke-bowl/example.jpg"],
      isVegetarian: true, isVegan: true,
      allergens: ["soy", "sesame"], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- DESSERTS ----------
    {
      name: "Mochi Caramelo e Amêndoa", slug: "mochi-caramelo", categorySlug: "desserts",
      description: "Mochi de caramelo e amêndoa",
      price: 4.00, images: ["/Menu/desserts/mochi_caramel_almond.png"],
      isVegetarian: true, allergens: ["milk"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Mochi Limão", slug: "mochi-limao", categorySlug: "desserts",
      description: "Mochi de limão",
      price: 4.00, images: ["/Menu/desserts/mochi_lemon.png"],
      isVegetarian: true, allergens: ["milk"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Mochi Maracujá", slug: "mochi-maracuja", categorySlug: "desserts",
      description: "Mochi de maracujá",
      price: 4.00, images: ["/Menu/desserts/mochi_maracuja.png"],
      isVegetarian: true, allergens: ["milk"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Petit Gâteau", slug: "petit-gateau", categorySlug: "desserts",
      description: "Petit gâteau",
      price: 4.00, images: ["/Menu/desserts/petit_gateau.png"],
      isVegetarian: true, allergens: ["milk", "gluten", "egg"],
      spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Gelado Baunilha (1 bola)", slug: "gelado-baunilha", categorySlug: "desserts",
      description: "Gelado de baunilha",
      price: 2.00, images: ["/Menu/desserts/vanilla_icecream.png"],
      isVegetarian: true, allergens: ["milk"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Gelado Chocolate (1 bola)", slug: "gelado-chocolate", categorySlug: "desserts",
      description: "Gelado de chocolate",
      price: 2.00, images: ["/Menu/desserts/chocolate_icecream.png"],
      isVegetarian: true, allergens: ["milk"], spiceLevel: SpiceLevel.NONE,
    },

  /*   // ---------- EXTRA ----------
    {
      name: "Extra Gengibre", slug: "extra-ginger", categorySlug: "extra",
      description: "Porção de gengibre em conserva",
      price: 1.00, images: [""],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- COCKTAILS ----------
    {
      name: "Martini", slug: "martini", categorySlug: "cocktails",
      description: "Martini classico",
      price: 12.00, images: [""],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- WINE LIST ----------
    {
      name: "Copo Vinho Tinto/branco da Casa", slug: "cup-wine", categorySlug: "wine-list",
      description: "Copo de vinho tinto da casa",
      price: 4.00, images: [""],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE,
    }, */
  ];

  for (const item of items) {
    const created = await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: { images: item.images },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        images: item.images,
        categoryId: catMap[item.categorySlug],
        spiceLevel: item.spiceLevel ?? SpiceLevel.NONE,
        isVegetarian: item.isVegetarian ?? false,
        isVegan: item.isVegan ?? false,
        isGlutenFree: item.isGlutenFree ?? false,
        isContainsRawFish: item.isContainsRawFish ?? false,
        allergens: item.allergens ?? [],
       
        isFeatured: item.isFeatured ?? false,
        stock: 100,
      },
    });

    if (item.slug === "california-salmon") {
      await prisma.menuItemOption.createMany({
        data: [
          { menuItemId: created.id, name: "6 pieces",  group: "Size", priceAdjustment: 0,   isDefault: true, sortOrder: 1 },
          { menuItemId: created.id, name: "12 pieces", group: "Size", priceAdjustment: 4.50, sortOrder: 2 },
        ],
      });
    }
  }

  console.log(`✅ ${items.length} menu items created with options`);
  console.log("🌱 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });