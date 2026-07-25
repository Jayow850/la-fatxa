"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default function ShopClient({ products }) {
  const params = useSearchParams();
  const cats = ["All", ...Array.from(new Set(products.map(p => p.cat)))];
  const [cat, setCat] = useState(params.get("cat") || "All");
  const [price, setPrice] = useState("All");

  const shown = useMemo(() => products.filter(p =>
    (cat === "All" || p.cat === cat) &&
    (price === "All" ||
      (price === "Under 4k" && p.price < 4000) ||
      (price === "4k–7k" && p.price >= 4000 && p.price <= 7000) ||
      (price === "Over 7k" && p.price > 7000))
  ), [products, cat, price]);

  return (
    <main className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center text-[.72rem] tracking-[.3em] uppercase text-rose mb-3">The collection</div>
        <h1 className="text-center font-serif font-light text-5xl mb-3">
          Made in small batches, <em className="text-wine">gone quickly</em>
        </h1>
        <p className="text-center text-mutedwarm max-w-lg mx-auto mb-10">
          Live stock — when it says two left, it means two. Tap any bag for everything you'd normally have to ask.
        </p>
        <div className="flex gap-2.5 flex-wrap justify-center mb-4">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`chip ${cat === c ? "chip-on" : ""}`}>{c}</button>
          ))}
        </div>
        <div className="flex gap-2.5 flex-wrap justify-center mb-12">
          {["All", "Under 4k", "4k–7k", "Over 7k"].map(pr => (
            <button key={pr} onClick={() => setPrice(pr)} className={`chip !text-[.7rem] ${price === pr ? "chip-on" : ""}`}>{pr}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-7">
          {shown.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
        {!shown.length && <p className="text-center text-mutedwarm py-16">No bags match those filters — try widening them.</p>}
      </div>
    </main>
  );
}
