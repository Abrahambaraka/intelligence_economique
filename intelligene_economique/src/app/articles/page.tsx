import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArticleCard, FeaturedArticle } from "@/components/ArticleCard";
import type { Article } from "@/lib/types";

export default async function ArticlesPage() {
  const dbList = await prisma.article.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 30,
  });
  type DbArticle = typeof dbList[number];
  const articles: Article[] = dbList.map((a: DbArticle) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? undefined,
    image: a.image ?? undefined,
    publishedAt: (a.publishedAt ?? a.createdAt).toISOString(),
    author: a.author ?? undefined,
    body: a.body,
    rubrique: a.rubriqueSlug ?? undefined, // Ajouter la rubrique pour un affichage cohérent
  }));

  const [featured, ...rest] = articles;
  const grid = rest.slice(0, 6);
  const side = rest.slice(6, 12);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Articles</h1>

      {/* Bandeau Une + Colonne */}
      <div className="grid gap-5 sm:gap-8 lg:grid-cols-3 mb-8 lg:mb-10">
        <div className="lg:col-span-2">
          {featured && <FeaturedArticle a={featured} />}
        </div>
  <div className="space-y-3 sm:space-y-4">
          {rest.slice(0, 4).map((a) => (
            <div key={a.id} className="border-b pb-3 sm:pb-4 last:border-b-0 last:pb-0">
              <h3 className="font-semibold leading-snug text-base sm:text-lg">
    <Link href={`/articles/${a.slug}`} className="hover:underline hover:text-[var(--brand-600)] line-clamp-2">
                  {a.title}
                </Link>
              </h3>
              <p className="text-[13px] sm:text-sm text-neutral-600 line-clamp-2">{a.excerpt}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {grid.map((a) => (
          <ArticleCard key={a.id} a={a} />
        ))}
      </div>

      {/* Liste latérale style “À lire aussi” */}
      {side.length > 0 && (
        <div className="mt-8 lg:mt-10 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Analyses</h2>
            <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
              {side.slice(0, 4).map((a) => (
                <ArticleCard key={a.id} a={a} />
              ))}
            </div>
          </div>
          <aside>
            <h2 className="text-lg sm:text-xl font-bold mb-4">À lire aussi</h2>
            <div className="space-y-3 sm:space-y-4">
              {rest.slice(4, 10).map((a) => (
                <div key={a.id} className="border-b pb-3 sm:pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-semibold leading-snug text-base sm:text-lg">
                    <Link href={`/articles/${a.slug}`} className="hover:underline hover:text-[var(--brand-600)]">
                      {a.title}
                    </Link>
                  </h3>
                </div>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
