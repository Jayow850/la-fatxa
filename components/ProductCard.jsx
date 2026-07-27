"use client";
import Link from "next/link";
import { useState } from "react";
import { money } from "@/lib/data";
import { useFavorites } from "@/lib/favorites";

const badgeText = { new: "New in", best: "Best seller", ltd: "Limited" };
const badgeStyle = {
  new: "bg-cream/95 text-wine",
  best: "bg-wine text-white",
  ltd: "bg-gold text-white",
};

export default function ProductCard({ p }) {
  const [vi, setVi] = useState(0);
  const { has, toggle } = useFavorites();
  const wished = has(p.id);
  const v = p.variants[vi] || p.variants[0];
  const img = v?.image_url || p.image_url;

  const inStock = p.variants.filter((x) => x.stock > 0);
  const low = inStock.some((x) => x.stock <= 2);
  const soldOut = inStock.length === 0;

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-linewarm/70 transition hover:shadow-lg hover:shadow-plum/10 flex flex-col">
      {/* IMAGE — fills full width, edge to edge, square (Taobao style) */}
      <Link href={`/product/${p.id}`} className="block aspect-square relative overflow-hidden bg-gradient-to-br from-champagne to-[#DCC0A8]">
        <div className="w-full h-full grid place-items-center text-5xl transition duration-500 group-hover:scale-105">
          {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : p.emoji}
        </div>
        {p.badge && (
          <div className={`absolute top-2 left-2 text-[.55rem] tracking-[.08em] uppercase px-2.5 py-1 rounded-full font-medium backdrop-blur ${badgeStyle[p.badge]}`}>
            {badgeText[p.badge]}
          </div>
        )}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(p.id); }}
          title={wished ? "Remove from favorites" : "Save to favorites"}
          className="absolute top-2 right-2 w-8 h-8 rounded-full grid place-items-center text-[.85rem] backdrop-blur transition"
          style={{ background: wished ? "#C8798A" : "rgba(251,245,240,.85)", color: wished ? "#fff" : "#241A1C" }}
        >
          {wished ? "♥" : "♡"}
        </button>
        {soldOut ? (
          <div className="absolute inset-0 bg-cream/55 grid place-items-center">
            <span className="font-serif italic text-mutedwarm text-sm">This batch is gone</span>
          </div>
        ) : low ? (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-wine/90 text-white text-[.55rem] tracking-wide uppercase px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot" /> Almost gone
          </div>
        ) : null}
      </Link>

      {/* INFO BELOW — left-aligned, tight, Taobao style */}
      <div className="px-2.5 py-2.5 flex flex-col gap-1 flex-1">
        {/* price first + big, like the reference */}
        <div className="flex items-baseline gap-1.5">
          <span className="font-serif text-wine text-lg leading-none">{money(p.price)}</span>
          {p.was && <span className="text-[.7rem] text-mutedwarm line-through">{money(p.was)}</span>}
        </div>

        {/* name */}
        <Link href={`/product/${p.id}`}>
          <h3 className="text-[.85rem] leading-snug text-ink line-clamp-2">{p.name}</h3>
        </Link>

        {/* subtitle */}
        {p.subtitle && <p className="text-[.68rem] text-mutedwarm leading-tight line-clamp-1">{p.subtitle}</p>}

        {/* color dots */}
        <div className="flex gap-1.5 mt-0.5 flex-wrap items-center">
          {p.variants.map((vv, i) => (
            <button
              key={vv.name + i}
              onClick={() => setVi(i)}
              title={vv.stock === 0 ? `${vv.name} - gone` : vv.name}
              className="w-[15px] h-[15px] rounded-full transition hover:scale-110"
              style={{
                background: vv.hex,
                opacity: vv.stock === 0 ? 0.3 : 1,
                boxShadow: i === vi ? "0 0 0 1.5px #fff, 0 0 0 3px #7A2E43" : "0 0 0 1px rgba(0,0,0,.12)",
              }}
            />
          ))}
          <span className="text-[.64rem] text-mutedwarm ml-0.5">{v?.name}</span>
        </div>
      </div>
    </div>
  );
}
