import Link from "next/link";
import { waLink, waGeneralMessage } from "@/lib/wa";

export default function Footer() {
  return (
    <footer className="bg-plum text-champagne pt-16 pb-7 text-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 pb-10 border-b border-champagne/20">
          <div>
            <div className="font-serif italic text-lg text-cream mb-3">La <em>Fatxa</em></div>
            <p className="opacity-75 max-w-[260px]">Handcrafted full-grain leather bags, made in small batches in Nairobi. Carried for years, not seasons.</p>
          </div>
          <div>
            <h5 className="font-sans uppercase tracking-[.1em] text-[.72rem] mb-4 opacity-70">Shop</h5>
            {["Totes","Crossbody","Clutches","Mini Bags"].map(c => (
              <Link key={c} href={`/shop?cat=${encodeURIComponent(c)}`} className="block mb-2 opacity-80 hover:opacity-100">{c}</Link>
            ))}
          </div>
          <div>
            <h5 className="font-sans uppercase tracking-[.1em] text-[.72rem] mb-4 opacity-70">Help</h5>
            <Link href="/story" className="block mb-2 opacity-80 hover:opacity-100">Our story</Link>
            <Link href="/faq" className="block mb-2 opacity-80 hover:opacity-100">FAQ</Link>
            <a href={waLink(waGeneralMessage)} target="_blank" rel="noreferrer" className="block mb-2 opacity-80 hover:opacity-100">WhatsApp us</a>
          </div>
          <div>
            <h5 className="font-sans uppercase tracking-[.1em] text-[.72rem] mb-4 opacity-70">Promise</h5>
            <span className="block mb-2 opacity-80">14-day free returns</span>
            <span className="block mb-2 opacity-80">Nairobi 1–2 day delivery</span>
            <span className="block mb-2 opacity-80">Real leather, always</span>
          </div>
        </div>
        <div className="pt-6 flex flex-wrap justify-between gap-3 opacity-60 text-xs">
          <span>© {new Date().getFullYear()} La Fatxa. Made with care in Nairobi.</span>
          <span>Instagram · TikTok · WhatsApp</span>
        </div>
      </div>
    </footer>
  );
}
