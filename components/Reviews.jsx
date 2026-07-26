"use client";
import { useEffect, useState } from "react";
import { getReviews, submitReview } from "@/lib/supabase";

function Stars({ value, size = "text-base" }) {
  const full = Math.round(value);
  return (
    <span className={`text-gold ${size} tracking-[1px]`}>
      {"★★★★★".slice(0, full)}
      <span className="text-linewarm">{"★★★★★".slice(full)}</span>
    </span>
  );
}

export default function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getReviews(productId).then((r) => { setReviews(r); setLoading(false); });
  }, [productId]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

  async function submit() {
    if (!name.trim() || !body.trim()) { setMsg("Please add your name and a note."); return; }
    setBusy(true); setMsg("");
    const res = await submitReview({ productId, name: name.trim(), rating, body: body.trim() });
    setBusy(false);
    if (res.ok) {
      setName(""); setBody(""); setRating(5);
      setMsg("Thank you! Your review will appear once Fatxa approves it.");
    } else {
      setMsg("Sorry, that didn't send. Please try again.");
    }
  }

  return (
    <div className="border-t border-linewarm mt-10 pt-8">
      <div className="flex items-center gap-3 mb-5">
        <h3 className="font-serif font-light text-2xl">Reviews</h3>
        {avg && <span className="text-mutedwarm text-sm flex items-center gap-2"><Stars value={avg} size="text-sm" /> {avg.toFixed(1)} · {reviews.length}</span>}
      </div>

      {loading ? (
        <p className="text-mutedwarm text-sm">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-mutedwarm text-sm italic mb-6">No reviews yet. If you've bought this bag, be the first to leave one below.</p>
      ) : (
        <div className="mb-6">
          {reviews.map((r) => (
            <div key={r.id} className="py-3.5 border-b border-linewarm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[.92rem]">{r.name}</span>
                <Stars value={r.rating} size="text-sm" />
              </div>
              <p className="text-mutedwarm text-sm mt-1">{r.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* leave a review */}
      <div className="bg-cream border border-linewarm rounded-xl p-4">
        <div className="text-sm text-mutedwarm mb-3">Leave a review</div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
          className="w-full border border-linewarm rounded-lg px-3 py-2.5 mb-2.5 bg-white text-sm" />
        <div className="flex gap-1 mb-2.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRating(n)} className="text-2xl leading-none"
              style={{ color: n <= rating ? "#B08D57" : "#EADCD3" }}>★</button>
          ))}
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="How do you like it?"
          className="w-full border border-linewarm rounded-lg px-3 py-2.5 min-h-[70px] bg-white text-sm mb-2.5" />
        <button onClick={submit} disabled={busy}
          className="bg-plum text-cream rounded-full px-5 py-2.5 text-[.72rem] tracking-[.1em] uppercase disabled:opacity-50">
          {busy ? "Sending…" : "Post review"}
        </button>
        {msg && <p className="text-[.8rem] text-wine mt-2.5">{msg}</p>}
      </div>
    </div>
  );
}
