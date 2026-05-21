export const CATEGORIES = [
  { slug: "mobiles", name: "Mobiles", icon: "Smartphone" },
  { slug: "used-mobiles", name: "Used Mobiles", icon: "Smartphone" },
  { slug: "laptops", name: "Laptops", icon: "Laptop" },
  { slug: "tablets", name: "Tablets", icon: "Tablet" },
  { slug: "adapter", name: "Adapter", icon: "Plug" },
  { slug: "charger", name: "Charger", icon: "BatteryCharging" },
  { slug: "headphones", name: "Headphones", icon: "Headset" },
  { slug: "buds", name: "Buds", icon: "Ear" },
  { slug: "airpods", name: "AirPods", icon: "Airplay" },
  { slug: "data-cable", name: "Data Cable", icon: "Cable" },
  { slug: "covers", name: "Covers", icon: "ShieldCheck" },
  { slug: "glass", name: "Glass", icon: "Square" },
  { slug: "3d-sheets", name: "3D Sheets", icon: "Layers" },
  { slug: "speakers", name: "Speakers", icon: "Speaker" },
  { slug: "mic", name: "Mic", icon: "Mic" },
  { slug: "lights", name: "Lights", icon: "Lightbulb" },
  { slug: "holders", name: "Holders", icon: "MonitorSmartphone" },
  { slug: "stands", name: "Stands", icon: "TabletSmartphone" },
  { slug: "watches", name: "Watches", icon: "Watch" },
  { slug: "power-banks", name: "Power Banks", icon: "BatteryFull" },
  { slug: "games", name: "Games", icon: "Gamepad2" },
  { slug: "hand-free", name: "Hand Free", icon: "Headphones" },
] as const;

export const BRANDS = [
  { name: "Apple", logo: "https://cdn.simpleicons.org/apple/000000" },
  { name: "Samsung", logo: "https://cdn.simpleicons.org/samsung/1428A0" },
  { name: "Vivo", logo: "https://cdn.simpleicons.org/vivo/415FFF" },
  { name: "Oppo", logo: "https://cdn.simpleicons.org/oppo/008740" },
  { name: "Xiaomi", logo: "https://cdn.simpleicons.org/xiaomi/FF6900" },
  { name: "Tecno", logo: "" },
  { name: "Infinix", logo: "" },
  { name: "Realme", logo: "" },
];

export type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string; // category slug
  price: number;
  oldPrice?: number;
  ram?: string;
  storage?: string;
  badge?: string;
  features?: string[];
  description?: string;
};

