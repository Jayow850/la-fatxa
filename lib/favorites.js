"use client";
import { useEffect, useState } from "react";

const KEY = "lafatxa_favorites";
const EVENT = "lafatxa_favorites_changed";

function read() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}
function write(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT));
}

/** Hook that returns the current favorites list + helpers, kept in sync everywhere. */
export function useFavorites() {
  const [ids, setIds] = useState([]);

  useEffect(() => {
    setIds(read());
    const sync = () => setIds(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync); // sync across tabs
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = (id) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    write(next);
  };
  const remove = (id) => write(read().filter((x) => x !== id));
  const has = (id) => ids.includes(id);

  return { ids, toggle, remove, has, count: ids.length };
}
