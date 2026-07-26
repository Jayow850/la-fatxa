import Link from "next/link";
import { waLink, waGeneralMessage } from "@/lib/wa";

export default function Footer() {
  return (
    <footer className="bg-plum text-champagne pt-10 pb-5 text-sm">
      <div className="max-w-6xl mx-auto px-5">
        {/* brand line — compact */}
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-8 h-8 rounded-full border border-champagne/70 grid place-items-center font-serif italic text-sm shrink-0">F</span>
          <span className="font-serif italic text-lg text-cream">La <em>Fatxa</em></span>
        </div>

        {/* columns side-by-side even on mobile */}
        <div className="grid grid-cols-3 gap-4 pb-7 border-b border-champagne/20">
          <div>
            <h5 className="font-sans uppercase tracking-[.1em] text-[.62rem] mb-2.5 opacity-60">Shop</h5>
            {["Totes","Crossbody","Clutches","Mini Bags"].map(c => (
              <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} className="block mb-1.5 text-[.8rem] opacity-80 hover:opacity-100">{c}</Link>
            ))}
          </div>
          <div>
            <h5 className="font-sans uppercase tracking-[.1em] text-[.62rem] mb-2.5 opacity-60">Help</h5>
            <Link href="/story" className="block mb-1.5 text-[.8rem] opacity-80 hover:opacity-100">Our story</Link>
            <Link href="/faq" className="block mb-1.5 text-[.8rem] opacity-80 hover:opacity-100">FAQ</Link>
            <a href={waLink(waGeneralMessage)} target="_blank" rel="noreferrer" className="block mb-1.5 text-[.8rem] opacity-80 hover:opacity-100">WhatsApp us</a>
          </div>
          <div>
            <h5 className="font-sans uppercase tracking-[.1em] text-[.62rem] mb-2.5 opacity-60">Promise</h5>
            <span className="block mb-1.5 text-[.8rem] opacity-80">14-day returns</span>
            <span className="block mb-1.5 text-[.8rem] opacity-80">Nairobi 1–2 days</span>
            <span className="block mb-1.5 text-[.8rem] opacity-80">Real leather</span>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap justify-between gap-2 opacity-55 text-[.7rem]">
          <span>© {new Date().getFullYear()} La Fatxa · Nairobi</span>
          <span>Instagram · TikTok · WhatsApp</span>
        </div>
      </div>
    </footer>
  );
}
