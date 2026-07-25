"use client";
import { useState } from "react";
import Link from "next/link";
import ScaleSvg, { REFS } from "./ScaleSvg";
import { money } from "@/lib/data";
import { waLink, waSizeMatchMessage } from "@/lib/wa";

const STEPS = [
  { key: "carry", q: "What do you carry on a normal day?", opts: [
    ["minimal", "📱", "Just phone + cards"], ["everyday", "👝", "Phone, wallet + makeup"],
    ["laptop", "💻", "A laptop or tablet"], ["travel", "🧳", "Overnight essentials"]] },
  { key: "wear", q: "How do you love to wear it?", opts: [
    ["crossbody", "🚶‍♀️", "Crossbody, hands-free"], ["shoulder", "👜", "On the shoulder"],
    ["hand", "✋", "In my hand"], ["any", "✨", "I like having options"]] },
  { key: "vibe", q: "And your vibe?", opts: [
    ["minimal", "🤍", "Minimal & sleek"], ["everyday", "🌿", "Everyday practical"],
    ["statement", "💫", "A statement piece"]] },
];

export default function SizeTool({ products }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const [ref, setRef] = useState("laptop");

  const score = (p) => {
    let s = 0;
    if (ans.carry === "minimal" && p.size === "small") s += 3;
    if (ans.carry === "everyday" && p.size === "medium") s += 3;
    if (ans.carry === "everyday" && p.size === "small") s += 1;
    if (ans.carry === "laptop" && p.fits.some(f => f.includes("laptop") || f.includes("Tablet"))) s += 3;
    if (ans.carry === "travel" && p.size === "large") s += 3;
    if (ans.wear !== "any" && p.carry.includes(ans.wear)) s += 2;
    if (ans.vibe === "minimal" && p.size !== "large") s += 1;
    if (ans.vibe === "statement" && p.size === "large") s += 1;
    if (p.variants.some(v => v.stock > 0)) s += 1;
    return s;
  };
  const why = (p) => {
    if (ans.carry === "laptop" && p.fits.some(f => f.includes("laptop"))) return `Fits a ${p.fits.find(f => f.includes("laptop"))} with room to spare`;
    if (ans.carry === "travel" && p.size === "large") return "Roomy enough for a whole weekend away";
    if (ans.wear === "crossbody" && p.carry.includes("crossbody")) return "Sits perfectly crossbody, completely hands-free";
    if (p.size === "small") return `Just right for ${p.fits.slice(0, 2).join(" + ").toLowerCase()}`;
    return "Room for everything you carry, nothing you don't";
  };

  if (step < 3) {
    const s = STEPS[step];
    return (
      <div>
        <div className="text-[.7rem] tracking-[.24em] uppercase text-rose mb-4">Fit finder · {step + 1} of 3</div>
        <div className="flex gap-2 mb-7">
          {[0, 1, 2].map(i => (
            <span key={i} className={`h-1 flex-1 rounded ${i <= step ? "bg-gradient-to-r from-rose to-wine" : "bg-linewarm"}`} />
          ))}
        </div>
        <div className="font-serif text-3xl font-light mb-6">{s.q}</div>
        <div className="grid gap-3">
          {s.opts.map(([v, i, t]) => (
            <button key={v} onClick={() => { setAns({ ...ans, [s.key]: v }); setStep(step + 1); }}
              className="border-[1.5px] border-linewarm bg-cream rounded-xl px-5 py-4 flex items-center gap-4 text-left transition hover:border-wine hover:translate-x-1.5 hover:shadow-md">
              <span className="text-3xl">{i}</span>{t}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const ranked = [...products].sort((a, b) => score(b) - score(a)).slice(0, 3);
  const top = ranked[0];
  return (
    <div>
      <div className="text-[.7rem] tracking-[.24em] uppercase text-rose mb-2">Your match</div>
      <h2 className="font-serif text-3xl font-light mb-1.5">
        The <em className="text-wine">{top.name.replace("The ", "")}</em> is made for you
      </h2>
      <p className="text-mutedwarm text-sm mb-5">Here's how it looks next to the things you already own.</p>

      <div className="bg-cream border border-linewarm rounded-xl p-6">
        <ScaleSvg product={top} refKey={ref} />
        <div className="flex gap-2 flex-wrap justify-center mt-4">
          {Object.entries(REFS).map(([k, r]) => (
            <button key={k} onClick={() => setRef(k)}
              className={`chip ${ref === k ? "!bg-wine !text-white !border-wine" : ""}`}>{r.label}</button>
          ))}
        </div>
      </div>

      <a href={waLink(waSizeMatchMessage(top))} target="_blank" rel="noreferrer"
        className="btn btn-wa w-full justify-center mt-5">
        <span className="text-lg">💬</span> Ask Fatxa about the {top.name.replace("The ", "")}
      </a>

      <h3 className="font-serif text-xl font-light mt-8 mb-3.5">Your top 3</h3>
      {ranked.map((p, i) => (
        <div key={p.id} className="bg-cream border border-linewarm rounded-xl p-4 flex gap-4 items-center mb-3">
          <Link href={`/product/${p.id}`} className="w-[70px] h-[70px] shrink-0 bg-gradient-to-br from-champagne to-[#DCC0A8] rounded-lg grid place-items-center text-4xl">
            {p.emoji}
          </Link>
          <div className="flex-1">
            <span className={`text-[.66rem] text-white px-2.5 py-0.5 rounded-full tracking-[.08em] uppercase inline-block mb-1.5 ${i === 0 ? "bg-wine" : "bg-rose"}`}>
              {i === 0 ? "Perfect match" : "Also lovely"}
            </span>
            <Link href={`/product/${p.id}`}><h4 className="text-lg leading-tight">{p.name}</h4></Link>
            <div className="text-xs text-mutedwarm">{why(p)}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-serif text-wine text-sm mb-2">{money(p.price)}</div>
            <a href={waLink(waSizeMatchMessage(p))} target="_blank" rel="noreferrer"
              className="text-[.68rem] text-[#25823f] border border-[#25823f] rounded-full px-3 py-1.5 hover:bg-[#25823f] hover:text-white transition">
              💬 Order
            </a>
          </div>
        </div>
      ))}
      <button onClick={() => { setStep(0); setAns({}); }} className="btn-ghost btn w-full justify-center mt-4">↺ Start over</button>
    </div>
  );
}
