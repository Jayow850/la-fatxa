"use client";
import { waLink, waGeneralMessage } from "@/lib/wa";

export default function WhatsAppFloat() {
  return (
    <a href={waLink(waGeneralMessage)} target="_blank" rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25823f] text-white px-5 py-3 rounded-full flex items-center gap-2 text-sm shadow-xl hover:scale-105 transition">
      <span className="text-lg">💬</span> Chat &amp; order
    </a>
  );
}
