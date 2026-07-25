"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { seedProducts } from "@/lib/data";
import { defaultSettings, getSettings, saveSettings } from "@/lib/settings";

/**
 * FATXA'S STUDIO — the private dashboard.
 *
 * Access: type /admin in the address bar. It is never linked anywhere on the site,
 * so customers will not find it. With Supabase configured, sign in with the user
 * you created for Fatxa (Supabase Dashboard → Authentication → Add user). Without
 * Supabase, it runs in demo mode (edits are not persisted).
 *
 * She can edit EVERYTHING here: names, prices, stories, materials, dimensions,
 * what-fits lists, care notes, tags, categories — and colors are unlimited: type
 * any color name in the world and pick its exact shade. Stock numbers live ONLY
 * here; the storefront shows customers just "Almost gone" or nothing.
 */

const emptyProduct = () => ({
  id: "b" + Math.random().toString(36).slice(2, 8),
  name: "", subtitle: "", price: 0, was: null, cat: "Totes", emoji: "👜", badge: "",
  material: "", dim_cm: "30 × 22 × 10 cm", dim_in: "11.8 × 8.7 × 3.9 in",
  fits: [], care: "", size: "medium", carry: ["shoulder"], rating: 5.0, revs: 0,
  variants: [{ name: "Camel", hex: "#C68C5A", stock: 3 }],
});

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [demo, setDemo] = useState(false);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("collection"); // collection | site
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => { getSettings().then(setSettings); }, []);
  async function persistSettings(next) {
    setSettings(next);
    const res = await saveSettings(next);
    flash(res?.demo ? "Site updated (demo mode)" : res?.error ? "Save failed: " + res.error.message : "Site updated — live within a minute");
  }

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) { setAuthed(true); load(); }
    });
  }, []);

  async function load() {
    if (!supabase) { setProducts(structuredClone(seedProducts)); return; }
    const { data } = await supabase.from("products").select("*, variants(*)").order("created_at");
    setProducts(data?.length ? data : structuredClone(seedProducts));
  }

  async function signIn(e) {
    e.preventDefault();
    if (!supabase) { setDemo(true); setAuthed(true); load(); return; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
    else { setAuthed(true); load(); }
  }

  function flash(m) { setMsg(m); setTimeout(() => setMsg(""), 3200); }

  async function saveProduct(prod) {
    setProducts(ps => {
      const exists = ps.some(p => p.id === prod.id);
      return exists ? ps.map(p => (p.id === prod.id ? prod : p)) : [...ps, prod];
    });
    setEditing(null);
    if (supabase && !demo) {
      const { variants, ...fields } = prod;
      const { error: e1 } = await supabase.from("products").upsert(fields);
      if (e1) return flash("Save failed: " + e1.message);
      await supabase.from("variants").delete().eq("product_id", prod.id);
      const { error: e2 } = await supabase.from("variants").insert(
        variants.map(v => ({ product_id: prod.id, name: v.name, hex: v.hex, stock: v.stock }))
      );
      if (e2) return flash("Variants failed: " + e2.message);
      flash(`Saved — "${prod.name}" is live (site updates within a minute)`);
    } else {
      flash(`Saved — "${prod.name}" (demo mode, not persisted)`);
    }
  }

  async function deleteProduct(id) {
    const p = products.find(x => x.id === id);
    if (!confirm(`Delete "${p?.name}" from the shop? This can't be undone.`)) return;
    setProducts(ps => ps.filter(x => x.id !== id));
    if (supabase && !demo) await supabase.from("products").delete().eq("id", id);
    flash("Deleted — removed from the live site");
  }

  async function quickStock(pid, idx, val) {
    const n = Math.max(0, parseInt(val) || 0);
    let variant;
    setProducts(ps => ps.map(p => {
      if (p.id !== pid) return p;
      variant = p.variants[idx];
      return { ...p, variants: p.variants.map((v, i) => (i !== idx ? v : { ...v, stock: n })) };
    }));
    if (supabase && !demo && variant?.id) {
      await supabase.from("variants").update({ stock: n }).eq("id", variant.id);
    }
  }

  /* ---------- LOGIN ---------- */
  if (!authed) return (
    <main className="pt-36 pb-24 min-h-screen">
      <div className="max-w-sm mx-auto px-6 text-center">
        <div className="text-[.72rem] tracking-[.3em] uppercase text-rose mb-3">Private · Fatxa only</div>
        <h1 className="font-serif font-light text-4xl mb-8">Fatxa's Studio</h1>
        <form onSubmit={signIn} className="grid gap-3">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
            className="border border-linewarm rounded-lg px-4 py-3 bg-cream text-sm" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
            className="border border-linewarm rounded-lg px-4 py-3 bg-cream text-sm" />
          <button type="submit" className="btn justify-center">Enter the studio</button>
        </form>
        {!supabase && <p className="text-xs text-mutedwarm mt-4">Supabase not configured yet — signing in opens demo mode.</p>}
        {msg && <p className="text-xs text-wine mt-3">{msg}</p>}
      </div>
    </main>
  );

  /* ---------- EDIT FORM ---------- */
  if (editing) return (
    <ProductForm initial={editing} onSave={saveProduct} onCancel={() => setEditing(null)} />
  );

  /* ---------- DASHBOARD ---------- */
  const totalUnits = products.reduce((s, p) => s + p.variants.reduce((a, v) => a + Number(v.stock), 0), 0);
  const low = products.flatMap(p => p.variants.filter(v => v.stock > 0 && v.stock <= 2).map(v => ({ p, v })));
  const gone = products.flatMap(p => p.variants.filter(v => v.stock === 0).map(v => ({ p, v })));

  return (
    <main className="pt-28 pb-24 min-h-screen bg-[#F3EBE4]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[.72rem] tracking-[.3em] uppercase text-rose mb-2">Fatxa's Studio{demo ? " · demo mode" : ""}</div>
            <h1 className="font-serif font-light text-4xl">Your collection</h1>
            <p className="text-mutedwarm text-sm mt-1">
              Everything here is yours alone — customers only ever see "Almost gone", never the numbers.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setTab("collection")} className={`chip ${tab === "collection" ? "chip-on" : ""}`}>Collection</button>
            <button onClick={() => setTab("site")} className={`chip ${tab === "site" ? "chip-on" : ""}`}>My site</button>
            <button onClick={() => setEditing(emptyProduct())} className="btn !bg-wine !py-2.5">+ New bag</button>
          </div>
        </div>

        {tab === "site" && <SiteEditor settings={settings} onSave={persistSettings} />}
        {tab === "site" ? null : null}

        {tab === "collection" && (<>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-8">
          <Stat n={products.length} label="Bags in the shop" />
          <Stat n={totalUnits} label="Units in stock" />
          <Stat n={low.length} label="Colors almost gone" warn={low.length > 0} />
          <Stat n={gone.length} label="Colors sold out" />
        </div>

        {(low.length > 0 || gone.length > 0) && (
          <div className="bg-cream border border-linewarm rounded-xl p-5 mb-8">
            <h3 className="font-serif text-lg mb-3">Needs your attention</h3>
            {low.map(({ p, v }) => (
              <div key={p.id + v.name} className="flex items-center gap-3 py-2 border-b border-linewarm text-sm">
                <span className="w-4 h-4 rounded-full shadow-sm shrink-0" style={{ background: v.hex }} />
                <b className="font-medium">{p.name}</b> · {v.name}
                <span className="ml-auto text-wine">● Only {v.stock} left</span>
                <button onClick={() => setEditing(structuredClone(p))} className="chip !py-1 !px-3 !text-[.7rem]">Restock</button>
              </div>
            ))}
            {gone.map(({ p, v }) => (
              <div key={p.id + v.name + "g"} className="flex items-center gap-3 py-2 border-b border-linewarm text-sm opacity-70">
                <span className="w-4 h-4 rounded-full shadow-sm shrink-0" style={{ background: v.hex }} />
                <b className="font-medium">{p.name}</b> · {v.name}
                <span className="ml-auto">Sold out</span>
                <button onClick={() => setEditing(structuredClone(p))} className="chip !py-1 !px-3 !text-[.7rem]">Restock</button>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-3">
          {products.map(p => (
            <div key={p.id} className="bg-cream border border-linewarm rounded-xl p-4 flex flex-wrap gap-4 items-center">
              <div className="w-14 h-14 rounded-lg grid place-items-center text-3xl shrink-0 bg-gradient-to-br from-champagne to-[#DCC0A8]">{p.emoji || "👜"}</div>
              <div className="min-w-[170px] flex-1">
                <div className="font-serif text-lg">{p.name || <em className="text-mutedwarm">Untitled</em>}</div>
                <div className="text-xs text-mutedwarm">
                  {p.cat} · KSh {Number(p.price).toLocaleString()}
                  {p.badge ? ` · ${p.badge === "best" ? "Best seller" : p.badge === "new" ? "New in" : "Limited"}` : ""}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                {p.variants.map((v, i) => (
                  <div key={v.name + i} className="flex items-center gap-1.5 bg-white border border-linewarm rounded-full pl-1.5 pr-2 py-1">
                    <span title={v.name} className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ background: v.hex }} />
                    <input type="number" min="0" value={v.stock}
                      onChange={e => quickStock(p.id, i, e.target.value)}
                      className={`w-11 bg-transparent text-center text-sm focus:outline-none ${v.stock === 0 ? "text-[#b0a99f]" : v.stock <= 2 ? "text-wine" : ""}`} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(structuredClone(p))} className="chip !text-[.72rem]">Edit everything</button>
                <button onClick={() => deleteProduct(p.id)} className="chip !text-[.72rem] !text-wine !border-wine/30">Delete</button>
              </div>
            </div>
          ))}
        </div>

        </>)}

        {msg && <p className="text-sm text-wine mt-6">{msg}</p>}
      </div>
    </main>
  );
}

/* ================= FULL PRODUCT EDITOR ================= */
function ProductForm({ initial, onSave, onCancel }) {
  const [p, setP] = useState(initial);
  const set = (k, val) => setP(x => ({ ...x, [k]: val }));
  const setVar = (i, k, val) => setP(x => ({ ...x, variants: x.variants.map((v, j) => (j !== i ? v : { ...v, [k]: val })) }));
  const addVar = () => setP(x => ({ ...x, variants: [...x.variants, { name: "", hex: "#C8798A", stock: 1 }] }));
  const rmVar = i => setP(x => ({ ...x, variants: x.variants.filter((_, j) => j !== i) }));
  const toggleCarry = c => setP(x => ({ ...x, carry: x.carry.includes(c) ? x.carry.filter(y => y !== c) : [...x.carry, c] }));
  const canSave = p.name.trim() && p.price > 0 && p.variants.length > 0 && p.variants.every(v => v.name.trim());

  return (
    <main className="pt-28 pb-24 min-h-screen bg-[#F3EBE4]">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif font-light text-3xl">Editing · <em className="text-wine">{p.name || "New bag"}</em></h1>
          <button onClick={onCancel} className="chip">Cancel</button>
        </div>

        <FormCard title="The basics">
          <Field label="Bag name"><input className="inp" value={p.name} onChange={e => set("name", e.target.value)} placeholder="The Nala Tote" /></Field>
          <Field label="Main photo URL (used when a color has no photo — upload to the 'bags' bucket in Supabase Storage, paste the public URL here)">
            <input className="inp" value={p.image_url || ""} onChange={e => set("image_url", e.target.value || null)} placeholder="https://…supabase.co/storage/v1/object/public/bags/amara.jpg" />
          </Field>
          <Field label="One-line story (shown under the name)"><input className="inp" value={p.subtitle || ""} onChange={e => set("subtitle", e.target.value)} placeholder="The one that goes everywhere with you" /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Price (KSh)"><input className="inp" type="number" min="0" value={p.price} onChange={e => set("price", parseInt(e.target.value) || 0)} /></Field>
            <Field label="Was price (optional)"><input className="inp" type="number" min="0" value={p.was || ""} onChange={e => set("was", e.target.value ? parseInt(e.target.value) : null)} placeholder="—" /></Field>
            <Field label="Emoji (until photos)"><input className="inp" value={p.emoji || ""} onChange={e => set("emoji", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select className="inp" value={p.cat} onChange={e => set("cat", e.target.value)}>
                {["Totes", "Crossbody", "Clutches", "Mini Bags"].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Shop tag">
              <select className="inp" value={p.badge || ""} onChange={e => set("badge", e.target.value)}>
                <option value="">None</option><option value="new">New in</option><option value="best">Best seller</option><option value="ltd">Limited</option>
              </select>
            </Field>
          </div>
        </FormCard>

        <FormCard title="Colors & stock"
          note="Type ANY color name — Rose Gold, Emerald, Sunset Orange, anything in the world — and pick its exact shade with the swatch. Stock numbers are for your eyes only.">
          {p.variants.map((v, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <input type="color" value={v.hex} onChange={e => setVar(i, "hex", e.target.value)}
                className="w-11 h-10 rounded-lg border border-linewarm cursor-pointer bg-white p-0.5" title="Pick the exact shade" />
              <input className="inp" style={{ flex: 1, minWidth: 140 }} value={v.name} onChange={e => setVar(i, "name", e.target.value)} placeholder="Color name — e.g. Rose Gold" />
              <input className="inp" style={{ flex: 1, minWidth: 160 }} value={v.image_url || ""} onChange={e => setVar(i, "image_url", e.target.value || null)} placeholder="Photo URL for this color (Supabase Storage)" />
              <div className="flex items-center gap-1.5">
                <span className="text-[.7rem] text-mutedwarm">Stock</span>
                <input className="inp" style={{ width: 64, textAlign: "center" }} type="number" min="0" value={v.stock}
                  onChange={e => setVar(i, "stock", Math.max(0, parseInt(e.target.value) || 0))} />
              </div>
              <button onClick={() => rmVar(i)} disabled={p.variants.length === 1}
                className="chip !px-3 !text-wine disabled:opacity-40" title={p.variants.length === 1 ? "Keep at least one color" : "Remove color"}>×</button>
            </div>
          ))}
          <button onClick={addVar} className="chip mt-1">+ Add another color</button>
        </FormCard>

        <FormCard title="The selling details"
          note="This replaces you explaining things one-on-one — the more honest detail, the fewer questions on WhatsApp.">
          <Field label="Material"><input className="inp" value={p.material || ""} onChange={e => set("material", e.target.value)} placeholder="Full-grain vegetable-tanned leather" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dimensions (cm)"><input className="inp" value={p.dim_cm || ""} onChange={e => set("dim_cm", e.target.value)} placeholder="34 × 28 × 12 cm" /></Field>
            <Field label="Dimensions (inches)"><input className="inp" value={p.dim_in || ""} onChange={e => set("dim_in", e.target.value)} placeholder="13.4 × 11 × 4.7 in" /></Field>
          </div>
          <Field label="What fits inside (comma-separated)">
            <input className="inp" value={(p.fits || []).join(", ")}
              onChange={e => set("fits", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              placeholder='13" laptop, Water bottle, Wallet + phone' />
          </Field>
          <Field label="Care instructions"><input className="inp" value={p.care || ""} onChange={e => set("care", e.target.value)} placeholder="Wipe with a damp cloth; condition monthly." /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Size class (powers the fit finder)">
              <select className="inp" value={p.size} onChange={e => set("size", e.target.value)}>
                <option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option>
              </select>
            </Field>
            <Field label="How it's worn (fit finder)">
              <div className="flex gap-2 flex-wrap pt-1">
                {["crossbody", "shoulder", "hand"].map(c => (
                  <button key={c} onClick={() => toggleCarry(c)}
                    className={`chip ${p.carry.includes(c) ? "!bg-wine !text-white !border-wine" : ""}`}>{c}</button>
                ))}
              </div>
            </Field>
          </div>
        </FormCard>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button onClick={() => canSave && onSave(p)} disabled={!canSave}
            className="btn btn-wa disabled:opacity-50 disabled:cursor-not-allowed">Save &amp; publish to the live site</button>
        </div>
        <style>{`.inp{width:100%;border:1.5px solid #EADCD3;border-radius:10px;padding:11px 14px;background:#fff;font-size:.9rem;} .inp:focus{outline:none;border-color:#7A2E43;}`}</style>
      </div>
    </main>
  );
}

function FormCard({ title, note, children }) {
  return (
    <div className="bg-cream border border-linewarm rounded-2xl p-6 mb-4">
      <h3 className="font-serif text-lg mb-1">{title}</h3>
      {note && <p className="text-xs text-mutedwarm mb-4">{note}</p>}
      {children}
    </div>
  );
}
function Field({ label, children }) {
  return (
    <div className="mb-3.5">
      <label className="block text-[.7rem] tracking-[.1em] uppercase text-mutedwarm mb-1.5">{label}</label>
      {children}
    </div>
  );
}
function Stat({ n, label, warn }) {
  return (
    <div className={`bg-cream border rounded-xl px-5 py-4 ${warn ? "border-wine/35" : "border-linewarm"}`}>
      <div className={`font-serif text-3xl font-light ${warn ? "text-wine" : ""}`}>{n}</div>
      <div className="text-[.7rem] tracking-[.08em] uppercase text-mutedwarm">{label}</div>
    </div>
  );
}


/* ================= SITE EDITOR — hero, marquee, story, FAQs, categories ================= */
function SiteEditor({ settings, onSave }) {
  const [s, setS] = useState(settings);
  useEffect(() => setS(settings), [settings]);
  const set = (k, v) => setS(x => ({ ...x, [k]: v }));
  const setFaq = (i, j, val) => set("faqs", s.faqs.map((f, k) => (k !== i ? f : f.map((x, m) => (m === j ? val : x)))));
  const setCat = (i, k, val) => set("categories", s.categories.map((c, j) => (j !== i ? c : { ...c, [k]: val })));

  return (
    <div className="grid gap-4">
      <EditCard title="Hero — the first thing everyone sees">
        <div className="grid grid-cols-2 gap-3">
          <F l="Line 1"><input className="inp" value={s.heroLine1} onChange={e => set("heroLine1", e.target.value)} /></F>
          <F l="Highlighted word"><input className="inp" value={s.heroEm} onChange={e => set("heroEm", e.target.value)} /></F>
        </div>
        <F l="Line 2"><input className="inp" value={s.heroLine2} onChange={e => set("heroLine2", e.target.value)} /></F>
        <F l="Short intro"><textarea className="inp min-h-[60px]" value={s.heroSub} onChange={e => set("heroSub", e.target.value)} /></F>
        <F l="Hero photo URL (your bag — upload to Supabase Storage, paste the public URL)">
          <input className="inp" value={s.heroImg || ""} onChange={e => set("heroImg", e.target.value || null)} placeholder="https://…/bags/hero.jpg" />
        </F>
      </EditCard>

      <EditCard title="Moving line (scrolling promises)" note="Your words — delivery, returns, anything.">
        {s.marquee.map((m, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className="inp" value={m} onChange={e => set("marquee", s.marquee.map((x, j) => j === i ? e.target.value : x))} />
            <button onClick={() => set("marquee", s.marquee.filter((_, j) => j !== i))} className="chip !text-wine" disabled={s.marquee.length === 1}>×</button>
          </div>
        ))}
        <button onClick={() => set("marquee", [...s.marquee, ""])} className="chip">+ Add a line</button>
      </EditCard>

      <EditCard title="Categories" note="Hide any category (its bags vanish from the site) or add new ones.">
        {s.categories.map((c, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input className="inp" value={c.name} onChange={e => setCat(i, "name", e.target.value)} />
            <button onClick={() => setCat(i, "visible", !c.visible)}
              className={`chip whitespace-nowrap ${c.visible ? "!bg-[#25823f] !text-white !border-[#25823f]" : ""}`}>
              {c.visible ? "Visible" : "Hidden"}
            </button>
            <button onClick={() => set("categories", s.categories.filter((_, j) => j !== i))} className="chip !text-wine" disabled={s.categories.length === 1}>×</button>
          </div>
        ))}
        <button onClick={() => set("categories", [...s.categories, { name: "New category", visible: true }])} className="chip">+ Add a category</button>
      </EditCard>

      <EditCard title="Our story" note="Show it or hide it. Blank line between paragraphs.">
        <button onClick={() => set("showStory", !s.showStory)}
          className={`chip mb-3 ${s.showStory ? "!bg-[#25823f] !text-white !border-[#25823f]" : ""}`}>
          {s.showStory ? "Showing — tap to hide" : "Hidden — tap to show"}
        </button>
        {s.showStory && (
          <>
            <F l="Title"><input className="inp" value={s.storyTitle} onChange={e => set("storyTitle", e.target.value)} /></F>
            <F l="Your story"><textarea className="inp min-h-[130px]" value={s.storyText} onChange={e => set("storyText", e.target.value)} /></F>
            <F l="Signature"><input className="inp" value={s.storySig} onChange={e => set("storySig", e.target.value)} /></F>
          </>
        )}
      </EditCard>

      <EditCard title="Questions & answers" note="Answer every DM question once, here, forever.">
        {s.faqs.map(([q, a], i) => (
          <div key={i} className="border border-linewarm rounded-lg p-3 mb-2.5 bg-white">
            <div className="flex gap-2 mb-2">
              <input className="inp font-medium" value={q} onChange={e => setFaq(i, 0, e.target.value)} placeholder="Question" />
              <button onClick={() => set("faqs", s.faqs.filter((_, j) => j !== i))} className="chip !text-wine">×</button>
            </div>
            <textarea className="inp min-h-[54px]" value={a} onChange={e => setFaq(i, 1, e.target.value)} placeholder="Answer" />
          </div>
        ))}
        <button onClick={() => set("faqs", [...s.faqs, ["", ""]])} className="chip">+ Add a question</button>
      </EditCard>

      <div className="flex justify-end">
        <button onClick={() => onSave(s)} className="btn btn-wa">Save my site</button>
      </div>
      <style>{`.inp{width:100%;border:1.5px solid #EADCD3;border-radius:10px;padding:11px 14px;background:#fff;font-size:.9rem;} .inp:focus{outline:none;border-color:#7A2E43;}`}</style>
    </div>
  );
}
function EditCard({ title, note, children }) {
  return (
    <div className="bg-cream border border-linewarm rounded-2xl p-5">
      <h3 className="font-serif text-lg mb-1">{title}</h3>
      {note && <p className="text-xs text-mutedwarm mb-3">{note}</p>}
      {children}
    </div>
  );
}
function F({ l, children }) {
  return (
    <div className="mb-3">
      <label className="block text-[.68rem] tracking-[.1em] uppercase text-mutedwarm mb-1.5">{l}</label>
      {children}
    </div>
  );
}
