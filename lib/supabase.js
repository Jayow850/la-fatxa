import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Falls back to null so the site runs on seed data before Supabase is configured.
export const supabase = url && key ? createClient(url, key) : null;

/** Fetch products with variants; falls back to local seed data if Supabase isn't set up. */
export async function getProducts() {
  if (!supabase) {
    const { seedProducts } = await import("./data");
    return seedProducts;
  }
  const { data, error } = await supabase
    .from("products")
    .select("*, variants(*)")
    .order("created_at", { ascending: false });
  if (error || !data?.length) {
    const { seedProducts } = await import("./data");
    return seedProducts;
  }
  return data;
}
