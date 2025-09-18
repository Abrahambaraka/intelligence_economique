import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { RUBRIQUES, getRubriqueLabel } from "@/lib/categories";

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

function normalize(s: string) {
  return s.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^\w\s]/g, " ") // Replace special chars with spaces
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

interface SearchArticle {
  id: string;
  title: string;
  excerpt?: string | null;
  body?: string | null;
  author?: string | null;
  slug: string;
  publishedAt: string | Date | null;
  createdAt?: Date;
  image?: string | null;
  category?: string | null;
  rubriqueSlug?: string | null;
}

function calculateRelevanceScore(article: SearchArticle, searchTerms: string[]) {
  let score = 0;
  const title = normalize(article.title);
  const excerpt = normalize(article.excerpt || "");
  const body = normalize(article.body || "");
  const author = normalize(article.author || "");

  searchTerms.forEach(term => {
    // Title matches (highest weight)
    if (title.includes(term)) {
      score += title === term ? 100 : 50; // Exact title match vs partial
    }
    
    // Excerpt matches (medium weight)
    if (excerpt.includes(term)) {
      score += 25;
    }
    
    // Body matches (lower weight)
    if (body.includes(term)) {
      score += 10;
    }
    
    // Author matches
    if (author.includes(term)) {
      score += 15;
    }
    
    // Fuzzy matching (for typos)
    const fuzzyMatches = [title, excerpt, body].some(text => {
      return text.split(' ').some(word => {
        const distance = levenshteinDistance(word, term);
        return distance <= Math.max(1, Math.floor(term.length * 0.2)); // 20% tolerance
      });
    });
    
    if (fuzzyMatches) {
      score += 5;
    }
  });

  return score;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}