export const PRODUCTS: Product[] = [
  // Mobiles
  { id: 1, slug: "iphone-15-pro-max", name: "iPhone 15 Pro Max", brand: "Apple", category: "new-mobile", price: 519999, oldPrice: 559999, ram: "8GB", storage: "256GB", badge: "Hot",
    features: ["A17 Pro Chip", "48MP Pro Camera", "Titanium Body", "USB-C", "120Hz ProMotion"],
    description: "The most powerful iPhone yet — featuring titanium design, A17 Pro performance and a pro-grade camera system." },
  { id: 2, slug: "samsung-galaxy-s24-ultra", name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "new-mobile", price: 379999, oldPrice: 429999, ram: "12GB", storage: "256GB", badge: "-12%",
    features: ["Snapdragon 8 Gen 3", "200MP Camera", "S Pen Included", "5000mAh Battery", "AMOLED 2X 120Hz"],
    description: "The ultimate Galaxy experience with built-in AI, S Pen and a stunning 200MP camera system." },
  { id: 3, slug: "xiaomi-14-pro", name: "Xiaomi 14 Pro", brand: "Xiaomi", category: "new-mobile", price: 259999, oldPrice: 289999, ram: "12GB", storage: "256GB", badge: "New",
    features: ["Snapdragon 8 Gen 3", "Leica Camera", "120W Fast Charging", "LTPO 120Hz"],
    description: "Flagship performance and pro Leica imaging, packed in a premium glass build." },
  { id: 4, slug: "vivo-v30-pro", name: "Vivo V30 Pro", brand: "Vivo", category: "new-mobile", price: 154999, oldPrice: 169999, ram: "12GB", storage: "512GB",
    features: ["Zeiss Optics", "50MP Triple Camera", "80W FlashCharge", "Curved AMOLED"],
    description: "Studio-quality portraits with Zeiss tuning and luxurious curved design." },
  { id: 5, slug: "oppo-reno-11-pro", name: "Oppo Reno 11 Pro", brand: "Oppo", category: "new-mobile", price: 134999, oldPrice: 149999, ram: "12GB", storage: "256GB",
    features: ["Portrait Expert", "67W SuperVOOC", "120Hz AMOLED", "Slim Design"],
    description: "Pro portraits and elegant style — Reno is built to capture every moment beautifully." },
  { id: 6, slug: "realme-gt-6", name: "Realme GT 6", brand: "Realme", category: "new-mobile", price: 189999, oldPrice: 219999, ram: "12GB", storage: "256GB", badge: "-13%",
    features: ["Snapdragon 8s Gen 3", "120W Charging", "6000 nits Display", "AI Camera"],
    description: "Flagship-grade speed for power users, with the brightest display in its class." },

  // Tablets
  { id: 20, slug: "ipad-air-m2", name: "iPad Air M2 11-inch", brand: "Apple", category: "tablet", price: 219999, oldPrice: 239999, storage: "128GB", badge: "New",
    features: ["Apple M2 Chip", "Liquid Retina", "Apple Pencil Pro", "All-Day Battery"],
    description: "Seriously powerful, seriously portable — iPad Air with M2." },
  { id: 21, slug: "samsung-tab-s9", name: "Samsung Galaxy Tab S9", brand: "Samsung", category: "tablet", price: 189999, oldPrice: 209999, storage: "256GB",
    features: ["AMOLED Display", "S Pen Included", "Dolby Atmos", "Snapdragon 8 Gen 2"],
    description: "Flagship Galaxy Tab with stunning AMOLED and S Pen." },

  // Watches
  { id: 30, slug: "apple-watch-series-9", name: "Apple Watch Series 9", brand: "Apple", category: "watch", price: 119999, oldPrice: 134999, badge: "Hot",
    features: ["S9 Chip", "Always-On Retina", "Health Sensors", "GPS + Cellular"],
    description: "The smarter, brighter, more powerful Apple Watch." },
  { id: 31, slug: "smart-watch-ultra", name: "Smart Watch Ultra Pro", brand: "City", category: "watch", price: 8999, oldPrice: 12999,
    features: ["AMOLED 2.1\"", "BT Calling", "Sports Modes", "7-day Battery"],
    description: "Premium look smartwatch with calling and 100+ sports modes." },

  // AirPods
  { id: 40, slug: "airpods-pro-2", name: "AirPods Pro 2 (USB-C)", brand: "Apple", category: "airpods", price: 64999, oldPrice: 74999, badge: "Best",
    features: ["Active Noise Cancellation", "Adaptive Audio", "MagSafe Case", "H2 Chip"],
    description: "Next-level Active Noise Cancellation and Adaptive Audio." },
  { id: 41, slug: "airpods-3", name: "AirPods 3rd Gen", brand: "Apple", category: "airpods", price: 39999, oldPrice: 44999,
    features: ["Spatial Audio", "Sweat & Water Resistant", "MagSafe Charging Case"],
    description: "Personalized Spatial Audio with all-day comfort." },

  // Buds
  { id: 50, slug: "galaxy-buds-pro-2", name: "Galaxy Buds Pro 2", brand: "Samsung", category: "buds", price: 29999, oldPrice: 34999,
    features: ["24-bit Hi-Fi", "Intelligent ANC", "360 Audio"],
    description: "Hi-Fi sound, smart noise cancellation and seamless Galaxy connectivity." },
  { id: 51, slug: "redmi-buds-5-pro", name: "Redmi Buds 5 Pro", brand: "Xiaomi", category: "buds", price: 9999, oldPrice: 12999, badge: "Hot",
    features: ["52dB ANC", "Dual Drivers", "10hr Playback"],
    description: "Audiophile-grade audio at an unbeatable price." },

  // Headphones
  { id: 60, slug: "sony-wh-1000xm5", name: "Sony WH-1000XM5", brand: "Sony", category: "headphones", price: 99999, oldPrice: 114999, badge: "Premium",
    features: ["Industry-leading ANC", "30hr Battery", "LDAC Hi-Res"],
    description: "Best-in-class noise cancellation and pristine sound." },
  { id: 61, slug: "jbl-tune-770nc", name: "JBL Tune 770NC", brand: "JBL", category: "headphones", price: 29999, oldPrice: 34999,
    features: ["Pure Bass", "Adaptive Noise Cancelling", "70hr Battery"],
    description: "Massive battery life with rich JBL signature sound." },

  // Hand Free
  { id: 70, slug: "samsung-handsfree-akg", name: "Samsung AKG Handsfree", brand: "Samsung", category: "hand-free", price: 1999, oldPrice: 2999,
    features: ["Tuned by AKG", "In-line Mic", "Type-C Connector"],
    description: "Crisp Hi-Fi audio tuned by AKG engineers." },
  { id: 71, slug: "iphone-lightning-handsfree", name: "Original iPhone Handsfree", brand: "Apple", category: "hand-free", price: 2999, oldPrice: 3999,
    features: ["Lightning Connector", "Premium Audio", "Inline Controls"],
    description: "Original Apple EarPods with Lightning connector." },

  // Power Bank
  { id: 80, slug: "anker-powercore-20k", name: "Anker PowerCore 20K", brand: "Anker", category: "power-bank", price: 8999, oldPrice: 10999, badge: "Best",
    features: ["20,000 mAh", "PD 22.5W", "Dual USB-C"],
    description: "Trusted power for two days of heavy use." },
  { id: 81, slug: "xiaomi-redmi-powerbank-10k", name: "Xiaomi Redmi 10000 mAh", brand: "Xiaomi", category: "power-bank", price: 3499, oldPrice: 4499,
    features: ["10,000 mAh", "Dual Output", "PD Fast Charge"],
    description: "Compact daily-use power bank with reliable performance." },

  // Data Cable
  { id: 90, slug: "type-c-pd-cable", name: "Type-C PD 60W Cable", brand: "City", category: "data-cable", price: 999, oldPrice: 1499,
    features: ["60W Fast Charge", "Braided Nylon", "1.5m"],
    description: "Tough braided cable for fast charging and quick data." },
  { id: 91, slug: "lightning-cable-original", name: "Apple Lightning Cable", brand: "Apple", category: "data-cable", price: 2499, oldPrice: 2999,
    features: ["MFi Certified", "1m", "Original Apple"],
    description: "Original Apple Lightning to USB-C cable." },

  // Adapter
  { id: 100, slug: "samsung-25w-adapter", name: "Samsung 25W Fast Charger", brand: "Samsung", category: "adapter", price: 2499, oldPrice: 3000,
    features: ["25W PD", "Type-C Output", "Original"],
    description: "Original Samsung 25W PD Power Adapter." },
  { id: 101, slug: "apple-20w-adapter", name: "Apple 20W USB-C Adapter", brand: "Apple", category: "adapter", price: 4999, oldPrice: 5999, badge: "Best",
    features: ["20W Fast Charge", "USB-C", "Original Apple"],
    description: "Genuine Apple 20W USB-C Power Adapter." },

  // Games
  { id: 110, slug: "ps5-controller", name: "Sony DualSense PS5 Controller", brand: "Sony", category: "games", price: 24999, oldPrice: 29999,
    features: ["Haptic Feedback", "Adaptive Triggers", "Wireless"],
    description: "Next-gen controller with immersive haptics." },
  { id: 111, slug: "xbox-controller", name: "Xbox Wireless Controller", brand: "Microsoft", category: "games", price: 19999, oldPrice: 22999,
    features: ["Bluetooth", "Textured Grip", "Cross-platform"],
    description: "Sleek, modern design with textured grip and improved D-pad." },

  // Covers
  { id: 120, slug: "iphone-silicone-cover", name: "iPhone 15 Silicone Cover", brand: "Apple", category: "covers", price: 1499, oldPrice: 2000,
    features: ["MagSafe Compatible", "Silky-soft Touch", "Microfiber Lining"],
    description: "Premium silicone with MagSafe compatibility." },
  { id: 121, slug: "samsung-leather-cover", name: "Samsung Galaxy Leather Cover", brand: "Samsung", category: "covers", price: 2499, oldPrice: 3499,
    features: ["Genuine Leather", "Slim Profile", "Premium Stitching"],
    description: "Genuine leather case with elegant stitching." },

  // Glass
  { id: 130, slug: "tempered-glass-9d", name: "9D Full Cover Tempered Glass", brand: "City", category: "glass", price: 599, oldPrice: 999,
    features: ["9H Hardness", "Full Cover", "Anti-fingerprint"],
    description: "Premium 9D tempered glass with edge-to-edge protection." },
  { id: 131, slug: "privacy-glass", name: "Privacy Tempered Glass", brand: "City", category: "glass", price: 999, oldPrice: 1499,
    features: ["Anti-spy", "9H Hardness", "Easy Install"],
    description: "Privacy glass that blocks side viewing angles." },

  // 3D Sheets
  { id: 140, slug: "matte-back-sheet", name: "Matte 3D Back Sheet", brand: "City", category: "3d-sheets", price: 499, oldPrice: 799,
    features: ["Anti-scratch", "Matte Finish", "Easy to Install"],
    description: "Premium matte back sheet for a fresh look." },
  { id: 141, slug: "carbon-fiber-sheet", name: "Carbon Fiber 3D Sheet", brand: "City", category: "3d-sheets", price: 599, oldPrice: 899,
    features: ["Carbon Texture", "Anti-fingerprint", "Universal Sizes"],
    description: "Sporty carbon fiber finish for any device." },

  // Speakers
  { id: 150, slug: "jbl-flip-6", name: "JBL Flip 6 Speaker", brand: "JBL", category: "speakers", price: 24999, oldPrice: 29999, badge: "Hot",
    features: ["IP67 Waterproof", "12hr Playback", "PartyBoost"],
    description: "Bold JBL Pro Sound that goes anywhere with you." },
  { id: 151, slug: "anker-soundcore-2", name: "Anker Soundcore 2", brand: "Anker", category: "speakers", price: 9999, oldPrice: 12999,
    features: ["12W Stereo", "24hr Battery", "BassUp Tech"],
    description: "Pure sound, massive battery, tough design." },

  // Mic
  { id: 160, slug: "boya-by-m1", name: "BOYA BY-M1 Lavalier Mic", brand: "BOYA", category: "mic", price: 2999, oldPrice: 3999,
    features: ["Omni-directional", "6m Cable", "Universal"],
    description: "Pro-grade lavalier mic for content creators." },
  { id: 161, slug: "rode-wireless-go", name: "RODE Wireless GO II", brand: "Rode", category: "mic", price: 49999, oldPrice: 59999,
    features: ["Wireless TX/RX", "200m Range", "Dual Channel"],
    description: "Compact, wireless and broadcast-grade audio." },

  // Lights
  { id: 170, slug: "ring-light-10", name: "10\" LED Ring Light", brand: "City", category: "lights", price: 3999, oldPrice: 5499,
    features: ["3 Color Modes", "Adjustable Stand", "Phone Holder"],
    description: "Studio lighting in a portable kit." },
  { id: 171, slug: "rgb-strip-5m", name: "RGB Smart LED Strip 5m", brand: "City", category: "lights", price: 1999, oldPrice: 2999,
    features: ["App Control", "Music Sync", "16M Colors"],
    description: "Smart RGB lighting for mood setups." },

  // Holders
  { id: 180, slug: "magnetic-car-holder", name: "Magnetic Car Phone Holder", brand: "City", category: "holders", price: 1499, oldPrice: 1999,
    features: ["Strong Magnet", "360° Rotation", "Universal"],
    description: "Strong magnetic mount that fits any phone." },
  { id: 181, slug: "desk-tripod-holder", name: "Aluminum Desk Tripod", brand: "City", category: "holders", price: 1999, oldPrice: 2499,
    features: ["Aluminum Build", "Adjustable", "Portable"],
    description: "Pro aluminum tripod for video calls and content." },

  // Used Mobile
  { id: 190, slug: "iphone-13-used", name: "iPhone 13 (Used - Like New)", brand: "Apple", category: "used-mobile", price: 154999, oldPrice: 184999, ram: "4GB", storage: "128GB",
    features: ["100% Battery Health", "Dual Camera", "PTA Approved"],
    description: "Carefully inspected iPhone 13 with battery health 95%+." },
  { id: 191, slug: "samsung-s22-used", name: "Samsung S22 Ultra (Used)", brand: "Samsung", category: "used-mobile", price: 159999, oldPrice: 179999, ram: "12GB", storage: "256GB",
    features: ["S Pen", "108MP Camera", "PTA Approved"],
    description: "Pre-loved Galaxy S22 Ultra in excellent condition." },

  // iPod
  { id: 200, slug: "ipod-touch-7", name: "iPod Touch 7th Gen", brand: "Apple", category: "ipod", price: 49999, oldPrice: 59999,
    features: ["A10 Fusion", "256GB Storage", "FaceTime"],
    description: "Classic iPod Touch — perfect for music and games." },
  { id: 201, slug: "mp3-player-pro", name: "Hi-Fi MP3 Player Pro", brand: "City", category: "ipod", price: 6999, oldPrice: 8999,
    features: ["Hi-Res Audio", "32GB", "FM Radio"],
    description: "Compact Hi-Fi audio player for music lovers." },
];

