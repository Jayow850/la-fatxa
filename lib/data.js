// Seed catalog — 10 bags. Used until Supabase is configured, and as the
// starting data to insert into the database. Replace emoji with real photo URLs.

export const seedProducts = [
  { id: "amara", name: "The Amara Tote", subtitle: "The everyday workhorse that still looks like a treat", price: 6800, was: 7900, cat: "Totes", emoji: "👜", image: "", badge: "best", rating: 4.9, revs: 214,
    material: "Full-grain vegetable-tanned leather", dim_cm: "34 × 28 × 12 cm", dim_in: "13.4 × 11 × 4.7 in",
    fits: ['13" laptop', "Water bottle", "A5 notebook", "Wallet + phone"], care: "Wipe with a damp cloth; condition monthly.",
    size: "large", carry: ["shoulder", "hand"],
    variants: [{ name: "Camel", hex: "#C68C5A", stock: 2, image: "" }, { name: "Burgundy", hex: "#7A2E43", stock: 7, image: "" }, { name: "Black", hex: "#2A2622", stock: 0, image: "" }] },

  { id: "lulu", name: "The Lulu Crossbody", subtitle: "Hands-free, all day, without giving anything up", price: 4200, cat: "Crossbody", emoji: "👝", image: "", badge: "new", rating: 4.8, revs: 96,
    material: "Pebbled leather with solid brass hardware", dim_cm: "22 × 15 × 7 cm", dim_in: "8.7 × 5.9 × 2.8 in",
    fits: ["Phone", "Cards", "Lipstick", "Keys"], care: "Store in the dust bag; keep out of rain.",
    size: "small", carry: ["crossbody"],
    variants: [{ name: "Blush", hex: "#C8798A", stock: 5, image: "" }, { name: "Terracotta", hex: "#7A3B2E", stock: 3, image: "" }, { name: "Cream", hex: "#E8D5C4", stock: 9, image: "" }] },

  { id: "zara", name: "The Zara Shoulder", subtitle: "The one you reach for without thinking", price: 5400, cat: "Totes", emoji: "👛", image: "", badge: "", rating: 4.9, revs: 141,
    material: "Smooth calf leather", dim_cm: "28 × 20 × 10 cm", dim_in: "11 × 7.9 × 3.9 in",
    fits: ["Tablet", "Wallet", "Makeup pouch", "Phone"], care: "Condition every two months.",
    size: "medium", carry: ["shoulder", "hand"],
    variants: [{ name: "Camel", hex: "#C68C5A", stock: 4, image: "" }, { name: "Olive", hex: "#6B6A4A", stock: 1, image: "" }] },

  { id: "nia", name: "The Nia Mini", subtitle: "Small, but it says everything", price: 3100, cat: "Mini Bags", emoji: "🎀", image: "", badge: "ltd", rating: 5.0, revs: 58,
    material: "Soft nappa leather", dim_cm: "16 × 12 × 5 cm", dim_in: "6.3 × 4.7 × 2 in",
    fits: ["Phone", "Cards", "Lip balm"], care: "Keep away from moisture.",
    size: "small", carry: ["crossbody", "hand"],
    variants: [{ name: "Blush", hex: "#C8798A", stock: 1, image: "" }, { name: "Burgundy", hex: "#7A2E43", stock: 0, image: "" }] },

  { id: "sana", name: "The Sana Clutch", subtitle: "The finishing touch for the evening", price: 2800, cat: "Clutches", emoji: "✨", image: "", badge: "", rating: 4.7, revs: 73,
    material: "Satin-finish leather with a fine chain", dim_cm: "24 × 13 × 3 cm", dim_in: "9.4 × 5.1 × 1.2 in",
    fits: ["Phone", "Cards", "Lipstick"], care: "Spot clean only.",
    size: "small", carry: ["hand", "crossbody"],
    variants: [{ name: "Champagne", hex: "#E8D5C4", stock: 6, image: "" }, { name: "Black", hex: "#2A2622", stock: 4, image: "" }] },

  { id: "imani", name: "The Imani Weekender", subtitle: "For the trips you actually want to take", price: 9200, cat: "Totes", emoji: "🧳", image: "", badge: "best", rating: 4.9, revs: 88,
    material: "Heavy-duty full-grain leather", dim_cm: "48 × 30 × 22 cm", dim_in: "18.9 × 11.8 × 8.7 in",
    fits: ['15" laptop', "2 days of clothes", "Toiletry bag", "Water bottle"], care: "Condition monthly; store stuffed.",
    size: "large", carry: ["shoulder", "hand"],
    variants: [{ name: "Cognac", hex: "#9C5A2E", stock: 3, image: "" }, { name: "Black", hex: "#2A2622", stock: 2, image: "" }] },

  { id: "dalia", name: "The Dalia Structured Tote", subtitle: "Boardroom sharp, weekend soft", price: 7400, cat: "Totes", emoji: "💼", image: "", badge: "new", rating: 4.8, revs: 41,
    material: "Structured saffiano-finish leather", dim_cm: "36 × 26 × 13 cm", dim_in: "14.2 × 10.2 × 5.1 in",
    fits: ['14" laptop', "Documents A4", "Water bottle", "Wallet + phone"], care: "Wipe clean; naturally scratch-resistant.",
    size: "large", carry: ["shoulder", "hand"],
    variants: [{ name: "Ivory", hex: "#EFE6DA", stock: 6, image: "" }, { name: "Wine", hex: "#7A2E43", stock: 4, image: "" }, { name: "Taupe", hex: "#A89684", stock: 2, image: "" }] },

  { id: "amani", name: "The Amani Saddle", subtitle: "The curve everyone asks about", price: 4800, cat: "Crossbody", emoji: "👛", image: "", badge: "", rating: 4.9, revs: 117,
    material: "Vegetable-tanned leather, hand-burnished edges", dim_cm: "24 × 18 × 8 cm", dim_in: "9.4 × 7.1 × 3.1 in",
    fits: ["Phone", "Compact wallet", "Sunglasses", "Keys"], care: "Develops a rich patina with wear.",
    size: "small", carry: ["crossbody", "shoulder"],
    variants: [{ name: "Tan", hex: "#C68C5A", stock: 7, image: "" }, { name: "Chocolate", hex: "#5A3A28", stock: 3, image: "" }] },

  { id: "kira", name: "The Kira Evening Clutch", subtitle: "For nights that deserve a little ceremony", price: 3600, cat: "Clutches", emoji: "🌙", image: "", badge: "ltd", rating: 5.0, revs: 29,
    material: "Suede with gold-tone frame clasp", dim_cm: "26 × 14 × 4 cm", dim_in: "10.2 × 5.5 × 1.6 in",
    fits: ["Phone", "Cards", "Lipstick", "Perfume mini"], care: "Suede brush only; keep dry.",
    size: "small", carry: ["hand"],
    variants: [{ name: "Midnight", hex: "#2E2438", stock: 2, image: "" }, { name: "Rose", hex: "#C8798A", stock: 1, image: "" }] },

  { id: "pearl", name: "The Pearl Micro", subtitle: "Barely there, entirely noticed", price: 2400, cat: "Mini Bags", emoji: "🤍", image: "", badge: "new", rating: 4.7, revs: 34,
    material: "Polished nappa with pearl-drop zip pull", dim_cm: "14 × 10 × 4 cm", dim_in: "5.5 × 3.9 × 1.6 in",
    fits: ["Phone (compact)", "Cards", "Lip balm"], care: "Keep away from moisture.",
    size: "small", carry: ["crossbody", "hand"],
    variants: [{ name: "Pearl", hex: "#F2EAE0", stock: 9, image: "" }, { name: "Blush", hex: "#C8798A", stock: 5, image: "" }, { name: "Black", hex: "#2A2622", stock: 3, image: "" }] },
];

