import { Suspense } from "react";
import ShopClient from "./ShopClient";
import { getProducts } from "@/lib/supabase";
import { getSettings } from "@/lib/settings";

export const revalidate = 60;
export const metadata = { title: "The Collection — La Fatxa" };

export default async function Shop() {
  const products = await getProducts();
  const settings = await getSettings();
  const visibleCats = settings.categories.filter(c => c.visible).map(c => c.name);
  const shown = products.filter(p => visibleCats.includes(p.cat));
  return (
    <Suspense fallback={<main className="pt-28 pb-24 text-center text-mutedwarm">Loading the collection…</main>}>
      <ShopClient products={shown} />
    </Suspense>
  );
}