// keep backwards compat
export const ACCESSORIES = PRODUCTS.filter((p) => p.category !== "new-mobile" && p.category !== "used-mobile" && p.category !== "tablet");

export const HERO_SLIDES = [
  {
    eyebrow: "Latest Smartphones",
    title: "Flagship Phones",
    highlight: "Premium Style",
    desc: "Discover the latest iPhone, Galaxy & Xiaomi flagships — original PTA approved with official warranty.",
    cta: { label: "Shop Mobiles", to: "/mobiles" },
    image: "hero1",
    accent: "from-[oklch(0.42_0.21_264)] to-[oklch(0.62_0.2_220)]",
    badge: "NEW ARRIVAL",
  },
  {
    eyebrow: "Premium Accessories",
    title: "Sound. Style.",
    highlight: "Power.",
    desc: "AirPods, Galaxy Buds, JBL speakers and premium chargers — all genuine, all in stock.",
    cta: { label: "Explore Accessories", to: "/accessories" },
    image: "hero2",
    accent: "from-[oklch(0.62_0.2_220)] to-[oklch(0.82_0.17_200)]",
    badge: "BEST SELLERS",
  },
  {
    eyebrow: "Hot Deals",
    title: "Up to 30% OFF",
    highlight: "Limited Time",
    desc: "Huge discounts on flagship phones and premium accessories. Hurry — while stock lasts.",
    cta: { label: "View Offers", to: "/offers" },
    image: "hero3",
    accent: "from-[oklch(0.55_0.25_30)] to-[oklch(0.7_0.2_60)]",
    badge: "MEGA SALE",
  },
];

