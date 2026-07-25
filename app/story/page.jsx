import { getSettings } from "@/lib/settings";

export const revalidate = 60;
export const metadata = { title: "Our Story — La Fatxa" };

export default async function Story() {
  const s = await getSettings();
  if (!s.showStory) return (
    <main className="pt-40 pb-24 text-center text-mutedwarm">
      <p>This page isn't available right now.</p>
    </main>
  );
  return (
    <main className="pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        <div className="aspect-[4/5] rounded-[8px_8px_160px_8px] grid place-items-center text-8xl relative bg-gradient-to-br from-rose to-wine shadow-2xl shadow-plum/40">
          👜
          <div className="absolute bottom-6 right-6 w-24 h-24 border border-white/50 rounded-full grid place-items-center text-center font-serif italic text-xs text-white leading-tight -rotate-6">
            La Fatxa<br />by hand
          </div>
        </div>
        <div>
          <div className="text-[.72rem] tracking-[.3em] uppercase text-rose mb-3">Our story</div>
          <h1 className="font-serif font-light text-5xl mb-5">{s.storyTitle}</h1>
          {s.storyText.split("\n").filter(Boolean).map((para, i) => (
            <p key={i} className="text-mutedwarm text-lg mb-4">{para}</p>
          ))}
          <div className="font-serif italic text-3xl text-wine mt-5">{s.storySig}</div>
        </div>
      </div>
    </main>
  );
}
