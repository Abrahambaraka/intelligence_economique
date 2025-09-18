"use client";
import Link from "next/link";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { articles } from "@/lib/data";

function filterArticles(q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return [] as typeof articles;
  return articles.filter((a) => {
    const hay = `${a.title} ${a.excerpt ?? ""} ${a.body} ${(a.tags || []).join(" ")}`.toLowerCase();
    return hay.includes(query);
  });
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-100 text-inherit px-0.5">{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function SearchBox({ className = "" }: { className?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Anti-rebond (debounce) de la requête
  const [dq, setDq] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDq(q), 200);
    return () => clearTimeout(t);
  }, [q]);

  const results = useMemo(() => (dq.length >= 2 ? filterArticles(dq).slice(0, 8) : []), [dq]);

  // Fermer au clic en dehors
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!boxRef.current) return;
      if (e.target instanceof Node && !boxRef.current.contains(e.target)) {
        setOpen(false);
        setActive(-1);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className={"relative " + className} ref={boxRef}>
  <form action="/recherche" method="get" className="flex items-center gap-2">
  <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 pl-3 pr-3">
          <button type="submit" aria-label="Rechercher" className="p-0 m-0 inline-flex items-center justify-center text-neutral-900 hover:text-neutral-900">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
      <input
            ref={inputRef}
            type="search"
            name="q"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) setOpen(true);
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(i + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                if (active >= 0 && results[active]) {
                  e.preventDefault();
                  router.push(`/articles/${results[active].slug}`);
                  setOpen(false);
                }
              } else if (e.key === "Escape") {
                setOpen(false);
                setActive(-1);
              }
            }}
            placeholder="Rechercher..."
  className="w-36 md:w-44 lg:w-56 bg-transparent px-2 py-1.5 text-sm outline-none text-neutral-900 placeholder:text-neutral-900"
          />
    </div>
      </form>
      {open && (
  <div className="absolute right-0 mt-2 w-72 md:w-80 max-w-[90vw] rounded-md border border-neutral-200 bg-white shadow-lg p-2 z-50">
          {results.length > 0 ? (
            <>
              <ul className="divide-y divide-neutral-200">
                {results.map((a, idx) => (
                  <li key={a.id} className={"py-2 rounded " + (idx === active ? "bg-neutral-50" : "")}
                      onMouseEnter={() => setActive(idx)}>
                    <Link href={`/articles/${a.slug}`} className="block rounded px-2 py-1">
                      <p className="text-sm font-medium text-neutral-900 line-clamp-1">{highlight(a.title, dq)}</p>
                      <p className="text-xs text-neutral-600 line-clamp-2">{highlight(a.excerpt || "", dq)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-right">
                <Link href={`/recherche?q=${encodeURIComponent(q)}`} className="text-xs text-[var(--brand-600)] hover:underline">
                  Voir tous les résultats
                </Link>
              </div>
            </>
          ) : dq.length >= 2 ? (
            <div className="px-2 py-3 text-xs text-neutral-600">Aucun résultat. <Link className="text-[var(--brand-600)] hover:underline" href={`/recherche?q=${encodeURIComponent(q)}`}>Voir tous les résultats</Link></div>
          ) : null}
        </div>
      )}
    </div>
  );
}
