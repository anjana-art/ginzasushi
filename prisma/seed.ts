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
  // Added all missing categories from the handwritten list
  const categories = [
    { name: "Hoso Maki",       slug: "hoso-maki",       description: "Thin sushi rolls", sortOrder: 1 },
    { name: "Uramaki",         slug: "uramaki",         description: "Inside-out rolls with rice on the outside", sortOrder: 2 },
    { name: "Futo Maki",       slug: "futo-maki",       description: "Thick sushi rolls", sortOrder: 3 },
    { name: "Temaki",          slug: "temaki",          description: "Hand-rolled cone sushi", sortOrder: 4 },
    { name: "Nigiri",          slug: "nigiri",          description: "Hand-pressed sushi over rice", sortOrder: 5 },
    { name: "Gunkan",          slug: "gunkan",          description: "Battleship-style sushi", sortOrder: 6 },
    { name: "Sashimi",         slug: "sashimi",         description: "Fresh sliced raw fish", sortOrder: 7 },
    { name: "Hot Rolls",       slug: "hot-rolls",       description: "Fried and warm sushi rolls", sortOrder: 8 },
    { name: "Special Rolls",   slug: "special-rolls",   description: "Chef's signature creations", sortOrder: 9 },
    { name: "Combinado",       slug: "combinado",       description: "Combination platters", sortOrder: 10 },
    { name: "Hot Starters",    slug: "hot-starters",    description: "Warm appetisers to begin your meal", sortOrder: 11 },
    { name: "Cold Starters",   slug: "cold-starters",   description: "Chilled appetisers and small bites", sortOrder: 12 },
    { name: "Ramen",           slug: "ramen",           description: "Japanese noodle soups", sortOrder: 13 },
    { name: "Poke Bowl",       slug: "poke-bowl",       description: "Fresh Hawaiian-style bowls", sortOrder: 14 },
    { name: "Ginza Bento Box", slug: "bento",           description: "Complete meal sets", sortOrder: 15 },
    { name: "Extra",           slug: "extra",           description: "Add-ons and sides", sortOrder: 16 },
    { name: "Drinks",          slug: "drinks",          description: "Green tea, sake, soft drinks", sortOrder: 17 },
    { name: "Cocktails",       slug: "cocktails",       description: "Signature mixed drinks", sortOrder: 18 },
    { name: "Desserts",        slug: "desserts",        description: "Mochi, matcha cheesecake", sortOrder: 19 },
    { name: "Wine List",       slug: "wine-list",       description: "Red, white, and sake selections", sortOrder: 20 },
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
    // ---------- HOSO MAKI ----------
    {
      name: "Hosomaki Avocado - 8un.", slug: "hosomaki-avocado", categorySlug: "hoso-maki",
      description: "Avocado, seasoned rice",
      price: 6.50, images: ["/Menu/hosomaki/hosomaki-abacado.jpg"],
      allergens: ["shellfish", "sesame"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Hosomaki Ebi - 8un.", slug: "hosomaki-ebi", categorySlug: "hoso-maki",
      description: "Ebi, seasoned rice",
      price: 7.50, images: ["/Menu/hosomaki/hosomaki-ebi.jpg"],
      isContainsRawFish: true, allergens: ["fish", "egg"], spiceLevel: SpiceLevel.MEDIUM,
    },
    {
      name: "Hosomaki Mango - 8un.", slug: "hosomaki-mango", categorySlug: "hoso-maki",
      description: "Sweet mango rolled in nori and rice",
      price: 5.00, images: ["/Menu/hosomaki/hosomaki-mango.jpg"],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Hosomaki Pepino - 8un.", slug: "hosomaki-pepino", categorySlug: "hoso-maki",
      description: "Cucumber rolled in nori and rice",
      price: 5.00, images: ["/Menu/hosomaki/hosomaki-pipino.jpg"],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Hosomaki Salmon - 8un.", slug: "hosomaki-salmon", categorySlug: "hoso-maki",
      description: "Premium fresh salmon rolled in nori and rice",
      price: 5.00, images: ["/Menu/hosomaki/hosomaki-salmon.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Hosomaki Tuna - 8un.", slug: "hosomaki-tuna", categorySlug: "hoso-maki",
      description: "Premium fresh tuna rolled in nori and rice",
      price: 5.00, images: ["/Menu/hosomaki/hosomaki-tuna.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- URAMAKI ----------
    {
      name: "California de Salmão com Cobertura de Salmão / Salmon California Roll with Salmon Topping - 8un.", slug: "california-salmon-with-salmon", categorySlug: "uramaki",
      description: "Rolo de arroz com salmão, abacate, pepino e queijo Philadelphia, coberto com fatias de salmão. / Inside-out sushi roll filled with salmon, avocado, cucumber, and Philadelphia cream cheese, topped with salmon slices.",
      price: 7.50, images: ["/Menu/uramaki/uramaki_salmon_cobertura_salmon.jpeg"],
      allergens: ["shellfish", "fish", "soy"], spiceLevel: SpiceLevel.MILD,
    },
    {
      name: "California de Salmão com Cobertura de Salmão Braseado / Salmon California Roll with Seared Salmon Topping - 8un.", slug: "uramaki-salmon-braised-salmon-topping", categorySlug: "uramaki",
      description: "Rolo de arroz com salmão, abacate, pepino e queijo Philadelphia, coberto com fatias de salmão braseado. / Inside-out sushi roll filled with salmon, avocado, cucumber, and Philadelphia cream cheese, topped with seared salmon slices.",
      price: 7.80, images: ["/Menu/uramaki/uramaki_salmon_cobertura_salmon_braseado.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "California de Salmão / Salmon California Roll - 8un.", slug: "california-salmon", categorySlug: "uramaki",
      description: "Rolo de arroz com salmão, abacate, pepino e queijo Philadelphia. / Inside-out sushi roll filled with salmon, avocado, cucumber, and Philadelphia cream cheese.",
      price: 7.00, images: ["/Menu/uramaki/california_salmon.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "California de Camarão Tempura / Shrimp Tempura California Roll - 8un.", slug: "uramaki-ebitemi", categorySlug: "uramaki",
      description: "Rolo de arroz com camarão tempura crocante, abacate e queijo Philadelphia. / Inside-out sushi roll filled with crispy shrimp tempura, avocado, and Philadelphia cream cheese.",
      price: 6.50, images: ["/Menu/uramaki/uramaki_ebi.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "Uramaki de Camarão/Shrimp Uramaki - 8un.", slug: "uramaki-camarao", categorySlug: "uramaki",
      description: "Rolo de arroz com camarão cozido, abacate, pepino e queijo Philadelphia./ Inside-out sushi roll filled with cooked shrimp, avocado, cucumber, and Philadelphia cream cheese.",
      price: 6.50, images: ["/Menu/uramaki/uramaki_camarao.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "California de Salmão e Manga / Salmon & Mango California Roll - 8un.", slug: "uramaki-salmon-manga", categorySlug: "uramaki",
      description: "Rolo de arroz com salmão, manga e queijo Philadelphia. / Inside-out sushi roll filled with salmon, mango, and Philadelphia cream cheese",
      price: 7.00, images: ["/Menu/uramaki/salmon_manga_uramaki.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "California de Atum / Tuna California Roll - 8un.", slug: "uramaki-atun", categorySlug: "uramaki",
      description: "Rolo de arroz com atum, abacate e pepino / Inside-out sushi roll filled with tuna, avocado, and cucumber",
      price: 8.50, images: ["/Menu/uramaki/uramaki_atun_pipino_abacate.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "California de Delícias do Mar / Surimi California Roll - 8un.", slug: "uramaki-delicia", categorySlug: "uramaki",
      description: "Rolo de arroz com delícias do mar. / Inside-out sushi roll filled with crab sticks.",
      price: 6.50, images: ["/Menu/uramaki/uramaki_delicia_domar.jpeg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },
    {
      name: "Uramaki de Frango Crocante / Crunchy Chicken Roll - 8un.", slug: "uramaki-chicken", categorySlug: "uramaki",
      description: "Rolo de arroz com frango panado e queijo Philadelphia. / Inside-out sushi roll filled with crispy breaded chicken and Philadelphia cream cheese.",
      price: 6.00, images: ["/Menu/uramaki/crispy_chicken.png"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
    },

    // ---------- FUTO MAKI (Example) ----------
    {
      name: "Futo Maki - 5un.", slug: "futo-maki", categorySlug: "futo-maki",
      description: "Thick roll with assorted fillings",
      price: 10.00, images: ["/Menu/futo-maki/Futomaki.jpg"],
      allergens: ["fish", "soy"], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- TEMAKI (Example) ----------
    {
      name: " Temaki Salmon", slug: "salmon-temaki", categorySlug: "temaki",
      description: "Hand-rolled cone with salmon",
      price: 6.00, images: ["/Menu/temaki/Temaki-salmon.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: " Temaki Salmon philadelphia", slug: "salmon-temaki-philadelphia", categorySlug: "temaki",
      description: "Hand-rolled cone with salmon and philadelphia",
      price: 6.00, images: ["/Menu/temaki/Temaki-salmon-philadelphia.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: " Temaki Atun", slug: "temaki-atun", categorySlug: "temaki",
      description: "Hand-rolled cone with atun",
      price: 6.00, images: ["/Menu/temaki/Temaki-atum.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: " Temaki ebi", slug: "temaki-ebi", categorySlug: "temaki",
      description: "Hand-rolled cone with ebi",
      price: 6.00, images: ["/Menu/temaki/Temaki-Ebi.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: " Temaki Camarao ", slug: "camarao-temaki", categorySlug: "temaki",
      description: "Hand-rolled cone with cooked prawns",
      price: 6.00, images: ["/Menu/temaki/Temaki-camarao.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: " Temaki Vegeterian", slug: "vegeterian-temaki", categorySlug: "temaki",
      description: "Hand-rolled cone with salmon",
      price: 6.00, images: ["/Menu/temaki/Temaki-vegeterian.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },

    // ---------- NIGIRI ----------
    {
      name: "Salmon Nigiri", slug: "salmon-nigiri", categorySlug: "nigiri",
      description: "Fresh Scottish salmon over seasoned rice",
      price: 4.50, images: ["/Menu/nigiri/nigiri-salmon.png"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    {
      name: "Tuna Nigiri", slug: "tuna-nigiri", categorySlug: "nigiri",
      description: "Premium bluefin tuna over seasoned rice",
      price: 5.50, images: ["/Menu/nigiri/nigiri-tuna.png"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
    },
    /*
    {
      name: "Nigiri Branco", slug: "nigiri-branco", categorySlug: "nigiri",
      description: "Premium white fish over seasoned rice",
      price: 5.50, images: ["/Menu/nigiri/nigiri-branco.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1,
    },
     /*
    {
      name: "Octopus Nigiri", slug: "octopus-nigiri", categorySlug: "nigiri",
      description: "Premium octopus over seasoned rice",
      price: 5.50, images: ["/Menu/nigiri/nigiri-octopus.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1,
    },
    {
      name: "Enoki Nigiri", slug: "enoki-nigiri", categorySlug: "nigiri",
      description: "Premium enoki over seasoned rice",
      price: 5.50, images: ["/Menu/nigiri/nigiri-enoki.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1,
    }, */
    {
      name: "Braised Salmon Nigiri", slug: "braised salmon", categorySlug: "nigiri",
      description: "Premium braised salmon  over seasoned rice",
      price: 5.50, images: ["/Menu/nigiri/nigiri-salmon-braseado.png"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1,
    },
    {
      name: "Shrimp Nigiri", slug: "shrimp-nigiri", categorySlug: "nigiri",
      description: "Premium Shrimp over seasoned rice",
      price: 5.50, images: ["/Menu/nigiri/nigiri-shrimp.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1,
    },
    /* {
      name: "Tamago Nigiri", slug: "tamago-nigiri", categorySlug: "nigiri",
      description: "Premium tamago over seasoned rice",
      price: 5.50, images: ["/Menu/nigiri/nigiri-tamago.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1,
    },
     */
    {
      name: "Nigiri Abacate", slug: "abacate-nigiri", categorySlug: "nigiri",
      description: "Sweet tiger abacate over rice",
      price: 5.00, images: ["/Menu/nigiri/nigiri-abacado.png"],
      allergens: ["shellfish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1,
    },

    // ---------- GUNKAN ----------
    
    { name: "Ikura Gunkan", slug: "ikura-gunkan", categorySlug: "gunkan",
      description: "Ikura over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-ikura.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },
   
    { name: "Salmon Gunkan", slug: "salmon-gunkan", categorySlug: "gunkan",
      description: "Salmon over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-salmon.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },

    { name: "Tobiko Gunkan", slug: "tobiko-gunkan", categorySlug: "gunkan",
      description: "Tobiko over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-tobiko.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },

    { name: "Tuna Gunkan", slug: "tuna-gunkan", categorySlug: "gunkan",
      description: "Tuna fish over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-tuna.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },

    { name: "Urchins Gunkan", slug: "urchins-gunkan", categorySlug: "gunkan",
      description: "Urchins over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-urchins.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },

    { name: "Wakami Gunkan", slug: "wakami-gunkan", categorySlug: "gunkan",
      description: "Wakami over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-wakami.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },

          { name: "Gunkan Salmon roll", slug: "gunkan-salmon-roll", categorySlug: "gunkan",
      description: "Wakami over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-salmon-roll.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },

         { name: "Gunkan Salmon roll w/tuna topping", slug: "gunkan-tuna-topping", categorySlug: "gunkan",
      description: "Wakami over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-atum-with-salmon-roll.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },

          { name: "Gunkan Salmon with braised salmon topping", slug: "gunkan-braised-salmon", categorySlug: "gunkan",
      description: "Wakami over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-salmon-braseado.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },

          { name: "Gunkan Salmon roll w/ Tobico topping", slug: "gunkan-tobico-topping", categorySlug: "gunkan",
      description: "Wakami over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-tobiko-with-salmon-roll.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },

          { name: "Gunkan Salmon roll w/Philadelphia topping", slug: "gunkan-philadelphia-topping", categorySlug: "gunkan",
      description: "Wakami over rice, wrapped in nori",
      price: 6.50, images: ["/Menu/gunkan/gunkan-philadelphia-with-salmon-roll.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 5, serves: 1, isFeatured: true },


    // ---------- SASHIMI ----------
     /*
    {
      name: "Sashimi Branco", slug: "branco-sashimi", categorySlug: "sashimi",
      description: "Slices of premium fresh white fish",
      price: 9.00, images: ["/Menu/sashimi/sashimi-branco.jpg"],
      isContainsRawFish: true, isGlutenFree: true, allergens: ["fish"],
      spiceLevel: SpiceLevel.NONE, prepTime: 6, serves: 1,
    },
    {
      name: "Sashimi Octopus", slug: "octopus-sashimi", categorySlug: "sashimi",
      description: "Slices of premium octopus",
      price: 9.00, images: ["/Menu/sashimi/sashimi-octopus.jpg"],
      isContainsRawFish: true, isGlutenFree: true, allergens: ["fish"],
      spiceLevel: SpiceLevel.NONE, prepTime: 6, serves: 1,
    }, */
    {
      name: "Sashimi Salmon", slug: "salmon-sashimi", categorySlug: "sashimi",
      description: "Slices of premium fresh Salmon",
      price: 9.00, images: ["/Menu/sashimi/sashimi-salmon.jpg"],
      isContainsRawFish: true, isGlutenFree: true, allergens: ["fish"],
      spiceLevel: SpiceLevel.NONE, prepTime: 6, serves: 1,
    },
    {
      name: "Sashimi Tuna", slug: "tuna-sashimi", categorySlug: "sashimi",
      description: "Slices of premium fresh tuna fish",
      price: 9.00, images: ["/Menu/sashimi/sashimi-tuna.jpg"],
      isContainsRawFish: true, isGlutenFree: true, allergens: ["fish"],
      spiceLevel: SpiceLevel.NONE, prepTime: 6, serves: 1,
    },

   
    // ---------- HOT ROLLS ----------
    {
      name: "Hot California Roll", slug: "hot-roll", categorySlug: "hot-rolls",
      description: "Fried sushi roll",
      price: 7.50, images: ["/Menu/hot-rolls/example.jpg"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
      prepTime: 10, serves: 1,
    },
     {
      name: "Hot hosomaki Roll", slug: "hot-roll", categorySlug: "hot-rolls",
      description: "Fried sushi roll",
      price: 7.50, images: ["/Menu/hot-rolls/example.jpg"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
      prepTime: 10, serves: 1,
    },

    // ---------- SPECIAL ROLLS ----------
   /*  {
      name: "Luxury Uramaki", slug: "luxury-uramaki", categorySlug: "special-rolls",
      description: "Prawn tempura, avocado, eel sauce, tobiko",
      price: 12.50, images: ["/Menu/special roll/luxury-uramaki-roll.jpg"],
      allergens: ["shellfish", "fish", "soy"], spiceLevel: SpiceLevel.MILD,
      prepTime: 12, serves: 2, isFeatured: true,
    },
    {
      name: "Maki Dragon", slug: "maki-dragon", categorySlug: "special-rolls",
      description: "California roll topped with assorted sashimi",
      price: 14.00, images: ["/Menu/special roll/maki-dragon.jpg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
      spiceLevel: SpiceLevel.NONE, prepTime: 14, serves: 2,
    },
    {
      name: "Mozaiku Maki", slug: "maki-mozaiku", categorySlug: "special-rolls",
      description: "California roll topped with assorted sashimi",
      price: 14.00, images: ["/Menu/special roll/mozaiku-maki.jpg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
      spiceLevel: SpiceLevel.NONE, prepTime: 14, serves: 2,
    },
    {
      name: "Maki Rainbow", slug: "maki-rainbow", categorySlug: "special-rolls",
      description: "California roll topped with assorted sashimi",
      price: 14.00, images: ["/Menu/special roll/rainbow-maki.jpg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish", "sesame"],
      spiceLevel: SpiceLevel.NONE, prepTime: 14, serves: 2,
    },
 */
    // ---------- COMBINADO (Example) ----------
    {
      name: "Gintokyo ", slug: "gintokyo", categorySlug: "combinado",
      description: "16 pic (4 california, 4 hosomaki, 2 nigiri salmon, 2 gunkan salmon roll, 4 sashimi salmon",
      price: 25.00, images: ["/Menu/combinado/example.jpg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 20, serves: 2,
    },
    {
      name: "Ginza combo", slug: "ginza-combo", categorySlug: "combinado",
      description: "20 pic (8 california, 4 hosomaki salmao, 2 nigiri salmon, 2 nigiri atun, 2 gunkan salmon roll, 2 sashimi salmon",
      price: 25.00, images: ["/Menu/combinado/example.jpg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 20, serves: 2,
    },
    {
      name: "Ying & Yang Duet", slug: "ying-yang", categorySlug: "combinado",
      description: "32 pic (4 california, 4 hosomaki, 2 nigiri salmon, 2 gunkan salmon roll, 4 sashimi salmon",
      price: 25.00, images: ["/Menu/combinado/example.jpg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 20, serves: 2,
    },
    {
      name: "Alma de Ginza", slug: "alma de ginza", categorySlug: "combinado",
      description: "40 pic (4 california salmon,4 uramaki salmon manga,4 ebi maki, 4 hosomaki salmon , 4 hosomaki atun, 2 nigiri salmon, 2 nigiri atun, 2 gunkan salmon roll,2 gunkan salmon,4 sashimi salmon, 4 sashimi atun, 4 sashimi with fish",
      price: 25.00, images: ["/Menu/combinado/example.jpg"],
      isContainsRawFish: true, allergens: ["fish", "shellfish"], spiceLevel: SpiceLevel.NONE,
      prepTime: 20, serves: 2,
    },

    // ---------- HOT STARTERS ----------
    { name: "Agedashi Tofu", slug: "agedashi-tofu", categorySlug: "hot-starters",

      description: "Tofu tempura with special sauce",
      price: 7.00, images: ["/Menu/hot-starters/agedashi.jpg"],
      allergens: ["gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
       isFeatured: true },
    { name: "Gyoza Chicken/Veggie", slug: "gyoza", categorySlug: "hot-starters",
      description: "Pan-fried dumplings with ponzu dip",
      price: 6.50, images: ["/Menu/hot-starters/gyoza.jpg"],
      allergens: ["gluten", "soy", "sesame"], spiceLevel: SpiceLevel.NONE,
      },
    { name: "Ebi Tempura", slug: "ebi-tempura", categorySlug: "hot-starters",
      description: "Lightly battered ebi with tentsuyu",
      price: 6.00, images: ["/Menu/hot-starters/ebi-tempura.jpg"],
      allergens: ["gluten", "soy"], spiceLevel: SpiceLevel.NONE,
      },
    { name: "Edamame", slug: "edamame", categorySlug: "hot-starters",
      description: "Boiled salted edamame",
      price: 7.50, images: ["/Menu/hot-starters/edamame.jpg"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
       },
    { name: "Miso Sopa", slug: "miso-sopa", categorySlug: "hot-starters",
      description: "Miso soup",
      price: 7.50, images: ["/Menu/hot-starters/miso-sopa.jpg"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
       },
       { name: "Crepe ", slug: "crepe", categorySlug: "hot-starters",
      description: "crepe vegeterian",
      price: 7.50, images: ["/Menu/hot-starters/crepe.jpg"],
      allergens: ["shellfish", "gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
       },

    // ---------- COLD STARTERS ----------
    { name: "Wakame Salad", slug: "seaweed-salad", categorySlug: "cold-starters",
      description: "Marinated wakame with sesame and ginger",
      price: 5.00, images: ["/Menu/cold-starters/wakame.jpg"],
      isVegetarian: true, isVegan: true, allergens: ["sesame", "soy"],
      },
   /*  { name: "Carpaccio Salmon", slug: "carpaccio-salmon", categorySlug: "cold-starters",
      description: "Salmon carpaccio",
      price: 5.00, images: ["/Menu/cold-starters/carpaccio-salmon.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE, 
      prepTime: 5, serves: 1 }, */
    { name: "Ceviche Salmon", slug: "salmon-ceviche", categorySlug: "cold-starters",
      description: "Marinated salmon",
      price: 5.00, images: ["/Menu/cold-starters/ceviche.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE, 
      },
    
    /* { name: "Oysters", slug: "oysters", categorySlug: "cold-starters",
      description: "Fresh oysters",
      price: 5.00, images: ["/Menu/cold-starters/oysters.jpg"],
      allergens: ["shellfish"], spiceLevel: SpiceLevel.NONE, 
      prepTime: 5, serves: 1 }, 
    { name: "Salmon Crispy Ball", slug: "salmon-crispy-ball", categorySlug: "cold-starters",
      description: "Crispy ball with salmon",
      price: 5.00, images: ["/Menu/cold-starters/salmon-puri.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE, 
      prepTime: 5, serves: 1 },
      */
    { name: "Sunomono Salad", slug: "sunomono-salad", categorySlug: "cold-starters",
      description: "Marinated cucumber with sesame and ginger",
      price: 5.00, images: ["/Menu/cold-starters/sunomono.jpg"],
      isVegetarian: true, isVegan: true, allergens: ["sesame", "soy"],
      },
   /*  { name: "Tartare Tuna", slug: "tuna-tartare", categorySlug: "cold-starters",
      description: "Marinated with tuna",
      price: 5.00, images: ["/Menu/cold-starters/tartare-de-atun.jpg"],
      isContainsRawFish: true, allergens: ["fish"], spiceLevel: SpiceLevel.NONE, 
      prepTime: 5, serves: 1 }, */

    // ---------- RAMEN ----------
   
   /*  {
      name: "Miso Ramen", slug: "miso-ramen", categorySlug: "ramen",
      description: "Soybean paste broth, corn, butter, scallions",
      price: 12.00, images: ["/Menu/ramen/example.jpg"],
      isVegetarian: true, allergens: ["gluten", "soy", "sesame"],
      spiceLevel: SpiceLevel.MILD, prepTime: 15, serves: 1,
    },
    {
      name: "Spicy Miso Chicken Ramen", slug: "spicy-miso-ramen", categorySlug: "ramen",
      description: "Miso broth with chilli oil and minced chicken",
      price: 13.00, images: ["https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800"],
      allergens: ["gluten", "soy", "sesame"], spiceLevel: SpiceLevel.HOT,
      prepTime: 15, serves: 1,
    },
 */
    // ---------- POKE BOWL (Example) ----------
   /*  {
      name: "Salmon Poke Bowl", slug: "salmon-poke-bowl", categorySlug: "poke-bowl",
      description: "Fresh salmon, avocado, edamame, and rice",
      price: 14.00, images: ["/Menu/poke-bowl/example.jpg"],
      isContainsRawFish: true, allergens: ["fish", "soy", "sesame"], spiceLevel: SpiceLevel.NONE,
      prepTime: 10, serves: 1,
    },
    {
      name: "veg Poke Bowl", slug: "veg-poke-bowl", categorySlug: "poke-bowl",
      description: "Grilled tofu, avocado, edamame, and rice",
      price: 14.00, images: ["/Menu/poke-bowl/example.jpg"],
      isContainsRawFish: true, allergens: ["fish", "soy", "sesame"], spiceLevel: SpiceLevel.NONE,
      prepTime: 10, serves: 1,
    }, */

    // ---------- BENTO ----------
   /*  {
      name: "Salmon Bento", slug: "salmon-bento", categorySlug: "bento",
      description: "Grilled salmon, rice, miso soup, pickles, edamame",
      price: 16.00, images: ["/Menu/ginza-bento-box/example.jpg"],
      allergens: ["fish", "soy", "sesame"], spiceLevel: SpiceLevel.NONE,
      prepTime: 18, serves: 1, isFeatured: true,
    },
    {
      name: "Chicken Katsu Bento", slug: "chicken-katsu-bento", categorySlug: "bento",
      description: "Panko chicken, rice, miso soup, salad, gyoza",
      price: 15.00, images: ["/Menu/ginza-bento-box/example.jpg"],
      allergens: ["gluten", "egg", "soy"], spiceLevel: SpiceLevel.NONE,
      prepTime: 18, serves: 1,
    },
 */
    // ---------- EXTRA (Example) ----------
    {
      name: "Extra Ginger", slug: "extra-ginger", categorySlug: "extra",
      description: "Side of pickled ginger",
      price: 1.00, images: ["/Menu/extras/example.jpg"],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE, serves: 1,
    },

    // ---------- DRINKS ----------
   /*  {
      name: "Green Tea", slug: "green-tea", categorySlug: "drinks",
      description: "Hot Japanese sencha",
      price: 2.50, images: ["https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=800"],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE, serves: 1,
    },
    {
      name: "Ramune Soda", slug: "ramune-soda", categorySlug: "drinks",
      description: "Japanese marble soda — original flavour",
      price: 3.00, images: ["https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=800"],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE, serves: 1,
    },
    {
      name: "Asahi Beer", slug: "asahi-beer", categorySlug: "drinks",
      description: "330ml Japanese lager",
      price: 4.50, images: ["https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800"],
      allergens: ["gluten"], spiceLevel: SpiceLevel.NONE, serves: 1,
    },
 */
    // ---------- COCKTAILS (Example) ----------
    {
      name: "Ginza Martini", slug: "ginza-martini", categorySlug: "cocktails",
      description: "Signature sake-based martini",
      price: 12.00, images: ["/Menu/cocktails/example.jpg"],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE, serves: 1,
    },

    // ---------- DESSERTS ----------
    {
      name: "Coffee Mochi (3pc)", slug: "matcha-mochi", categorySlug: "desserts",
      description: "Soft rice cakes filled with coffee ice cream",
      price: 5.50, images: ["/Menu/desserts/example1.jpg"],
      isVegetarian: true, allergens: ["milk"], spiceLevel: SpiceLevel.NONE,
      serves: 1, isFeatured: true,
    },
    {
      name: "Coconut & ananas mochi", slug: "matcha-cheesecake", categorySlug: "desserts",
      description: "Creamy baked cheesecake with matcha",
      price: 6.00, images: ["/Menu/desserts/example1.jpg"],
      isVegetarian: true, allergens: ["milk", "gluten", "egg"],
      spiceLevel: SpiceLevel.NONE, serves: 1,
    },

    // ---------- WINE LIST (Example) ----------
    {
      name: "House Red Wine", slug: "house-red-wine", categorySlug: "wine-list",
      description: "Glass of our signature red wine",
      price: 8.00, images: ["/Menu/wine/example.jpg"],
      isVegetarian: true, isVegan: true, isGlutenFree: true,
      allergens: [], spiceLevel: SpiceLevel.NONE, serves: 1,
    },
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
        prepTime: item.prepTime,
        serves: item.serves,
        isFeatured: item.isFeatured ?? false,
        stock: 100,
      },
    });

    // Add sample options for a couple of items
    if (item.slug === "tonkotsu-ramen") {
      await prisma.menuItemOption.createMany({
        data: [
          { menuItemId: created.id, name: "Extra Chashu",  group: "Extras", priceAdjustment: 2.50, sortOrder: 1 },
          { menuItemId: created.id, name: "Extra Egg",     group: "Extras", priceAdjustment: 1.00, sortOrder: 2 },
          { menuItemId: created.id, name: "Extra Noodles", group: "Extras", priceAdjustment: 1.50, sortOrder: 3 },
        ],
      });
    }

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