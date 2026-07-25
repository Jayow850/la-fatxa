"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { waLink, waGeneralMessage } from "@/lib/wa";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition ${scrolled ? "bg-cream/90 backdrop-blur-md shadow-[0_1px_0_#EADCD3]" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 h-[74px] flex items-center justify-between">
        <Link href="/" className="font-serif italic text-xl flex items-center gap-2.5">
          <span className="w-8 h-8 border border-current rounded-full grid place-items-center text-sm not-italic font-serif italic">F</span>
          La <em>Fatxa</em>
        </Link>
        <nav className="hidden md:flex gap-7 text-[.78rem] tracking-[.08em] uppercase">
          <Link href="/shop" className="opacity-75 hover:opacity-100">Collection</Link>
          <Link href="/size-guide" className="opacity-75 hover:opacity-100">Find Your Size</Link>
          <Link href="/story" className="opacity-75 hover:opacity-100">Our Story</Link>
          <Link href="/faq" className="opacity-75 hover:opacity-100">FAQ</Link>
        </nav>
        <a href={waLink(waGeneralMessage)} target="_blank" rel="noreferrer" className="btn !px-5 !py-2.5">Order on WhatsApp</a>
      </div>
    </header>
  );
}
