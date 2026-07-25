import { getSettings } from "@/lib/settings";
import { waLink, waGeneralMessage } from "@/lib/wa";

export const revalidate = 60;
export const metadata = { title: "FAQ — La Fatxa" };

export default async function FAQ() {
  const settings = await getSettings();
  return (
    <main className="pt-28 pb-24">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center text-[.72rem] tracking-[.3em] uppercase text-rose mb-3">Good to know</div>
        <h1 className="text-center font-serif font-light text-5xl mb-10">Questions, <em className="text-wine">answered</em></h1>
        {settings.faqs.map(([q, a], i) => (
          <div key={i} className="border-b border-linewarm py-5">
            <h3 className="text-lg mb-1.5">{q}</h3>
            <p className="text-mutedwarm text-sm">{a}</p>
          </div>
        ))}
        <div className="text-center mt-12">
          <a href={waLink(waGeneralMessage)} target="_blank" rel="noreferrer" className="btn btn-wa">
            <span className="text-lg">💬</span> Ask anything on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