export default async function RecherchePage({ searchParams }: { searchParams: Promise<{ q?: string; rubrique?: string; tri?: string }> }) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const selectedRubrique = (params.rubrique || "").trim();
  const tri = (params.tri || "").trim();

  let results: SearchArticle[] = [];

  if (q) {
    // Récupérer tous les articles publiés depuis la base
    const dbArticles = await prisma.article.findMany({
      where: { 
        status: "published",
        ...(selectedRubrique && RUBRIQUES.some(r => r.slug === selectedRubrique) 
          ? { rubriqueSlug: selectedRubrique } 
          : {})
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        body: true,
        image: true,
        author: true,
        publishedAt: true,
        createdAt: true,
        rubriqueSlug: true
      }
    });

    // Préparer les termes de recherche
    const searchTerms = normalize(q).split(" ").filter(term => term.length > 1);
    
    if (searchTerms.length > 0) {
      // Calculer le score de pertinence pour chaque article
      results = dbArticles
        .map(article => ({
          ...article,
          relevanceScore: calculateRelevanceScore(article, searchTerms)
        }))
        .filter(article => article.relevanceScore > 0)
        .sort((a, b) => {
          if (tri === "recent") {
            return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
          }
          return b.relevanceScore - a.relevanceScore; // Tri par pertinence par défaut
        });
    }
  }

  const count = results.length;
  const rubriqueValid = selectedRubrique && RUBRIQUES.some((r) => r.slug === selectedRubrique);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-4 flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Recherche</h1>
        {q ? (
          <p className="text-sm text-neutral-600">
            {count} résultat{count > 1 ? "s" : ""} pour « {q} »{rubriqueValid ? ` • ${getRubriqueLabel(selectedRubrique)}` : ""}
          </p>
        ) : (
          <p className="text-sm text-neutral-600">Trouvez des articles par mots‑clés, thèmes ou rubriques.</p>
        )}
      </div>

  {/* Barre de recherche */}
      <form action="/recherche" method="get" className="mb-5 flex items-center gap-3">
        <div className="flex w-full max-w-2xl items-center gap-2 rounded-full border border-neutral-300 bg-white pl-3 pr-2 shadow-sm">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Rechercher un article..."
            className="w-full bg-transparent py-1.5 text-sm outline-none text-neutral-900 placeholder:text-neutral-900"
          />
          {rubriqueValid && <input type="hidden" name="rubrique" value={selectedRubrique} />}
          {tri && <input type="hidden" name="tri" value={tri} />}
          <button type="submit" aria-label="Rechercher" className="p-0 m-0 inline-flex items-center justify-center text-neutral-900 hover:text-neutral-900">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
        </div>
      </form>

  {/* Filtres et tri */}
      {q && (
        <div className="mb-6 flex flex-col gap-3">
          {/* Pastilles de rubriques */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(() => {
              const makeHref = (slug?: string) => {
                const qs = new URLSearchParams();
                if (q) qs.set("q", q);
                if (slug) qs.set("rubrique", slug);
                if (tri) qs.set("tri", tri);
                const s = qs.toString();
                return s ? `/recherche?${s}` : "/recherche";
              };
              const chips = [
                <Link
                  key="all"
                  href={makeHref(undefined)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs ${!rubriqueValid ? "border-neutral-300 bg-neutral-100 text-neutral-800" : "border-neutral-300 hover:bg-neutral-100"}`}
                >
                  Toutes les rubriques
                </Link>,
                ...RUBRIQUES.map((r) => (
                  <Link
                    key={r.slug}
                    href={makeHref(r.slug)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs ${selectedRubrique === r.slug ? "border-[var(--brand-600)] bg-[var(--brand-600)] text-white" : "border-neutral-300 hover:bg-neutral-100"}`}
                  >
                    {r.label}
                  </Link>
                )),
              ];
              return chips;
            })()}
          </div>
          {/* Liens de tri */}
          <div className="flex items-center gap-3 text-xs text-neutral-600">
            <span>Trier:</span>
            {(() => {
              const makeHref = (mode?: string) => {
                const qs = new URLSearchParams();
                if (q) qs.set("q", q);
                if (rubriqueValid) qs.set("rubrique", selectedRubrique);
                if (mode) qs.set("tri", mode);
                const s = qs.toString();
                return s ? `/recherche?${s}` : "/recherche";
              };
              return (
                <>
                  <Link href={makeHref(undefined)} className={`${tri !== "recent" ? "text-[var(--brand-600)]" : "hover:text-[var(--brand-600)]"}`}>Pertinence</Link>
                  <span>•</span>
                  <Link href={makeHref("recent")} className={`${tri === "recent" ? "text-[var(--brand-600)]" : "hover:text-[var(--brand-600)]"}`}>Plus récents</Link>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {!q && <div className="rounded-lg border bg-white p-6 text-neutral-700">Saisissez un mot‑clé pour lancer une recherche.</div>}
      {q && results.length === 0 && (
        <div className="rounded-lg border bg-white p-6">
          <p className="text-neutral-700">Aucun résultat pour « {q} »{rubriqueValid ? ` dans ${getRubriqueLabel(selectedRubrique)}` : ""}.</p>
          <ul className="mt-3 list-disc pl-5 text-sm text-neutral-600 space-y-1">
            <li>Vérifiez l’orthographe des mots‑clés.</li>
            <li>Essayez des termes plus généraux ou différents.</li>
            <li>Parcourez les rubriques pour explorer les contenus.</li>
          </ul>
        </div>
      )}
      {results.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((a) => (
            <article key={a.id} className="border rounded-lg overflow-hidden bg-white hover:shadow-sm transition-shadow">
              {a.image && (
                <div className="relative w-full h-40 overflow-hidden">
                  <Image 
                    src={a.image} 
                    alt={a.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 text-xs">
                  {a.rubriqueSlug && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700">{getRubriqueLabel(a.rubriqueSlug) || a.rubriqueSlug}</span>
                  )}
                  <span className="text-neutral-500">{new Date(a.publishedAt || a.createdAt || new Date()).toLocaleDateString("fr-FR")}</span>
                </div>
                <h2 className="font-semibold text-lg mb-1">
                  <Link href={`/articles/${a.slug}`} className="hover:underline hover:text-[var(--brand-600)]">
                    {highlight(a.title, q)}
                  </Link>
                </h2>
                <p className="text-sm text-neutral-600 line-clamp-3">{highlight(a.excerpt || "", q)}</p>
                <div className="mt-3">
                  <Link href={`/articles/${a.slug}`} className="text-sm text-[var(--brand-600)] hover:underline">Lire l’article →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
