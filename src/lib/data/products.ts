export type OddnessLevel =
  | "Completely Normal"
  | "Slightly Strange"
  | "Very Strange"
  | "We Should Probably Investigate";

export type ProductBadge =
  | "Bestseller"
  | "New"
  | "Limited"
  | "Almost Gone"
  | "Questionable"
  | "Staff Pick"
  | "Verified Somehow"
  | "Somehow Popular";

export type CatalogReview = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
};

export type CatalogVariant = {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  attributes?: Record<string, string>;
};

export type CatalogProduct = {
  id: string;
  _id: string;
  name: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  originalPrice?: number;
  totalStock: number;
  rating: number;
  reviewCount: number;
  badge?: ProductBadge;
  oddness: OddnessLevel;
  sku: string;
  specifications: Record<string, string>;
  whatsIncluded: string[];
  frequentlyBoughtTogether: string[]; // Product IDs
  variants: CatalogVariant[];
  reviews: CatalogReview[];
  visualId: string;
  images: { id: string; public_id: string; url: string; alt?: string }[];
  isLimited?: boolean;
  scarcityNote?: string;
};

export const CATEGORIES_LIST = [
  { id: "all", name: "All", slug: "all", path: "/products" },
  {
    id: "new-arrivals",
    name: "New Arrivals",
    slug: "new-arrivals",
    path: "/products?filter=new",
  },
  {
    id: "weird-stuff",
    name: "Weird Stuff",
    slug: "weird-stuff",
    path: "/products?category=Weird+Stuff",
  },
  { id: "home", name: "Home", slug: "home", path: "/products?category=Home" },
  {
    id: "science",
    name: "Science",
    slug: "science",
    path: "/products?category=Science",
  },
  {
    id: "collectibles",
    name: "Collectibles",
    slug: "collectibles",
    path: "/products?category=Collectibles",
  },
  {
    id: "everyday-things",
    name: "Everyday Things",
    slug: "everyday-things",
    path: "/products?category=Everyday+Things",
  },
  {
    id: "objects",
    name: "Objects",
    slug: "objects",
    path: "/products?category=Objects",
  },
  {
    id: "things-you-didnt-need",
    name: "Things You Didn't Need",
    slug: "things-you-didnt-need",
    path: "/products?category=Things+You+Didn%27t+Need",
  },
  {
    id: "limited",
    name: "Limited",
    slug: "limited",
    path: "/products?filter=limited",
  },
  {
    id: "mysterious",
    name: "Mysterious",
    slug: "mysterious",
    path: "/products?category=Mysterious",
  },
] as const;

export const CATEGORY_EXPLORE_CARDS = [
  {
    name: "Home",
    description: "Things that technically belong in your home.",
    count: 24,
    href: "/products?category=Home",
    icon: "home",
    accent: "from-amber-50 to-orange-50",
  },
  {
    name: "Science",
    description: "Science-adjacent objects of varying legitimacy.",
    count: 18,
    href: "/products?category=Science",
    icon: "atom",
    accent: "from-blue-50 to-indigo-50",
  },
  {
    name: "Collectibles",
    description: "Things worth keeping for reasons we cannot explain.",
    count: 32,
    href: "/products?category=Collectibles",
    icon: "sparkles",
    accent: "from-purple-50 to-violet-50",
  },
  {
    name: "Everyday Things",
    description: "Ordinary objects with extraordinary problems.",
    count: 19,
    href: "/products?category=Everyday+Things",
    icon: "clock",
    accent: "from-emerald-50 to-teal-50",
  },
  {
    name: "Mystery",
    description: "You won't know what it is until you buy it.",
    count: 12,
    href: "/products?category=Mysterious",
    icon: "eye",
    accent: "from-slate-100 to-zinc-100",
  },
  {
    name: "Unnecessary",
    description: "You definitely don't need this.",
    count: 45,
    href: "/products?category=Things+You+Didn%27t+Need",
    icon: "box",
    accent: "from-rose-50 to-pink-50",
  },
];