export const reviews = [
  { name: "Wanjiru K.", city: "Nairobi", init: "W", text: "The Amara fits my laptop, lunch and my whole life. The photos genuinely did not do the leather justice." },
  { name: "Aisha M.", city: "Mombasa", init: "A", text: "Messaged at midnight, she replied by morning, held my bag and it arrived in two days. So easy." },
  { name: "Njeri W.", city: "Kisumu", init: "N", text: "The size tool told me the mini would not fit my wallet. Saved me a return. I bought the Zara instead — perfect." },
  { name: "Fatuma H.", city: "Nakuru", init: "F", text: "Third bag from La Fatxa. They just do not wear out. The burgundy is even prettier in person." },
  { name: "Grace O.", city: "Eldoret", init: "G", text: "I was nervous buying leather online. One WhatsApp chat and every question was answered. Zero regrets." },
  { name: "Amina S.", city: "Nairobi", init: "A", text: "The weekender survived a whole coast trip and still looks brand new. Worth every shilling." },
];

export const faqs = [
  ["How long is delivery?", "Nairobi: 1–2 days. Rest of Kenya: 2–4 days via courier. You get a tracking message the moment it ships."],
  ["What if it doesn't fit my needs?", "Free returns within 14 days, unused with tags. Use the size finder first — most returns are avoidable."],
  ["Are these real leather?", "Yes. Every bag is full-grain or nappa leather, cut and finished by hand. The material is listed on each product."],
  ["How do I order?", "Tap “Order on WhatsApp” on any bag — your message arrives pre-filled with the bag and color. Fatxa confirms and holds it for you."],
  ["How do I pay?", "Agree directly with Fatxa on WhatsApp — payment on delivery or a deposit to reserve, whatever suits you."],
  ["Do I need to create an account?", "Never. Browse freely; one message completes your order."],
];

