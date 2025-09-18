"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/Toast";
export default function Footer() {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const pathname = usePathname();
  const toast = useToast();
  if (pathname?.startsWith("/admin")) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setNote(null);
  const form = e.currentTarget as HTMLFormElement;
  const fd = new FormData(form);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as unknown;
        const j = (typeof body === "object" && body !== null ? body : {}) as { error?: string };
        throw new Error(j.error || "Erreur d'inscription");
      }
      setNote("Inscription réussie. Merci !");
      toast.success("Inscription réussie. Merci !");
      // Nettoyer le champ email
  const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
      if (emailInput) emailInput.value = "";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue";
  setNote(msg);
  toast.error(msg);
    } finally {
      setLoading(false);
    }
  }
  return (
  <footer className="border-t border-neutral-800 bg-neutral-900 text-neutral-100 mt-12 pb-[env(safe-area-inset-bottom)]">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Newsletter</h3>
            <p className="text-sm text-neutral-300 mb-4">
              Recevez nos analyses et enquêtes chaque semaine.
            </p>
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                name="email"
                placeholder="Votre e‑mail"
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand-600)]"
              />
              {/* Champ honeypot anti-spam (non visible) */}
              <input type="text" name="website" aria-label="website" className="hidden" tabIndex={-1} autoComplete="off" />
              <button
                type="submit"
                disabled={loading}
                className="rounded-md px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] disabled:opacity-60"
              >
                {loading ? "Envoi…" : "S'inscrire"}
              </button>
            </form>
            {note && (
              <div role="status" aria-live="polite" className="mt-2 text-sm text-neutral-200 bg-neutral-800/60 border border-neutral-700 rounded px-3 py-2">
                {note}
              </div>
            )}
            <p className="mt-2 text-xs text-neutral-400">
              En vous inscrivant, vous acceptez notre politique de confidentialité.
            </p>
          </div>

          {/* Liens */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Ressources</h3>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><a className="hover:text-[var(--brand-600)]" href="/a-propos">À propos</a></li>
              <li><a className="hover:text-[var(--brand-600)]" href="/contact">Contact</a></li>
              <li><a className="hover:text-[var(--brand-600)]" href="/politique-de-confidentialite">Confidentialité</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Nous contacter</h3>
            <p className="text-sm text-neutral-300">Administrateur Général : Pierre Louis BONDOKO</p>
            <p className="text-sm text-neutral-300">130b, Boulevard du 30 juin - Commune de la Gombe - Kinshasa – Rdc</p>
            <p className="text-sm text-neutral-300">
              (+243) 84 200 00 09 – 81 359 02 28  {" "}
              <a className="hover:text-[var(--brand-600)]" href="mailto:bondokodonpepe@gmail.com">bondokodonpepe@gmail.com</a>
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-400">
            © {new Date().getFullYear()} Intelligence Économique. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-sm text-neutral-400 flex-wrap justify-center">
            <a href="#" className="hover:text-[var(--brand-600)]">X</a>
            <a href="#" className="hover:text-[var(--brand-600)]">LinkedIn</a>
            <a href="#" className="hover:text-[var(--brand-600)]">YouTube</a>
            <a href="/admin" className="hover:text-[var(--brand-600)]">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

