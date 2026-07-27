"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/lib/favorites";
import { getProducts } from "@/lib/supabase";
import { money } from "@/lib/data";
import { waLink } from "@/lib/wa";

export default function FavoritesPage() {
  const { ids, remove } = useFavorites();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((p) => { setAll(p); setLoading(false); });
  }, []);

  const items = all.filter((p) => ids.includes(p.id));

  const sendToWhatsApp = () => {
    const lines = items.map((p) => `• ${p.name} — ${money(p.price)}`).join("\n");
    const msg = `Hi Fatxa! 💕 I've saved a few favorites — are these available?\n\n${lines}`;
    window.open(waLink(msg), "_blank");
  };

  return (
    <main className="pt-28 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-[.72rem] tracking-[.3em] uppercase text-rose mb-2">Your favorites</div>
        <h1 className="font-serif font-light text-4xl mb-8">Saved for later ♥</h1>

        {loading ? (
          <p className="text-mutedwarm">Loading…</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-mutedwarm mb-6">Nothing saved yet. Tap the heart on any bag, then send them all to Fatxa in one message.</p>
            <Link href="/shop" className="btn">Browse the collection</Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((p) => {
                const img = p.variants?.[0]?.image_url || p.image_url;
                return (
                  <div key={p.id} className="flex items-center gap-4 bg-cream border border-linewarm rounded-xl p-3">
                    <Link href={`/product/${p.id}`} className="w-16 h-16 rounded-lg overflow-hidden shrink-0 grid place-items-center text-2xl bg-gradient-to-br from-champagne to-[#DCC0A8]">
                      {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : p.emoji}
                    </Link>
                    <div className="flex-1">
                      <Link href={`/product/${p.id}`} className="font-serif text-lg">{p.name}</Link>
                      <div className="text-wine text-sm font-serif">{money(p.price)}</div>
                    </div>
                    <button onClick={() => remove(p.id)} className="text-mutedwarm text-xl px-2" title="Remove">×</button>
                  </div>
                );
              })}
            </div>

            <button onClick={sendToWhatsApp} className="btn btn-wa w-full justify-center mt-7 !py-4">
              💬 Send my favorites to Fatxa
            </button>
            <p className="text-center text-[.75rem] text-mutedwarm mt-3">
              Your favorites are saved on this device.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
