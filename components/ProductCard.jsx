"use client";
import Link from "next/link";
import { useState } from "react";
import StockBadge from "./StockBadge";
import { money } from "@/lib/data";

const badgeStyle = { new: "bg-cream text-wine", best: "bg-wine text-white", ltd: "bg-gold text-white" };
const badgeText = { new: "New in", best: "Best seller", ltd: "Limited" };

export default function ProductCard({ p }) {
  const [vi, setVi] = useState(0);
  const v = p.variants[vi] || p.variants[0];
  const img = v?.image_url || p.image_url;
  return (
    <div className="group bg-cream border border-linewarm rounded-lg overflow-hidden transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-plum/20 relative">
      <Link href={`/product/${p.id}`} className="block aspect-square relative overflow-hidden bg-gradient-to-br from-champagne to-[#DCC0A8]">
        <div className="w-full h-full grid place-items-center text-6xl sm:text-7xl transition duration-500 group-hover:scale-105">
          {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : p.emoji}
        </div>
        {p.badge && <div className={`absolute top-3 left-3 text-[.56rem] tracking-[.12em] uppercase px-3 py-1.5 rounded-full font-medium ${badgeStyle[p.badge]}`}>{badgeText[p.badge]}</div>}
      </Link>
      <div className="p-4 sm:p-5">
        <Link href={`/product/${p.id}`}><h3 className="text-base sm:text-lg leading-tight">{p.name}</h3></Link>
        <div className="font-serif text-wine text-sm sm:text-base">{money(p.price)}</div>
        <StockBadge variants={p.variants} />
        {/* clickable color swatches — swap the image */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {p.variants.map((vv, i) => (
            <button key={vv.name + i} onClick={() => setVi(i)} title={vv.name}
              className="w-[17px] h-[17px] rounded-full transition"
              style={{ background: vv.hex, opacity: vv.stock === 0 ? 0.3 : 1,
                boxShadow: i === vi ? "0 0 0 2px #FBF5F0, 0 0 0 3.5px #7A2E43" : "0 0 0 1px rgba(0,0,0,.12)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
