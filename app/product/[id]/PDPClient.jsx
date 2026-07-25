"use client";
import { useState } from "react";
import { money, stockState } from "@/lib/data";
import { waLink, waOrderMessage } from "@/lib/wa";
import SizeTool from "@/components/SizeTool";

const badgeText = { new: "New in", best: "Best seller", ltd: "Almost gone" };

export default function PDPClient({ product: p, allProducts }) {
  const firstIn = p.variants.findIndex(v => v.stock > 0);
  const [vi, setVi] = useState(firstIn >= 0 ? firstIn : 0);
  const [showTool, setShowTool] = useState(false);
  const v = p.variants[vi];
  const st = stockState(v);

  // Customers never see counts — only availability states with quiet urgency.
  const stockBox =
    st === "out" ? { cls: "bg-black/5 text-[#a89e98]", msg: `The ${v.name} from this batch is gone — ask Fatxa when the next run arrives` }
    : st === "low" ? { cls: "bg-gradient-to-r from-rose/15 to-wine/10 text-wine border border-wine/15", msg: `The ${v.name} is almost gone from this batch — reserve it before it disappears` }
    : { cls: "bg-mutedwarm/10 text-mutedwarm", msg: `The ${v.name} is available from the current batch` };

  return (
    <main className="pt-28 pb-32">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        {/* GALLERY */}
        <div>
          <div className="aspect-square rounded-lg grid place-items-center text-[9rem] relative overflow-hidden bg-gradient-to-br from-champagne to-[#DCC0A8]">
            {(v.image_url || p.image_url)
              ? <img src={v.image_url || p.image_url} alt={`${p.name} in ${v.name}`} className="w-full h-full object-cover rounded-lg" />
              : p.emoji}
            {p.badge && (
              <div className="absolute top-4 left-4 bg-wine text-white text-[.62rem] tracking-[.14em] uppercase px-3 py-1.5 rounded-full">
                {badgeText[p.badge]}
              </div>
            )}
          </div>
          <div className="flex gap-2.5 mt-3.5">
            {["front", "side", "inside", "detail"].map((t, i) => (
              <div key={t} title={t}
                className={`w-16 h-16 rounded-md grid place-items-center text-2xl cursor-pointer bg-gradient-to-br from-champagne to-[#DCC0A8] border-[1.5px] ${i === 0 ? "border-wine" : "border-transparent"}`}>
                {p.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <div className="flex items-center gap-2 text-sm text-mutedwarm mb-1.5">
            <span className="text-gold tracking-[2px]">★★★★★</span> {p.rating} · {p.revs} reviews
          </div>
          <h1 className="font-serif font-light text-4xl">{p.name}</h1>
          <div className="text-mutedwarm mt-1">{p.subtitle}</div>
          <div className="font-serif text-2xl text-wine my-3.5">
            {money(p.price)}
            {p.was && <span className="text-sm text-mutedwarm line-through ml-2 font-sans">{money(p.was)}</span>}
          </div>
          <div className="text-sm text-mutedwarm">{p.material}</div>

          {/* VARIANTS */}
          <div className="flex gap-2.5 my-5 flex-wrap">
            {p.variants.map((vv, i) => (
              <button key={vv.name} onClick={() => vv.stock > 0 && setVi(i)} disabled={vv.stock === 0}
                className={`rounded-full px-4 py-2 text-sm flex items-center gap-2 border-[1.5px] transition
                  ${i === vi ? "border-wine bg-white" : "border-linewarm bg-cream"}
                  ${vv.stock === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
                <span className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ background: vv.hex }} />
                {vv.name}{vv.stock === 0 ? " · gone" : ""}
              </button>
            ))}
          </div>

          {/* LIVE STOCK */}
          <div className={`px-4 py-3.5 rounded-lg text-sm my-4 flex items-center gap-2.5 ${stockBox.cls}`}>
            {st === "low" && <span className="w-2 h-2 rounded-full bg-wine animate-pulse-dot shrink-0" />}
            {stockBox.msg}
          </div>

          {/* ORDER */}
          <a href={st === "out" ? undefined : waLink(waOrderMessage(p, v))} target="_blank" rel="noreferrer"
            className={`btn btn-wa w-full justify-center !py-4 ${st === "out" ? "opacity-45 pointer-events-none" : ""}`}>
            <span className="text-lg">💬</span>
            {st === "out" ? "Ask when the next batch arrives" : "Order on WhatsApp"}
          </a>
          <p className="text-center text-xs text-mutedwarm mt-2.5">
            Opens WhatsApp with your bag and color pre-filled — Fatxa confirms and holds it for you.
          </p>

          {/* SPECS */}
          <Spec h="What fits inside">
            <div className="grid grid-cols-2 gap-2 mt-1">
              {p.fits.map(f => <span key={f} className="text-sm flex items-center gap-2"><span className="text-[#25823f]">✓</span>{f}</span>)}
            </div>
          </Spec>
          <Spec h="Dimensions">{p.dim_cm} &nbsp;·&nbsp; {p.dim_in}</Spec>
          <Spec h="Care">{p.care}</Spec>
          <Spec h="The promise">Free returns within 14 days · Nairobi delivery 1–2 days · Real full-grain leather, always.</Spec>

          <button onClick={() => setShowTool(s => !s)} className="btn btn-ghost w-full justify-center mt-4">
            {showTool ? "Hide the size finder" : "Not sure it fits your things? Find your size →"}
          </button>
          {showTool && (
            <div className="mt-6 border border-linewarm rounded-xl p-6 bg-shell/50">
              <SizeTool products={allProducts} />
            </div>
          )}
        </div>
      </div>

      {/* STICKY ORDER BAR */}
      {st !== "out" && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur border-t border-linewarm md:hidden">
          <div className="px-5 py-3 flex items-center justify-between gap-3">
            <div>
              <div className="font-serif text-sm leading-tight">{p.name}</div>
              <div className="text-wine text-sm font-serif">{money(p.price)} · {v.name}</div>
            </div>
            <a href={waLink(waOrderMessage(p, v))} target="_blank" rel="noreferrer" className="btn btn-wa !px-5 !py-2.5 shrink-0">
              💬 Order
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

function Spec({ h, children }) {
  return (
    <div className="border-t border-linewarm py-4 text-sm mt-1">
      <h4 className="font-sans font-medium text-[.7rem] tracking-[.14em] uppercase text-mutedwarm mb-2">{h}</h4>
      {children}
    </div>
  );
}