export const SERVICES = [
  { slug: "mobile-repairing", title: "Mobile Repairing", desc: "Professional repair services for all brands", icon: "Wrench",
    long: "Certified technicians repair display, battery, charging port, speakers, motherboard and more for all major brands. Genuine parts and 30-day service warranty." },
  { slug: "software-solutions", title: "Software Solutions", desc: "Flashing, OS install & software fixes", icon: "Cpu",
    long: "Flashing, software unlock, OS install/upgrade, FRP bypass, virus removal — fast turnaround with full data care." },
  { slug: "pta-approval", title: "PTA Approval", desc: "Fast & reliable PTA registration", icon: "BadgeCheck",
    long: "Hassle-free PTA mobile registration and tax payment service for all imported devices. Same-day processing available." },
  { slug: "easypaisa-jazzcash", title: "EasyPaisa / JazzCash", desc: "Quick & easy mobile transactions", icon: "Wallet",
    long: "Cash-in, cash-out, bill payment and money transfer through EasyPaisa and JazzCash — anytime during shop hours." },
  { slug: "screen-replacement", title: "Screen Replacement", desc: "All types of screens replaced", icon: "Monitor",
    long: "Original and OEM display replacement for iPhone, Samsung, Vivo, Oppo, Xiaomi and more. Most repairs done in 30 minutes." },
  { slug: "data-transfer", title: "Data Transfer", desc: "Safe data transfer between devices", icon: "ArrowLeftRight",
    long: "Securely move contacts, photos, videos, chats and apps between Android and iOS — privacy-first, zero data loss." },
  { slug: "accessories-setup", title: "Accessories Setup", desc: "Tempered glass, sheets & cover fitting", icon: "ShieldCheck",
    long: "Bubble-free tempered glass installation, premium 3D sheet wrap and cover fitting by our trained team." },
  { slug: "mobile-cleaning", title: "Mobile Cleaning", desc: "Deep cleaning & sanitization", icon: "Sparkles",
    long: "Professional deep cleaning service — speaker dust removal, port cleaning and full sanitization of your device." },
];