export const money = (n) => "KSh " + n.toLocaleString();
export const stockState = (v) => (v.stock === 0 ? "out" : v.stock <= 2 ? "low" : "ok");

// ---- Editable site settings (hero, story, ticker, faq, categories) ----
// In production these live in a Supabase `settings` table (single row).
export const defaultSettings = {
  heroEyebrow: "Handcrafted leather · Nairobi",
  heroLine1: "Carried for", heroEm: "years,", heroLine2Rest: " not", heroLine3: "seasons.",
  heroBody: "Full-grain leather bags made in small batches, measured honestly, and photographed exactly as they arrive. See it, love it, message us — she'll hold it for you.",
  heroImage: "", heroEmoji: "👜",
  ticker: ["Full-grain leather", "Free returns 14 days", "Nairobi delivery 1–2 days", "Held for you on WhatsApp", "Handmade in small batches"],
  showTicker: true, showTrust: true,
  trust: [["✂️","Cut & finished by hand"],["🧵","Full-grain leather only"],["💬","Reserved for you on WhatsApp"],["↩️","14-day free returns"]],
  storyTitle1: "It started at a", storyTitleEm: "kitchen table",
  storyParas: [
    "Fatxa began stitching bags for friends tired of straps that frayed and leather that peeled after one rainy season. Word spread the way good things do — quietly, then all at once.",
    "Today every La Fatxa piece is still cut and finished by a small team she trained herself. Real full-grain leather. Honest measurements.",
    "When you're ready, you don't fill out endless forms — you send one message, and she holds your bag until it's yours.",
  ],
  showStory: true, storyImage: "", storyEmoji: "👜",
  faqs: [
    ["How long is delivery?", "Nairobi: 1–2 days. Rest of Kenya: 2–4 days via courier."],
    ["What if it doesn't suit me?", "Free returns within 14 days, unused with tags."],
    ["Are these real leather?", "Yes. Full-grain or nappa leather, cut and finished by hand."],
    ["How do I order?", "Tap “Order on WhatsApp” — your message arrives pre-filled."],
    ["How do I pay?", "Agree directly with Fatxa on WhatsApp — on delivery or a deposit."],
  ],
  showFaq: true, showSizeFinder: true,
  categories: [{name:"Totes",show:true},{name:"Crossbody",show:true},{name:"Clutches",show:true},{name:"Mini Bags",show:true}],
};