export const YC_PRODUCTS: CatalogProduct[] = [
  {
    id: "bottled-echoes",
    _id: "yc_prod_001",
    name: "Bottled Echoes",
    slug: "bottled-echoes",
    category: "Collectibles",
    shortDescription:
      "A carefully preserved echo, bottled at the moment of maximum resonance.",
    description: `A carefully preserved echo, bottled at the moment of maximum resonance.

Captured during late twilight in an acoustically insulated borosilicate vessel with dual magnetic pressure seals. When unstoppered near the temporal lobe, it emits a subtle, mathematically pristine recurrence of an acoustic event that occurred elsewhere.

Does not degrade with subsequent listenings provided the container is promptly re-stoppered. Please refrain from uncorking inside quiet public libraries or acoustic testing facilities.`,
    price: 399,
    minPrice: 399,
    maxPrice: 489,
    originalPrice: 450,
    totalStock: 1220,
    rating: 4.8,
    reviewCount: 128,
    badge: "Bestseller",
    oddness: "Very Strange",
    sku: "YC-ECH-0440",
    visualId: "bottled-echoes",
    specifications: {
      "Product Type": "Preserved phenomenon",
      Material: "Borosilicate glass & acoustic vacuum suspension",
      Weight: "240g",
      Dimensions: "8.5 × 8.5 × 22 cm",
      Origin: "Swiss Alps (Valley of Echoes)",
      "Temporal Stability": "99.4%",
      "Acoustic Range": "20Hz – 22,000Hz",
      Warranty: "Probably",
    },
    whatsIncluded: [
      "1 × Bottled Echo (hermetically sealed)",
      "1 × Acoustical Dampener Sleeve",
      "1 × Unnecessary Certificate of Resonance",
      "1 × Velvet Storage Pouch",
    ],
    frequentlyBoughtTogether: ["luxury-cardboard", "emergency-backup-moon"],
    variants: [
      {
        id: "var_echo_std",
        name: "Standard Resonance (440Hz)",
        price: 399,
        stock: 840,
        sku: "YC-ECH-0440",
      },
      {
        id: "var_echo_canyon",
        name: "Alpine Canyon Echo",
        price: 449,
        stock: 260,
        sku: "YC-ECH-CANYON",
      },
      {
        id: "var_echo_cathedral",
        name: "Gothic Cathedral Whisper",
        price: 489,
        stock: 120,
        sku: "YC-ECH-GOTHIC",
      },
    ],
    reviews: [
      {
        id: "rev_1",
        author: "Dr. M. Vance",
        rating: 5,
        date: "October 2, 2026",
        title:
          "Arrived exactly as described. Unfortunately, it is exactly as described.",
        comment:
          "Uncorked it at dinner. A distinct 4-second sound of a goat belling in the Bernese Oberland filled the dining room. My wife left the table. 10/10 craftsmanship.",
        verified: true,
        helpfulCount: 42,
      },
      {
        id: "rev_2",
        author: "Sarah K.",
        rating: 5,
        date: "September 24, 2026",
        title:
          "I bought this as a joke. It became the most interesting thing in my house.",
        comment:
          "Guests refuse to leave until they hold it to their ears. You can faintly hear footsteps in an empty hallway. Very high build quality glass.",
        verified: true,
        helpfulCount: 31,
      },
      {
        id: "rev_3",
        author: "Julian R.",
        rating: 4,
        date: "August 19, 2026",
        title: "Works surprisingly well.",
        comment:
          "Slight harmonic hum around 3 AM on humid days, but my cat seems to respect its presence. Packaging was unnecessarily premium.",
        verified: true,
        helpfulCount: 19,
      },
    ],
    images: [
      {
        id: "img_be_1",
        public_id: "yc/echoes_main",
        url: "/mock/bottled-echoes-main.png",
        alt: "Bottled Echoes Front Angle",
      },
      {
        id: "img_be_2",
        public_id: "yc/echoes_detail",
        url: "/mock/bottled-echoes-detail.png",
        alt: "Bottled Echoes Seal Macro",
      },
      {
        id: "img_be_3",
        public_id: "yc/echoes_packaging",
        url: "/mock/bottled-echoes-box.png",
        alt: "Bottled Echoes Box",
      },
    ],
  },

  {
    id: "luxury-cardboard",
    _id: "yc_prod_002",
    name: "Luxury Cardboard",
    slug: "luxury-cardboard",
    category: "Home",
    shortDescription:
      "Premium structural cardboard engineered for people who refuse to settle for ordinary cardboard.",
    description: `Premium structural cardboard engineered for people who refuse to settle for ordinary cardboard.

Crafted from hand-pressed artisanal 7-ply virgin unbleached kraft fiber with hand-beveled edges and a matte velvet finish. Designed to sit majestically on your living room floor, inviting silent admiration and bewildered inquiries from houseguests.

Features an ultra-precise fluting geometry rated for 400 lbs of load-bearing existential presence. Suitable for sitting near or explaining to guests.`,
    price: 399,
    minPrice: 399,
    maxPrice: 1499,
    originalPrice: 499,
    totalStock: 2730,
    rating: 4.7,
    reviewCount: 94,
    badge: "Staff Pick",
    oddness: "Completely Normal",
    sku: "YC-CRD-7PLY",
    visualId: "luxury-cardboard",
    specifications: {
      "Product Type": "Architectural cellulose composite",
      Material: "7-ply virgin unbleached Scandinavian kraft fiber",
      Weight: "1.8 kg",
      Dimensions: "45 × 35 × 30 cm",
      "Edge Finish": "Hand-beveled 45-degree angle",
      Origin: "Bologna, Italy",
      Warranty: "10-Year Structural Integrity (indoor use only)",
    },
    whatsIncluded: [
      "1 × Luxury Cardboard Unit",
      "1 × White Cotton Handling Gloves",
      "1 × Authenticity Seal with gold foil",
      "1 × Care guide for preventing creases",
    ],
    frequentlyBoughtTogether: ["bottled-echoes", "emotional-support-brick"],
    variants: [
      {
        id: "var_crd_std",
        name: "Standard Edition",
        price: 399,
        stock: 1800,
        sku: "YC-CRD-STD",
      },
      {
        id: "var_crd_prem",
        name: "Premium Fluting Edition",
        price: 749,
        stock: 750,
        sku: "YC-CRD-PREM",
      },
      {
        id: "var_crd_exec",
        name: "Executive Double-Wall Edition",
        price: 1499,
        stock: 180,
        sku: "YC-CRD-EXEC",
      },
    ],
    reviews: [
      {
        id: "rev_c1",
        author: "Marcus T.",
        rating: 5,
        date: "September 30, 2026",
        title: "Replaced my coffee table with this.",
        comment:
          "People assume it is an art installation by a Finnish minimalist. I keep quiet and nod thoughtfully. It has been three months.",
        verified: true,
        helpfulCount: 56,
      },
      {
        id: "rev_c2",
        author: "Felicity H.",
        rating: 4,
        date: "September 11, 2026",
        title: "My cat immediately sat inside it.",
        comment:
          "She looked noticeably more sophisticated while doing so. Cardboard fluting has zero sagging after four weeks.",
        verified: true,
        helpfulCount: 38,
      },
    ],
    images: [
      {
        id: "img_lc_1",
        public_id: "yc/cardboard_main",
        url: "/mock/luxury-cardboard-main.png",
        alt: "Luxury Cardboard Presentation",
      },
    ],
  },

  {
    id: "diy-black-hole-kit",
    _id: "yc_prod_003",
    name: "DIY Black Hole Kit",
    slug: "diy-black-hole-kit",
    category: "Science",
    shortDescription:
      "Compact particle compression chamber with localized event horizon.",
    description: `A sophisticated scientific-looking boxed kit capable of generating a micro event horizon inside your living room.

Features a multi-stage magnetic confinement lattice and a tabletop particle compression chamber. Sustains a stable 0.02mm Schwarzschild horizon under standard 110V/240V household current.

Please follow assembly instructions in strict order. Do not drop car keys, loose coins, or philosophical regrets near the primary aperture.`,
    price: 1850,
    minPrice: 1850,
    maxPrice: 2400,
    originalPrice: 2100,
    totalStock: 42,
    rating: 4.9,
    reviewCount: 67,
    badge: "Limited",
    oddness: "We Should Probably Investigate",
    sku: "YC-BLK-0001",
    visualId: "diy-black-hole-kit",
    isLimited: true,
    scarcityNote: "3 units discovered this week",
    specifications: {
      "Product Type": "Gravitational anomaly generator",
      Material: "Depleted tungsten housing & magnetic containment lattice",
      Weight: "14.2 kg",
      "Power Draw": "450W continuous",
      Origin: "CERN Industrial Outskirts, Meyrin",
      "Hawking Radiation": "Within safe household thresholds",
      Warranty: "Void if horizon expands beyond 1 meter",
    },
    whatsIncluded: [
      "1 × Particle Compression Core",
      "1 × Magnetic Containment Ring",
      "1 × Hex Key for Horizon Adjustment",
      "1 × Emergency Containment Blanket",
      "1 × 48-Page Safety Manual (translated from German)",
    ],
    frequentlyBoughtTogether: ["pocket-sized-void", "reverse-flashlight"],
    variants: [
      {
        id: "var_bh_std",
        name: "Standard Schwarzschild (0.02mm)",
        price: 1850,
        stock: 32,
        sku: "YC-BLK-STD",
      },
      {
        id: "var_bh_kerr",
        name: "Kerr Rotating Singularity",
        price: 2400,
        stock: 10,
        sku: "YC-BLK-KERR",
      },
    ],
    reviews: [
      {
        id: "rev_b1",
        author: "Prof. Kenneth L.",
        rating: 5,
        date: "September 15, 2026",
        title: "Remarkable containment stability.",
        comment:
          "Tossed a stale biscuit in; heard a faint doppler shift as it crossed the horizon. Light bends noticeably around my bookcase now.",
        verified: true,
        helpfulCount: 78,
      },
    ],
    images: [
      { id: "img_bh_1", public_id: "yc/blackhole", url: "/mock/blackhole.png" },
    ],
  },

  {
    id: "extra-tuesday",
    _id: "yc_prod_004",
    name: "Extra Tuesday",
    slug: "extra-tuesday",
    category: "Everyday Things",
    shortDescription:
      "A premium minimalist box labeled with something mysterious: 24 additional weekday hours.",
    description: `A premium minimalist calendar insert granting precisely 24 additional weekday hours inserted between Tuesday and Wednesday.

Useful for clearing administrative backlogs, finishing tasks you vowed to complete yesterday, or experiencing an extra afternoon of mild, dignified existential dread.

Compatibility is guaranteed with all standard Gregorian calendar systems. Irreversible once experienced.`,
    price: 89,
    minPrice: 89,
    maxPrice: 89,
    totalStock: 840,
    rating: 4.1,
    reviewCount: 210,
    badge: "Somehow Popular",
    oddness: "Very Strange",
    sku: "YC-TUE-24HR",
    visualId: "extra-tuesday",
    specifications: {
      "Product Type": "Temporal duration block",
      Duration: "86,400 SI seconds",
      "Calendar System": "Gregorian standard",
      Weight: "0g (pure duration)",
      Origin: "International Date Line",
      "Temporal Variance": "±0.002s",
      Warranty: "Irreversible once lived",
    },
    whatsIncluded: [
      "1 × Sealed Tuesday Foil Pack",
      "1 × Temporal Synchronization Guide",
      "1 × Do Not Open on Wednesday sticker",
    ],
    frequentlyBoughtTogether: [
      "7-day-subscription-to-yesterday",
      "quantum-left-sock",
    ],
    variants: [
      {
        id: "var_tue_std",
        name: "Standard Extra Tuesday",
        price: 89,
        stock: 840,
        sku: "YC-TUE-STD",
      },
    ],
    reviews: [
      {
        id: "rev_t1",
        author: "Arthur P.",
        rating: 2,
        date: "August 28, 2026",
        title: "Still waiting for the expected Tuesday.",
        comment:
          "Woke up expecting Tuesday II; calendar read Wednesday morning. Support told me I had experienced it while asleep. Slightly disappointed.",
        verified: true,
        helpfulCount: 64,
      },
      {
        id: "rev_t2",
        author: "Elena M.",
        rating: 5,
        date: "September 8, 2026",
        title: "Used it to file taxes.",
        comment:
          "Nobody at the revenue service noticed the additional date stamped on the paperwork. An incredible logistical loophole.",
        verified: true,
        helpfulCount: 51,
      },
    ],
    images: [
      {
        id: "img_et_1",
        public_id: "yc/extra_tuesday",
        url: "/mock/extra-tuesday.png",
      },
    ],
  },

  {
    id: "emergency-backup-moon",
    _id: "yc_prod_005",
    name: "Emergency Backup Moon",
    slug: "emergency-backup-moon",
    category: "Collectibles",
    shortDescription:
      "Orbital celestial redundancy system with tidal stabilization.",
    description: `In the event that the primary celestial moon is obscured by cloud cover, misaligned, or unavailable, this compact high-albedo satellite maintains tidal stability and nighttime romantic ambiance across a 50-mile radius.

Engineered with genuine lunar basalt simulacrum panels and a micro-gravitational gyroscopic anchor. Deploys gracefully into the upper mesosphere via tethered magnetic tension.`,
    price: 12999,
    minPrice: 12999,
    maxPrice: 12999,
    totalStock: 3,
    rating: 4.9,
    reviewCount: 18,
    badge: "Almost Gone",
    oddness: "We Should Probably Investigate",
    sku: "YC-MOO-384K",
    visualId: "emergency-backup-moon",
    isLimited: true,
    scarcityNote: "Only 3 left in inventory",
    specifications: {
      "Product Type": "Sub-orbital luminary & tidal buffer",
      "Albedo Rating": "0.12 (matches lunar surface)",
      Diameter: "120 cm (deployed)",
      Weight: "68 kg",
      "Power Source": "Tidal solar capacitor",
      Origin: "White Sands Celestial Proving Ground",
      Warranty: "250,000 miles or 3 lunar cycles",
    },
    whatsIncluded: [
      "1 × High-Albedo Spherical Module",
      "1 × Mesospheric Deployment Tether (30 km spool)",
      "1 × Lunar Remote Control & Phase Dial",
      "1 × Official Celestial Redundancy Certificate",
    ],
    frequentlyBoughtTogether: ["bottled-echoes", "pocket-sized-void"],
    variants: [
      {
        id: "var_moon_std",
        name: "High-Albedo Edition",
        price: 12999,
        stock: 3,
        sku: "YC-MOO-384K",
      },
    ],
    reviews: [
      {
        id: "rev_m1",
        author: "Archibald Sterling",
        rating: 5,
        date: "July 14, 2026",
        title: "Tides in my pond have stabilized.",
        comment:
          "The neighbors complained when I set it to full gibbous on a Tuesday, but the garden looks ethereal. Worth every penny.",
        verified: true,
        helpfulCount: 37,
      },
    ],
    images: [
      {
        id: "img_ebm_1",
        public_id: "yc/backup_moon",
        url: "/mock/backup-moon.png",
      },
    ],
  },

  {
    id: "invisible-umbrella",
    _id: "yc_prod_006",
    name: "Invisible Umbrella",
    slug: "invisible-umbrella",
    category: "Everyday Things",
    shortDescription:
      "Guaranteed invisible precipitation deflection apparatus.",
    description: `A precision-machined brushed aluminum umbrella shaft and ergonomic handle. The canopy is 100% optical-grade invisible polymer.

Deflects rain droplets while allowing people on the street to question your grip on reality. You remain completely dry while visibly walking down the boulevard holding a bare stick over your head with poise.`,
    price: 149,
    minPrice: 149,
    maxPrice: 179,
    totalStock: 560,
    rating: 3.9,
    reviewCount: 43,
    badge: "New",
    oddness: "Slightly Strange",
    sku: "YC-UMB-INVIS",
    visualId: "invisible-umbrella",
    specifications: {
      "Product Type": "Rain deflection tool",
      "Canopy Visibility": "0.00% (refractive index matched to air)",
      Weight: "310g",
      "Wind Resistance": "Up to 45 mph",
      "Handle Material": "Brushed Grade-5 Titanium",
      Origin: "Kyoto Precision Optics",
      Warranty: "Lifetime visual guarantee (if found)",
    },
    whatsIncluded: [
      "1 × Invisible Umbrella (Handle visible, canopy transparent)",
      "1 × Tactical Storage Sleeve (clearly marked so you don't lose it)",
      "1 × Optical Cleaning Cloth",
    ],
    frequentlyBoughtTogether: ["suspiciously-normal-rock", "extra-tuesday"],
    variants: [
      {
        id: "var_umb_blk",
        name: "Matte Black Handle",
        price: 149,
        stock: 340,
        sku: "YC-UMB-BLK",
      },
      {
        id: "var_umb_ti",
        name: "Brushed Titanium Handle",
        price: 179,
        stock: 220,
        sku: "YC-UMB-TI",
      },
    ],
    reviews: [
      {
        id: "rev_u1",
        author: "Clara B.",
        rating: 4,
        date: "September 2, 2026",
        title: "Completely dry, deeply judged.",
        comment:
          "People were staring at me like I was insane as rain bounced off an empty circle above my head. Perfect product.",
        verified: true,
        helpfulCount: 29,
      },
      {
        id: "rev_u2",
        author: "David G.",
        rating: 3,
        date: "August 12, 2026",
        title: "Lost it on the coat rack.",
        comment:
          "Could not tell which handle was mine. Touched four other umbrellas before finding the invisible perimeter.",
        verified: true,
        helpfulCount: 44,
      },
    ],
    images: [
      {
        id: "img_iu_1",
        public_id: "yc/invis_umbrella",
        url: "/mock/invis-umbrella.png",
      },
    ],
  },

  {
    id: "premium-nothing",
    _id: "yc_prod_007",
    name: "Premium Nothing",
    slug: "premium-nothing",
    category: "Objects",
    shortDescription: "Certified vacuum sealed absence of matter.",
    description: `A vacuum-sealed borosilicate cube enclosing certified absolute emptiness. Zero impurities, zero atoms, zero emotional baggage.

The most minimalist consumer acquisition possible in the modern economy. Sits on your desk as a sobering reminder of absence and clarity. Comes with an audited spectroscopic certificate confirming 0.00000 moles of matter inside.`,
    price: 249,
    minPrice: 249,
    maxPrice: 389,
    totalStock: 9999,
    rating: 5.0,
    reviewCount: 312,
    badge: "Bestseller",
    oddness: "Completely Normal",
    sku: "YC-NOTH-000",
    visualId: "premium-nothing",
    specifications: {
      Contents: "0.00000 mol of gas",
      "Internal Pressure": "< 10⁻¹⁰ Torr (ultra-high vacuum)",
      Enclosure: "Anti-reflective museum glass",
      Dimensions: "10 × 10 × 10 cm",
      Weight: "850g (enclosure only)",
      Origin: "Cleanroom 4, Zurich",
      Warranty: "No defects possible (nothing to fail)",
    },
    whatsIncluded: [
      "1 × Vacuum Cube containing Nothing",
      "1 × Microfiber Polishing Cloth",
      "1 × Mass Spectrometry Audit Certificate",
    ],
    frequentlyBoughtTogether: ["certified-unnecessary-box", "luxury-cardboard"],
    variants: [
      {
        id: "var_not_10",
        name: "Desk Edition (10cm)",
        price: 249,
        stock: 8500,
        sku: "YC-NOTH-10",
      },
      {
        id: "var_not_20",
        name: "Gallery Edition (20cm)",
        price: 389,
        stock: 1499,
        sku: "YC-NOTH-20",
      },
    ],
    reviews: [
      {
        id: "rev_n1",
        author: "Oliver W.",
        rating: 5,
        date: "September 29, 2026",
        title: "Does absolutely nothing. Magnificent.",
        comment:
          "I have spent thousands on things that clutter my mind. This clutters nothing. It delivers precisely what was advertised.",
        verified: true,
        helpfulCount: 104,
      },
    ],
    images: [
      {
        id: "img_pn_1",
        public_id: "yc/premium_nothing",
        url: "/mock/nothing.png",
      },
    ],
  },

  {
    id: "suspiciously-normal-rock",
    _id: "yc_prod_008",
    name: "Suspiciously Normal Rock",
    slug: "suspiciously-normal-rock",
    category: "Objects",
    shortDescription: "Exhibits zero anomalous properties. Almost too normal.",
    description: `A medium-sized smooth granite river stone.

Rigorously tested by our geological department for three consecutive months. Exhibits absolutely zero anomalous behavior. Zero radiation, zero magnetism, zero temporal fluctuations.

So thoroughly, relentlessly normal that several senior inspectors resigned out of quiet anxiety. We suggest placing it on your desk and watching it occasionally.`,
    price: 75,
    minPrice: 75,
    maxPrice: 75,
    totalStock: 1840,
    rating: 4.6,
    reviewCount: 189,
    badge: "Verified Somehow",
    oddness: "Slightly Strange",
    sku: "YC-RCK-NORM",
    visualId: "suspiciously-normal-rock",
    specifications: {
      Material: "Igneous granite",
      Weight: "430g (±5g)",
      "Surface Finish": "Natural river tumble",
      "Radioactive Emissions": "0.000 μSv/h",
      "Magnetic Dipole": "Indistinguishable from background",
      Origin: "Unremarkable riverbed, Oregon",
      Warranty: "Will remain a rock indefinitely",
    },
    whatsIncluded: [
      "1 × Suspiciously Normal Rock",
      "1 × 14-Page Geological Conformity Report",
      "1 × Padded Velvet Display Ring",
    ],
    frequentlyBoughtTogether: ["emotional-support-brick", "bottled-echoes"],
    variants: [
      {
        id: "var_rck_std",
        name: "Standard Granite Specimen",
        price: 75,
        stock: 1840,
        sku: "YC-RCK-NORM",
      },
    ],
    reviews: [
      {
        id: "rev_r1",
        author: "Nora S.",
        rating: 5,
        date: "September 20, 2026",
        title: "I keep staring at it.",
        comment:
          "It hasn't moved in three weeks. Which is normal. But is it planning to? Excellent paperweight.",
        verified: true,
        helpfulCount: 52,
      },
    ],
    images: [
      {
        id: "img_snr_1",
        public_id: "yc/normal_rock",
        url: "/mock/normal-rock.png",
      },
    ],
  },

  {
    id: "pocket-sized-void",
    _id: "yc_prod_009",
    name: "Pocket-Sized Void",
    slug: "pocket-sized-void",
    category: "Things You Didn't Need",
    shortDescription:
      "Personal singularity in a velvet-lined pocket carry case.",
    description: `A wearable pocket talisman housing a 2mm stable event threshold.

Absorbs small annoyances, receipt paper, breadcrumbs, and ambient photons. Comes encased in a bespoke calfskin travel holster with an anodized magnetic safety latch.

Do not insert ballpoint pens unless you intend to donate them permanently to thermodynamics.`,
    price: 620,
    minPrice: 620,
    maxPrice: 620,
    totalStock: 78,
    rating: 4.8,
    reviewCount: 55,
    badge: "Questionable",
    oddness: "Very Strange",
    sku: "YC-VOID-PCKT",
    visualId: "pocket-sized-void",
    isLimited: true,
    scarcityNote: "Only 7 left in this batch",
    specifications: {
      "Product Type": "Micro singularity talisman",
      "Event Radius": "2.1 mm",
      Containment: "Beryllium-copper pocket chassis",
      Weight: "180g",
      "Absorption Rate": "0.04 grams per second",
      Origin: "Sub-surface research lab, Black Forest",
      Warranty: "1 year against accidental total inversion",
    },
    whatsIncluded: [
      "1 × Pocket-Sized Void Chassis",
      "1 × Italian Calfskin Holster",
      "1 × Latch Key",
    ],
    frequentlyBoughtTogether: ["diy-black-hole-kit", "portable-hole"],
    variants: [
      {
        id: "var_void_std",
        name: "Tungsten Gunmetal Finish",
        price: 620,
        stock: 78,
        sku: "YC-VOID-PCKT",
      },
    ],
    reviews: [
      {
        id: "rev_v1",
        author: "Simon T.",
        rating: 5,
        date: "August 30, 2026",
        title: "Fed it my dentist bill.",
        comment:
          "The bill vanished with a pleasing low 'thwump' sound. Highly recommended for daily stress management.",
        verified: true,
        helpfulCount: 41,
      },
    ],
    images: [
      {
        id: "img_psv_1",
        public_id: "yc/pocket_void",
        url: "/mock/pocket-void.png",
      },
    ],
  },

  {
    id: "certified-unnecessary-box",
    _id: "yc_prod_010",
    name: "Certified Unnecessary Box",
    slug: "certified-unnecessary-box",
    category: "Things You Didn't Need",
    shortDescription:
      "Guaranteed to serve no practical or ornamental function.",
    description: `A precision-milled aerospace aluminum box designed specifically to contain nothing and open to reveal nothing.

Certified by an independent third-party auditor to be 100% devoid of utility. Features magnetic haptic damping with a 0.01mm seam tolerance so seamless that opening it feels like violating an unwritten law of physics.`,
    price: 110,
    minPrice: 110,
    maxPrice: 110,
    totalStock: 3420,
    rating: 4.9,
    reviewCount: 420,
    badge: "Bestseller",
    oddness: "Completely Normal",
    sku: "YC-BOX-UNNEC",
    visualId: "certified-unnecessary-box",
    specifications: {
      Material: "Anodized 6061-T6 Aluminum",
      Finish: "Sandblasted satin grey",
      Dimensions: "12 × 8 × 4 cm",
      Weight: "340g",
      "Utility Score": "0.00% (Audited ISO-999)",
      Origin: "Stuttgart Machining Guild",
      Warranty: "Guaranteed 100% pointless",
    },
    whatsIncluded: [
      "1 × Certified Unnecessary Box",
      "1 × Certificate of Non-Functionality",
      "1 × Serialized Tamper Hologram",
    ],
    frequentlyBoughtTogether: ["luxury-cardboard", "premium-nothing"],
    variants: [
      {
        id: "var_box_std",
        name: "Space Grey Anodized",
        price: 110,
        stock: 3420,
        sku: "YC-BOX-UNNEC",
      },
    ],
    reviews: [
      {
        id: "rev_box_1",
        author: "Gretchen F.",
        rating: 5,
        date: "September 14, 2026",
        title: "I keep putting things in it, but they look wrong.",
        comment:
          "This box rejects utility on a spiritual level. The lid closes with the most satisfying click I have ever heard.",
        verified: true,
        helpfulCount: 63,
      },
    ],
    images: [
      {
        id: "img_cub_1",
        public_id: "yc/unnec_box",
        url: "/mock/unnec-box.png",
      },
    ],
  },

  {
    id: "quantum-left-sock",
    _id: "yc_prod_011",
    name: "Quantum Left Sock",
    slug: "quantum-left-sock",
    category: "Everyday Things",
    shortDescription:
      "Exists in a superposition of clean and dirty until observed.",
    description: `A single combed cotton athletic sock woven with entangled microfilaments.

Exists in a quantum superposition of clean and dirty until pulled out of the hamper and directly observed under light. Its entangled right counterpart is currently in an unknown location in Prague.`,
    price: 45,
    minPrice: 45,
    maxPrice: 45,
    totalStock: 1940,
    rating: 4.3,
    reviewCount: 88,
    badge: "New",
    oddness: "Slightly Strange",
    sku: "YC-SOX-QLFT",
    visualId: "quantum-left-sock",
    specifications: {
      Material: "80% Combed Cotton, 20% Quantum Entangled Microfiber",
      "Foot Orientation": "Exclusively Left",
      "Wavefunction Collapse Time": "12 milliseconds upon observation",
      Origin: "Quantum Textiles Lab, Vienna",
      Warranty: "Lifetime superposition guarantee",
    },
    whatsIncluded: [
      "1 × Quantum Left Sock",
      "1 × Antistatic Transport Envelope",
    ],
    frequentlyBoughtTogether: ["extra-tuesday", "suspiciously-normal-rock"],
    variants: [
      {
        id: "var_sox_std",
        name: "Standard Crew Fit",
        price: 45,
        stock: 1940,
        sku: "YC-SOX-QLFT",
      },
    ],
    reviews: [
      {
        id: "rev_sox_1",
        author: "Leon K.",
        rating: 4,
        date: "August 22, 2026",
        title: "Smelled fresh until I looked closely.",
        comment:
          "The observer effect is undeniably real in foot apparel. Very comfortable toe seam though.",
        verified: true,
        helpfulCount: 33,
      },
    ],
    images: [
      {
        id: "img_qls_1",
        public_id: "yc/quantum_sock",
        url: "/mock/quantum-sock.png",
      },
    ],
  },

  {
    id: "7-day-subscription-to-yesterday",
    _id: "yc_prod_012",
    name: "7-Day Subscription to Yesterday",
    slug: "7-day-subscription-to-yesterday",
    category: "Science",
    shortDescription: "Revisit past chronological slices with temporal lag.",
    description: `Receive daily sensory updates and minor decision re-runs calibrated 24 hours behind real time.

Ideal for people who found today slightly too urgent. You will receive yesterday's news, yesterday's weather, and yesterday's opportunities, all delivered with calm hindsight.`,
    price: 320,
    minPrice: 320,
    maxPrice: 320,
    totalStock: 110,
    rating: 4.5,
    reviewCount: 62,
    badge: "Somehow Popular",
    oddness: "Very Strange",
    sku: "YC-SUB-YEST",
    visualId: "7-day-subscription-to-yesterday",
    specifications: {
      "Delivery Mode": "Daily chronological packet",
      "Lag Window": "Exactly 24 hours (±0.00s)",
      Duration: "7 consecutive cycles",
      Origin: "Greenwich Mean Hindsight Office",
      Warranty: "All events occurred as recorded",
    },
    whatsIncluded: [
      "7 × Sealed Yesterday Dispatch Dossiers",
      "1 × Chronological Offset Decoder",
    ],
    frequentlyBoughtTogether: ["extra-tuesday", "temporal-paperweight"],
    variants: [
      {
        id: "var_sub_7d",
        name: "7-Day Full Pass",
        price: 320,
        stock: 110,
        sku: "YC-SUB-YEST",
      },
    ],
    reviews: [
      {
        id: "rev_sub_1",
        author: "Miriam E.",
        rating: 5,
        date: "September 18, 2026",
        title: "Much less stressful than living in real time.",
        comment:
          "Knowing yesterday's stock market drops ahead of living yesterday gave me profound peace. Will renew.",
        verified: true,
        helpfulCount: 45,
      },
    ],
    images: [
      {
        id: "img_yest_1",
        public_id: "yc/subscription_yesterday",
        url: "/mock/yesterday.png",
      },
    ],
  },

  {
    id: "portable-hole",
    _id: "yc_prod_013",
    name: "Portable Hole",
    slug: "portable-hole",
    category: "Weird Stuff",
    shortDescription: "Deployable 2D threshold on any flat surface.",
    description: `A 30-inch circular fabric mat that, when unfolded on any solid flat surface, establishes a temporary two-dimensional aperture through the substrate.

Roll up the edges to retrieve the aperture. Tested through drywall, hardwood, reinforced concrete, and bureaucratic red tape. Please look before stepping.`,
    price: 850,
    minPrice: 850,
    maxPrice: 850,
    totalStock: 65,
    rating: 4.7,
    reviewCount: 104,
    badge: "Staff Pick",
    oddness: "We Should Probably Investigate",
    sku: "YC-HL-PORT",
    visualId: "portable-hole",
    isLimited: true,
    scarcityNote: "Available until someone figures out what this is",
    specifications: {
      Diameter: "76.2 cm (30 inches)",
      "Thickness (folded)": "1.2 mm",
      "Penetration Depth": "Up to 1.8 meters into substrate",
      Material: "Woven topological vacuum filament",
      Origin: "Experimental topology annex, MIT",
      Warranty: "Do not fold while occupied",
    },
    whatsIncluded: [
      "1 × Portable Hole Mat",
      "1 × Neoprene Carrying Tube",
      "1 × Substrate Safety Tether",
    ],
    frequentlyBoughtTogether: ["pocket-sized-void", "emotional-support-brick"],
    variants: [
      {
        id: "var_hole_std",
        name: "30-Inch Standard Hole",
        price: 850,
        stock: 65,
        sku: "YC-HL-PORT",
      },
    ],
    reviews: [
      {
        id: "rev_hole_1",
        author: "T. Henderson",
        rating: 5,
        date: "September 5, 2026",
        title: "Dropped my keys through it into my basement.",
        comment:
          "Saved me walking down two flights of stairs. Flawless two-dimensional boundary.",
        verified: true,
        helpfulCount: 68,
      },
    ],
    images: [
      {
        id: "img_ph_1",
        public_id: "yc/portable_hole",
        url: "/mock/portable-hole.png",
      },
    ],
  },

  {
    id: "emotional-support-brick",
    _id: "yc_prod_014",
    name: "Emotional Support Brick",
    slug: "emotional-support-brick",
    category: "Home",
    shortDescription:
      "Kiln-fired companion offering unyielding moral stability.",
    description: `A genuine kiln-fired red clay brick with softened corners and an undeniable sense of grounded steadfastness.

Doesn't ask about your career. Doesn't judge your sleep schedule. Doesn't offer unsolicited life advice. Just sits there, being exceptionally dense and entirely certain of its place in the universe.`,
    price: 65,
    minPrice: 65,
    maxPrice: 65,
    totalStock: 4110,
    rating: 4.9,
    reviewCount: 830,
    badge: "Bestseller",
    oddness: "Completely Normal",
    sku: "YC-BRK-EMOT",
    visualId: "emotional-support-brick",
    specifications: {
      Material: "Kiln-fired alluvial red clay",
      Weight: "2.3 kg",
      Dimensions: "20 × 9.5 × 5.5 cm",
      "Compressive Strength": "35 N/mm²",
      "Moral Reliability": "Absolute",
      Origin: "Hudson River Brickworks",
      Warranty: "Will outlive your grandchildren",
    },
    whatsIncluded: [
      "1 × Emotional Support Brick",
      "1 × Felt Coaster for furniture protection",
      "1 × Adoption & Authenticity Certificate",
    ],
    frequentlyBoughtTogether: ["luxury-cardboard", "suspiciously-normal-rock"],
    variants: [
      {
        id: "var_brk_std",
        name: "Classic Terracotta Red",
        price: 65,
        stock: 4110,
        sku: "YC-BRK-EMOT",
      },
    ],
    reviews: [
      {
        id: "rev_brk_1",
        author: "Hannah W.",
        rating: 5,
        date: "October 1, 2026",
        title: "The only stable presence in my life.",
        comment:
          "I place it on my desk when writing emails. Its silent weight reminds me that all problems are fleeting, but brick is eternal.",
        verified: true,
        helpfulCount: 142,
      },
    ],
    images: [
      {
        id: "img_esb_1",
        public_id: "yc/support_brick",
        url: "/mock/support-brick.png",
      },
    ],
  },

  {
    id: "box-of-slightly-important-air",
    _id: "yc_prod_015",
    name: "Box of Slightly Important Air",
    slug: "box-of-slightly-important-air",
    category: "Collectibles",
    shortDescription:
      "Atmospheric sample collected during a mildly significant historical event.",
    description: `A pressurized glass ampoule enclosing ambient atmosphere sampled from the press room during a minor 1994 diplomatic trade memorandum signing in Lisbon.

Contains 78.08% nitrogen, 20.95% oxygen, 0.93% argon, and trace aromatic notes of institutional carpet cleaner and photocopier ozone from the late Clinton administration era.`,
    price: 180,
    minPrice: 180,
    maxPrice: 180,
    totalStock: 720,
    rating: 4.4,
    reviewCount: 79,
    badge: "Limited",
    oddness: "Slightly Strange",
    sku: "YC-AIR-1994",
    visualId: "box-of-slightly-important-air",
    specifications: {
      "Atmospheric Pressure": "1,013.25 hPa",
      "Collection Date": "November 14, 1994",
      Location: "Lisbon Diplomatic Annex, Room 4B",
      Volume: "500 ml",
      "Sealing Method": "Flame-sealed borosilicate ampoule",
      Warranty: "Contains authentic 1994 molecules",
    },
    whatsIncluded: [
      "1 × Sealed Air Ampoule",
      "1 × Brass Display Stand",
      "1 × Certified Transcript of the 1994 Memorandum",
    ],
    frequentlyBoughtTogether: ["bottled-echoes", "pre-owned-deja-vu"],
    variants: [
      {
        id: "var_air_std",
        name: "Lisbon 1994 Memorandum",
        price: 180,
        stock: 720,
        sku: "YC-AIR-1994",
      },
    ],
    reviews: [
      {
        id: "rev_air_1",
        author: "Walter H.",
        rating: 4,
        date: "August 10, 2026",
        title: "Smells like nostalgia and treaty agreements.",
        comment:
          "I haven't broken the seal, but holding it brings an unmistakable sense of mid-nineties geopolitical consensus.",
        verified: true,
        helpfulCount: 27,
      },
    ],
    images: [
      {
        id: "img_air_1",
        public_id: "yc/important_air",
        url: "/mock/important-air.png",
      },
    ],
  },

  {
    id: "temporal-paperweight",
    _id: "yc_prod_016",
    name: "Temporal Paperweight",
    slug: "temporal-paperweight",
    category: "Science",
    shortDescription:
      "Prevents loose documents from blowing away and slows desk time.",
    description: `A dense solid tungsten pyramid that prevents loose documents from blowing away, as well as slowing local desk time by 0.0003 seconds per day.

Allows you to finish that proposal just slightly before deadline due to localized relativistic frame dragging. Finished in a dark PVD vapor coat.`,
    price: 210,
    minPrice: 210,
    maxPrice: 210,
    totalStock: 310,
    rating: 4.6,
    reviewCount: 41,
    badge: "New",
    oddness: "Slightly Strange",
    sku: "YC-TMP-PYR",
    visualId: "temporal-paperweight",
    specifications: {
      Material: "99.95% Pure Sintered Tungsten",
      Weight: "1.4 kg",
      Dimensions: "6 × 6 × 5 cm",
      "Temporal Drift": "-0.0003 sec / 24h",
      Origin: "Black Mesa Metallurgy Unit",
      Warranty: "Time dilation verified",
    },
    whatsIncluded: [
      "1 × Tungsten Temporal Pyramid",
      "1 × Leather Desk Mat",
      "1 × Precision Chronometer Calibration Chart",
    ],
    frequentlyBoughtTogether: ["extra-tuesday", "diy-black-hole-kit"],
    variants: [
      {
        id: "var_tmp_std",
        name: "Sintered Tungsten",
        price: 210,
        stock: 310,
        sku: "YC-TMP-PYR",
      },
    ],
    reviews: [
      {
        id: "rev_tmp_1",
        author: "Devin R.",
        rating: 5,
        date: "September 27, 2026",
        title: "Genuinely heavy, subtly slow.",
        comment:
          "My wristwatch gains 1 second every three weeks compared to my wall clock now. Exactly what I wanted.",
        verified: true,
        helpfulCount: 22,
      },
    ],
    images: [
      {
        id: "img_tp_1",
        public_id: "yc/paperweight",
        url: "/mock/paperweight.png",
      },
    ],
  },

  {
    id: "reverse-flashlight",
    _id: "yc_prod_017",
    name: "Reverse Flashlight",
    slug: "reverse-flashlight",
    category: "Weird Stuff",
    shortDescription: "Emits a focused 800-lumen beam of solid shadow.",
    description: `Illuminate excessively bright rooms with soothing deep darkness.

Features high-grade reverse photon absorption diodes that pull illumination out of the beam's corridor. Perfect for daytime naps in glass-walled corporate offices or reading secrets in broad daylight. Requires standard 18650 lithium cells.`,
    price: 340,
    minPrice: 340,
    maxPrice: 340,
    totalStock: 140,
    rating: 4.7,
    reviewCount: 93,
    badge: "Questionable",
    oddness: "Very Strange",
    sku: "YC-FL-REV",
    visualId: "reverse-flashlight",
    specifications: {
      "Lumen Output": "-800 Lumens (shadow beam)",
      "Beam Distance": "35 meters in broad daylight",
      Battery: "1 × 18650 Li-ion (included)",
      Body: "Mil-spec Hard Anodized Aluminum",
      Origin: "Optics Dark Lab, Jena",
      Warranty: "2 years against accidental glow",
    },
    whatsIncluded: [
      "1 × Reverse Flashlight Torch",
      "1 × High-Capacity 18650 Cell",
      "1 × USB-C Charging Cradle",
      "1 × Wrist Lanyard",
    ],
    frequentlyBoughtTogether: ["pocket-sized-void", "diy-black-hole-kit"],
    variants: [
      {
        id: "var_rev_std",
        name: "Tactical Matte Black",
        price: 340,
        stock: 140,
        sku: "YC-FL-REV",
      },
    ],
    reviews: [
      {
        id: "rev_rf_1",
        author: "Zack P.",
        rating: 5,
        date: "September 12, 2026",
        title: "Pointed it at the sun.",
        comment:
          "Created a delightful localized solar eclipse on my porch. My plants were confused but respectful.",
        verified: true,
        helpfulCount: 54,
      },
    ],
    images: [
      {
        id: "img_rf_1",
        public_id: "yc/reverse_flashlight",
        url: "/mock/reverse-flashlight.png",
      },
    ],
  },

  {
    id: "pre-owned-deja-vu",
    _id: "yc_prod_018",
    name: "Pre-Owned Déjà Vu",
    slug: "pre-owned-deja-vu",
    category: "Mysterious",
    shortDescription: "Haven't you already bought this before?",
    description: `Haven't you already read this product description?

A subtle psychological frequency delivered in a sealed amber dropper bottle. Administer two drops beneath the tongue for immediate, inexplicable familiarity with your current surroundings, the person talking to you, and the wallpaper.`,
    price: 95,
    minPrice: 95,
    maxPrice: 95,
    totalStock: 512,
    rating: 4.2,
    reviewCount: 115,
    badge: "Somehow Popular",
    oddness: "Very Strange",
    sku: "YC-DEJA-VU",
    visualId: "pre-owned-deja-vu",
    specifications: {
      "Bottle Volume": "30 ml (approx 600 drops)",
      Vehicle: "Organic saline with neural resonance salts",
      "Shelf Life": "Yesterday to Tomorrow",
      Origin: "Recursive Memory Dispensary",
      Warranty: "You know the warranty already",
    },
    whatsIncluded: [
      "1 × 30ml Amber Glass Dropper Bottle",
      "1 × Instructions you feel you have read before",
    ],
    frequentlyBoughtTogether: ["extra-tuesday", "bottled-echoes"],
    variants: [
      {
        id: "var_deja_std",
        name: "Vintage 30ml Dropper",
        price: 95,
        stock: 512,
        sku: "YC-DEJA-VU",
      },
    ],
    reviews: [
      {
        id: "rev_dj_1",
        author: "F. Castle",
        rating: 4,
        date: "September 7, 2026",
        title: "I knew I was going to write this review.",
        comment:
          "Took two drops. Walked into an unfamiliar airport in Copenhagen. Knew exactly where the luggage carousel was. Terrifyingly convenient.",
        verified: true,
        helpfulCount: 39,
      },
    ],
    images: [
      { id: "img_pdv_1", public_id: "yc/deja_vu", url: "/mock/deja-vu.png" },
    ],
  },

  {
    id: "schrodingers-gift-card",
    _id: "yc_prod_019",
    name: "Schrödinger's Gift Card",
    slug: "schrodingers-gift-card",
    category: "Collectibles",
    shortDescription: "Simultaneously holds $0 and $500 balance until swiped.",
    description: `A precision foil-stamped titanium gift card encoded in quantum magnetic superposition.

Its balance exists simultaneously as $0.00 and $500.00 until the exact millisecond the magnetic stripe is swiped across a point-of-sale terminal, collapsing the waveform. The ultimate gift for people who love probability theory and light gambling.`,
    price: 100,
    minPrice: 100,
    maxPrice: 100,
    totalStock: 880,
    rating: 4.6,
    reviewCount: 140,
    badge: "Verified Somehow",
    oddness: "Slightly Strange",
    sku: "YC-CRD-SCHR",
    visualId: "schrodingers-gift-card",
    specifications: {
      "Card Material": "Titanium with quantum magnetic mesh",
      "Balance Possibilities": "$0.00 or $500.00",
      "Waveform Collapse Method": "Physical swipe or NFC terminal tap",
      Origin: "Copenhagen Institute of Retail Physics",
      Warranty: "Subject to observation",
    },
    whatsIncluded: [
      "1 × Titanium Schrödinger Gift Card",
      "1 × Opaque Lead-Lined Gift Sleeve",
    ],
    frequentlyBoughtTogether: ["certified-unnecessary-box", "premium-nothing"],
    variants: [
      {
        id: "var_schr_std",
        name: "Titanium Superposition Card",
        price: 100,
        stock: 880,
        sku: "YC-CRD-SCHR",
      },
    ],
    reviews: [
      {
        id: "rev_sch_1",
        author: "Bradford N.",
        rating: 5,
        date: "August 16, 2026",
        title: "Swiped at dinner: Got the $500!",
        comment:
          "The waiter looked terrified as the receipt printed out $500.00 credit. Best hundred bucks I ever gambled.",
        verified: true,
        helpfulCount: 61,
      },
    ],
    images: [
      {
        id: "img_sgc_1",
        public_id: "yc/schrodinger_card",
        url: "/mock/schrodinger-card.png",
      },
    ],
  },

  {
    id: "metaphorical-hammer",
    _id: "yc_prod_020",
    name: "Metaphorical Hammer",
    slug: "metaphorical-hammer",
    category: "Objects",
    shortDescription: "For when everything looks like a metaphorical nail.",
    description: `Forged from high-carbon rhetorical steel with a hand-turned hickory handle.

Engineered to drive points home with devastating clarity during heated board meetings, family gatherings, or internal monologues. Feels exceptionally well-balanced in hand.`,
    price: 125,
    minPrice: 125,
    maxPrice: 125,
    totalStock: 610,
    rating: 4.8,
    reviewCount: 82,
    badge: "Staff Pick",
    oddness: "Completely Normal",
    sku: "YC-HMR-MET",
    visualId: "metaphorical-hammer",
    specifications: {
      "Head Material": "Drop-forged rhetorical carbon steel",
      Handle: "Turned American Hickory",
      Weight: "650g (16 oz)",
      "Argumentative Leverage": "10:1 ratio",
      Origin: "Sheffield Rhetorical Tools",
      Warranty: "Lifetime striking guarantee",
    },
    whatsIncluded: [
      "1 × Metaphorical Hammer (16oz)",
      "1 × Leather Head Sheath",
      "1 × Guide to Constructive Discourse",
    ],
    frequentlyBoughtTogether: ["emotional-support-brick", "luxury-cardboard"],
    variants: [
      {
        id: "var_hmr_std",
        name: "16oz Hickory Classic",
        price: 125,
        stock: 610,
        sku: "YC-HMR-MET",
      },
    ],
    reviews: [
      {
        id: "rev_hmr_1",
        author: "Gordon B.",
        rating: 5,
        date: "September 23, 2026",
        title: "Drove three points home during Q3 review.",
        comment:
          "Resting this on the table immediately reduced unnecessary slide presentations by 74%. Beautiful wood grain.",
        verified: true,
        helpfulCount: 47,
      },
    ],
    images: [
      { id: "img_mh_1", public_id: "yc/hammer", url: "/mock/hammer.png" },
    ],
  },
];

