"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RUBRIQUES } from "@/lib/categories";
import SearchBox from "@/components/SearchBox";
import AuthNewsletterModal from "@/components/AuthNewsletterModal";

const links = [
  { href: "/magazines", label: "Magazines" },
];

// Scinde un libellé de rubrique en deux lignes :
// 1) coupe après la première virgule si présente, sinon
// 2) coupe autour de & (la première partie inclut &), sinon
// 3) coupe au milieu des mots en dernier recours.
function splitRubrique(label: string): [string, string] {
  const commaIdx = label.indexOf(",");
  if (commaIdx !== -1) {
    const left = label.slice(0, commaIdx + 1).trim();
    const right = label.slice(commaIdx + 1).trim();
    return [left, right];
  }
  const ampIdx = label.indexOf("&");
  if (ampIdx !== -1) {
    const left = label.slice(0, ampIdx + 1).trim();
    const right = label.slice(ampIdx + 1).trim();
    return [left, right];
  }
  const parts = label.split(/\s+/);
  if (parts.length > 1) {
    const mid = Math.ceil(parts.length / 2);
    return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
  }
  return [label, ""];
}

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const lastYRef = useRef(0);
  const onAdmin = pathname?.startsWith("/admin");
  const onPublier = pathname?.startsWith("/publier");
  const focusMobileSearch = () => {
    setOpen(true);
    // Met le focus sur la recherche mobile quand le tiroir s'ouvre
    setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>('input[name="q"]');
      el?.focus();
    }, 0);
  };
  // Fermer le menu déroulant desktop au clic extérieur et avec Échap
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!open) return;
      if (!menuRef.current) return;
      const target = e.target as Node;
      if (target && !menuRef.current.contains(target)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  // Ombre au défilement + masquage auto du header quand on défile vers le bas
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 4);
      // Réafficher près du haut
      if (y < 10) {
        setHidden(false);
      } else {
        // Glisser vers le haut en défilement descendant, réafficher en montant; rester visible quand le tiroir est ouvert
        const goingDown = y > lastYRef.current;
        if (!open) setHidden(goingDown);
      }
      lastYRef.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);
  // Masquer entièrement la barre de navigation sur les pages /admin
  if (onAdmin) return null;
  return (
    <header className={`sticky top-0 z-50 border-b border-neutral-200/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 pt-[env(safe-area-inset-top)] transition-shadow will-change-transform transform ${scrolled ? "shadow-sm" : ""} ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="grid min-h-16 items-center grid-cols-[1fr_auto_1fr] gap-4 py-1">
      {/* Gauche : Menu + Recherche */}
          <div className="relative flex items-center gap-2">
            {/* Hamburger */}
            <button
              aria-label="Ouvrir le menu"
        className={"inline-flex h-9 px-3 items-center justify-center gap-2 rounded-md border border-neutral-300 text-neutral-900 hover:border-neutral-900 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)]"}
              aria-haspopup="menu"
              aria-controls="menu-panel"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <span className="hidden md:inline text-sm">Menu</span>
            </button>
            <div className="hidden md:flex items-center gap-3">
              {/* Recherche desktop */}
              <div className="hidden md:block">
                <SearchBox />
              </div>
            </div>

            {/* Panneau déroulant des rubriques (desktop, amélioré) */}
            {open && (
              <div
                ref={menuRef}
                id="menu-panel"
                className="absolute left-0 top-full mt-2 hidden md:block w-[13rem] rounded-xl border border-neutral-200 bg-white shadow-xl px-4 pb-3 pt-2 z-50 animate-in fade-in slide-in-from-top-2"
              >
                <div className="mb-1 flex items-center justify-end">
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Fermer"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="divide-y divide-neutral-200">
                  {RUBRIQUES.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/rubrique/${r.slug}`}
          className="block px-3 py-2 text-xs text-neutral-800 hover:bg-neutral-50 hover:text-[var(--brand-600)] uppercase leading-tight"
                      onClick={() => setOpen(false)}
                    >
                      {(() => { const [l1, l2] = splitRubrique(r.label); return (<><span className="block">{l1}</span>{l2 && <span className="block">{l2}</span>}</>); })()}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Centre : Titre */}
          <div className="justify-self-center">
            <Link href="/">
              {/* Mobile : titre sur deux lignes */}
              <span className="block md:hidden font-extrabold leading-tight tracking-tight text-xl text-center max-w-[80vw]">
                <span className="block text-neutral-900">Intelligence</span>
                <span className="block text-[var(--brand-600)]">Économique</span>
              </span>
              {/* Tablette/Desktop : titre sur une seule ligne */}
              <span className="hidden md:block font-extrabold leading-tight tracking-tight text-2xl lg:text-3xl text-center md:whitespace-nowrap">
                <span className="text-neutral-900">Intelligence </span>
                <span className="text-[var(--brand-600)]">Économique</span>
              </span>
            </Link>
          </div>

          {/* Actions rapides mobile en haut à droite */}
          <div className="md:hidden justify-self-end flex items-center gap-2">
            <Link
              href="/magazines"
              aria-label="Magazines"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 text-neutral-900 hover:border-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4.5v15" />
                <path d="M12 4.5c-1.5-1-3.75-1.5-6-1.5v15c2.25 0 4.5.5 6 1.5" />
                <path d="M12 4.5c1.5-1 3.75-1.5 6-1.5v15c-2.25 0-4.5.5-6 1.5" />
              </svg>
            </Link>
            {onPublier ? (
              <form action="/api/auth/logout" method="post">
                <button
                  title="Se déconnecter"
                  aria-label="Déconnexion"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border text-[var(--brand-600)] border-[var(--brand-600)] hover:bg-[var(--brand-600)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                aria-label="Recherche"
                onClick={focusMobileSearch}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-neutral-300 text-neutral-900 hover:border-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-3.5-3.5" />
                </svg>
              </button>
            )}
          </div>

          {/* Droite : liens desktop + action Auth */}
          <nav className="hidden md:flex items-center gap-4 justify-self-end">
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={
                    "text-sm font-medium transition-colors hover:text-[var(--brand-600)] " +
                    (active ? "text-[var(--brand-600)]" : "text-neutral-900")
                  }
                >
                  <span className="inline-flex items-center gap-1.5">
                    {l.href === "/magazines" && (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 4.5v15" />
                        <path d="M12 4.5c-1.5-1-3.75-1.5-6-1.5v15c2.25 0 4.5.5 6 1.5" />
                        <path d="M12 4.5c1.5-1 3.75-1.5 6-1.5v15c-2.25 0-4.5.5-6 1.5" />
                      </svg>
                    )}
                    <span>{l.label}</span>
                  </span>
                </Link>
              );
            })}
            {onPublier ? (
              <form action="/api/auth/logout" method="post">
                <button
                  className="inline-flex items-center gap-2 h-9 px-3 rounded-md border text-sm font-medium border-[var(--brand-600)] text-[var(--brand-600)] hover:bg-[var(--brand-600)] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)]"
                  title="Se déconnecter"
               >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                  Déconnexion
                </button>
              </form>
            ) : (
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setAuthOpen(true); }}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-neutral-300 text-neutral-900 hover:border-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)]"
                role="button"
             >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
                <span className="text-sm">Connexion</span>
              </a>
            )}
          </nav>
        </div>
      </div>
      <AuthNewsletterModal open={authOpen} onClose={() => setAuthOpen(false)} />
      {/* Rideau mobile amélioré */}
      {open && (
        <>
          {/* Voile d'arrière-plan */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          {/* Panneau */}
          <div className="md:hidden fixed left-0 top-[env(safe-area-inset-top,0px)] z-50 w-[50%] max-w-xs bg-white animate-in slide-in-from-top-2 transform">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
              {/* Barre du tiroir */}
              <div className="mb-3 flex items-center justify-between">
                <div className="h-1.5 w-12 rounded-full bg-neutral-200 mx-auto absolute left-1/2 -translate-x-1/2 -top-2" aria-hidden="true" />
                <h2 className="text-xs font-semibold text-neutral-900">Menu</h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Recherche mobile */}
              <form action="/recherche" method="get" className="mb-3 flex items-center gap-2">
                <input
                  type="search"
                  name="q"
                  placeholder="Rechercher..."
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900 text-neutral-900 placeholder:text-neutral-900"
                />
                <button className="rounded-md px-3 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800">OK</button>
              </form>
              {/* Liens rapides */}
              <div className="grid gap-2">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-xs font-medium text-neutral-900 hover:text-[var(--brand-600)]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="inline-flex items-center gap-2">
                      {l.href === "/magazines" && (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 4.5v15" />
                          <path d="M12 4.5c-1.5-1-3.75-1.5-6-1.5v15c2.25 0 4.5.5 6 1.5" />
                          <path d="M12 4.5c1.5-1 3.75-1.5 6-1.5v15c-2.25 0-4.5.5-6 1.5" />
                        </svg>
                      )}
                      <span>{l.label}</span>
                    </span>
                  </Link>
                ))}
              </div>
              {/* Rubriques */}
              <div className="mt-2.5">
                <div className="divide-y divide-neutral-200">
                  {RUBRIQUES.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/rubrique/${r.slug}`}
          className="block px-2 py-1.5 text-[11px] text-neutral-900 hover:bg-neutral-50 hover:text-[var(--brand-600)] uppercase leading-tight"
                      onClick={() => setOpen(false)}
                    >
                      {(() => { const [l1, l2] = splitRubrique(r.label); return (<><span className="block">{l1}</span>{l2 && <span className="block">{l2}</span>}</>); })()}
                    </Link>
                  ))}
                </div>
              </div>
              {/* Auth */}
              <div className="mt-5">
                {onPublier ? (
                  <form action="/api/auth/logout" method="post">
                    <button className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-md border text-xs font-medium border-[var(--brand-600)] text-[var(--brand-600)] hover:bg-[var(--brand-600)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]" title="Se déconnecter">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <path d="M16 17l5-5-5-5" />
                        <path d="M21 12H9" />
                      </svg>
                      Déconnexion
                    </button>
                  </form>
                ) : (
                  <a href="#" onClick={(e) => { e.preventDefault(); setAuthOpen(true); }} className="w-full inline-flex items-center justify-center gap-2 h-9 rounded-md border border-neutral-300 text-neutral-900 hover:border-neutral-900 text-xs" role="button">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M20 21a8 8 0 1 0-16 0" />
                    </svg>
                    <span>Connexion / Inscription</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
