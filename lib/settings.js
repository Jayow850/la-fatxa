// Site-wide settings Fatxa controls from /admin — hero, marquee, story, FAQs, categories.
// Stored as a single JSON row in Supabase (site_settings table); falls back to defaults.
import { supabase } from "./supabase";

// Curated fonts — keep tasteful so the site always looks premium.
export const FONTS = {
  serif: "'Fraunces', Georgia, serif",
  script: "'Dancing Script', cursive",
  hand: "'Caveat', cursive",
  sans: "'Jost', system-ui, sans-serif",
};
export const fontCss = (id) => FONTS[id] || FONTS.serif;

export const defaultSettings = {
  heroLine1: "Carried for", heroEm: "years,", heroLine2: "not seasons.",
  heroSub: "Leather bags made in small batches. See it, love it, message us.",
  heroImg: null, heroFont: "serif", storyFont: "serif",
  marquee: ["Free returns within 14 days", "Nairobi delivery 1–2 days", "Held for you on WhatsApp", "New batches every month"],
  showStory: true,
  storyTitle: "It started at a kitchen table",
  storyText: "Fatxa began stitching bags for friends tired of straps that frayed after one season. Word spread quietly, then all at once.\n\nEvery piece is still cut and finished by a small team she trained herself. What you see is what arrives.\n\nWhen you're ready, one message reserves your bag.",
  storySig: "— Fatxa",
  storyImage: null, storyEmoji: "👜", storyBadge: "La Fatxa · by hand",
  faqs: [
    ["How long is delivery?", "Nairobi: 1–2 days. Rest of Kenya: 2–4 days. You get a tracking message when it ships."],
    ["Can I return it?", "Yes — free returns within 14 days, unused with tags."],
    ["Is it real leather?", "Always. Full-grain or nappa, listed on every bag."],
    ["How do I order?", "Tap any bag's WhatsApp button — your message arrives pre-filled. Fatxa confirms and holds it for you."],
    ["How do I pay?", "Agree directly with Fatxa — payment on delivery or a deposit to reserve."],
  ],
  categories: [
    { name: "Totes", visible: true }, { name: "Crossbody", visible: true },
    { name: "Clutches", visible: true }, { name: "Mini Bags", visible: true },
  ],
};

export async function getSettings() {
  if (!supabase) return defaultSettings;
  const { data } = await supabase.from("site_settings").select("data").eq("id", 1).single();
  return data?.data ? { ...defaultSettings, ...data.data } : defaultSettings;
}

export async function saveSettings(settings) {
  if (!supabase) return { demo: true };
  return supabase.from("site_settings").upsert({ id: 1, data: settings });
}
