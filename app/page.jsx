import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/supabase";
import { getSettings } from "@/lib/settings";

export const revalidate = 60; // stock refreshes at most every minute

export default async function Home() {
  const products = await getProducts();
  const settings = await getSettings();
  const visibleCats = settings.categories.filter(c => c.visible).map(c => c.name);
  const visible = products.filter(p => visibleCats.includes(p.cat));
  const newIn = visible.filter(p => p.badge === "new").slice(0, 3);
  const best = visible.filter(p => p.badge === "best").slice(0, 3);

  return (
    <main>
      {/* HERO */}
      <section className="min-h-screen flex items-center relative overflow-hidden"
        style={{ background: "radial-gradient(120% 90% at 80% 20%, #F3DCD0 0%, #F6ECE6 45%, #FBF5F0 100%)" }}>
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-10 items-center w-full">
          <div>
            <div className="text-[.72rem] tracking-[.3em] uppercase text-wine mb-6 flex items-center gap-3">
              <span className="w-9 h-px bg-wine" /> Handcrafted leather · Nairobi
            </div>
            <h1 className="font-serif font-light text-5xl md:text-7xl leading-[.98]">
              {settings.heroLine1} <em className="text-wine">{settings.heroEm}</em> {settings.heroLine2}
            </h1>
            <p className="text-mutedwarm mt-7 mb-8 max-w-md text-lg">
              {settings.heroSub}
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <Link href="/shop" className="btn">Explore the collection</Link>
              <Link href="/size-guide" className="btn btn-ghost">Find your size</Link>
            </div>
          </div>
          <div className="relative aspect-[3/4] max-w-sm mx-auto w-full">
            <div className="absolute inset-0 rounded-arch grid place-items-center overflow-hidden bg-gradient-to-br from-champagne to-[#D9B99E] shadow-2xl shadow-plum/30">
              {settings.heroImg
                ? <img src={settings.heroImg} alt="La Fatxa" className="w-full h-full object-cover" />
                : <div className="text-[10rem] animate-floaty drop-shadow-2xl">👜</div>}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 overflow-hidden whitespace-nowrap border-t border-linewarm py-3 bg-cream/85 backdrop-blur-sm z-10">
          <div className="inline-block animate-[marq_28s_linear_infinite] font-serif italic text-wine">
            {[...settings.marquee, ...settings.marquee].map((t, i) => (
              <span key={i} className="mx-6 opacity-60">{t} ✦</span>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-[.72rem] tracking-[.3em] uppercase text-rose mb-3">Just landed</div>
          <h2 className="text-center font-serif font-light text-4xl mb-3">New <em className="text-wine">arrivals</em></h2>
          <p className="text-center text-mutedwarm max-w-lg mx-auto mb-12">Small batches. When they're gone, they're gone.</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-7">
            {newIn.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-24 bg-shell">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center text-[.72rem] tracking-[.3em] uppercase text-rose mb-3">Proven favorites</div>
          <h2 className="text-center font-serif font-light text-4xl mb-3">Best <em className="text-wine">sellers</em></h2>
          <p className="text-center text-mutedwarm max-w-lg mx-auto mb-12">The bags our customers come back for — and buy again as gifts.</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-7">
            {best.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
          <div className="text-center mt-12">
            <Link href="/shop" className="btn">View the whole collection</Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-24 bg-shell text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-[.72rem] tracking-[.3em] uppercase text-rose mb-3">First look</div>
          <h2 className="font-serif font-light text-4xl mb-3">New drops <em className="text-wine">sell out fast</em></h2>
          <p className="text-mutedwarm">Get them before they hit the shop. No spam, only the good stuff.</p>
          <form className="flex max-w-md mx-auto mt-7 bg-cream border border-linewarm rounded-full p-1.5 shadow-lg">
            <input type="email" required placeholder="your@email.com"
              className="flex-1 px-5 py-3 bg-transparent focus:outline-none text-sm" />
            <button type="submit" className="btn !px-6 !py-3">Notify me</button>
          </form>
        </div>
      </section>
    </main>
  );
}