// Helper functions for catalog queries
export function getProductBySlugOrId(
  idOrSlug: string,
): CatalogProduct | undefined {
  return YC_PRODUCTS.find(
    (p) => p.id === idOrSlug || p._id === idOrSlug || p.slug === idOrSlug,
  );
}

export function getFeaturedProducts(limit = 8): CatalogProduct[] {
  return YC_PRODUCTS.slice(0, limit);
}

export function getTrendingProducts(): CatalogProduct[] {
  return [
    YC_PRODUCTS[0], // Bottled Echoes
    YC_PRODUCTS[1], // Luxury Cardboard
    YC_PRODUCTS[2], // DIY Black Hole Kit
    YC_PRODUCTS[3], // Extra Tuesday
    YC_PRODUCTS[4], // Emergency Backup Moon
    YC_PRODUCTS[6], // Premium Nothing
    YC_PRODUCTS[7], // Suspiciously Normal Rock
    YC_PRODUCTS[13], // Emotional Support Brick
  ];
}

export function getLimitedProducts(): CatalogProduct[] {
  return YC_PRODUCTS.filter((p) => p.isLimited || p.totalStock < 100);
}

export function getCustomerFavorites(): CatalogProduct[] {
  return [
    YC_PRODUCTS[13], // Emotional Support Brick
    YC_PRODUCTS[9], // Certified Unnecessary Box
    YC_PRODUCTS[0], // Bottled Echoes
    YC_PRODUCTS[6], // Premium Nothing
  ];
}

export function searchCatalog(query: string): CatalogProduct[] {
  const q = query.toLowerCase().trim();
  if (!q) return YC_PRODUCTS;

  return YC_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.oddness.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q),
  );
}

export function toStoreProduct(p: CatalogProduct): any {
  return {
    _id: p._id,
    name: p.name,
    category: p.category,
    description: p.description,
    shortDescription: p.shortDescription,
    images: p.images,
    minPrice: p.minPrice,
    maxPrice: p.maxPrice,
    totalStock: p.totalStock,
    slug: p.slug,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badge: p.badge,
    oddness: p.oddness,
    visualId: p.visualId,
    originalPrice: p.originalPrice,
    isLimited: p.isLimited,
    scarcityNote: p.scarcityNote,
    specifications: p.specifications,
    whatsIncluded: p.whatsIncluded,
    frequentlyBoughtTogether: p.frequentlyBoughtTogether,
  };
}

export function toStoreProductDetail(p: CatalogProduct): any {
  return {
    product: toStoreProduct(p),
    variants: p.variants.map((v) => ({
      _id: v.id,
      productId: p._id,
      attributes: { option: v.name },
      name: v.name,
      price: v.price,
      stock: v.stock,
      sku: v.sku,
    })),
  };
}