export const REVIEWS = [
  { name: "Ahmad Raza", role: "Verified Buyer", rating: 5, text: "Bohat zabardast experience raha. Original products aur staff bhi bohat cooperative hai." },
  { name: "Sana Malik", role: "Verified Buyer", rating: 5, text: "Got my iPhone at the best price in Multan. Genuine PTA approved and quick delivery." },
  { name: "Bilal Khan", role: "Verified Buyer", rating: 5, text: "Repairing service is top class. Screen replaced within 30 minutes with original glass." },
  { name: "Hira Ahmed", role: "Verified Buyer", rating: 5, text: "Trustworthy mobile shop with premium accessories. Highly recommended!" },
];

export const FAQS = [
  { q: "Are PTA approved mobiles available?", a: "Yes, all our flagship and mid-range smartphones are 100% PTA approved with valid documentation." },
  { q: "Do you provide original accessories?", a: "Absolutely. We stock genuine accessories from Apple, Samsung, Anker, JBL and more — no replicas." },
  { q: "Is delivery service available?", a: "Yes, we offer free same-day delivery in Multan & DG Khan and nationwide courier within 48 hours." },
  { q: "Do you offer mobile repairing?", a: "Yes — screen replacement, software issues, battery, charging port and more, handled by certified technicians." },
  { q: "Can I purchase on installments?", a: "Yes, we offer easy monthly installment plans through our partner banks and EasyPaisa." },
  { q: "What about warranty?", a: "Every brand-new mobile comes with official manufacturer warranty plus our additional 7-day return policy." },
];

export const TRUST = [
  { value: "10K+", label: "Happy Customers" },
  { value: "100%", label: "Original Products" },
  { value: "4.8★", label: "Average Rating" },
  { value: "7 Days", label: "Return Policy" },
];

export const WHATSAPP = "923456789432";
export const PHONES = ["0345-6789432", "0321-6789432"];
export const EMAIL = "info@citymobile.com.pk";
export const SOCIALS = {
  instagram: "https://www.instagram.com/citymobiledha",
  facebook: "https://www.facebook.com/share/18PxtGDBFo/",
  tiktok: "https://www.tiktok.com/@citymobiledha",
};

export function findProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(slug: string) {
  return PRODUCTS.filter((p) => p.category === slug);
}

export function findCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
