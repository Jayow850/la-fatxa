import SizeTool from "@/components/SizeTool";
import { getProducts } from "@/lib/supabase";

export const revalidate = 60;
export const metadata = { title: "Find Your Perfect Size — La Fatxa" };

// Standalone shareable page: send la-fatxa.vercel.app/size-guide to anyone
// who asks "which bag fits my stuff?" — the tool answers for you.
export default async function SizeGuide() {
  const products = await getProducts();
  return (
    <main className="pt-28 pb-24">
      <div className="max-w-xl mx-auto px-6">
        <div className="text-center text-[.72rem] tracking-[.3em] uppercase text-rose mb-3">The La Fatxa fit finder</div>
        <h1 className="text-center font-serif font-light text-4xl mb-3">
          Never guess from <em className="text-wine">centimeters</em> again
        </h1>
        <p className="text-center text-mutedwarm mb-10">
          Three questions, then see each bag beside your own phone, laptop and water bottle.
        </p>
        <SizeTool products={products} />
      </div>
    </main>
  );
}
