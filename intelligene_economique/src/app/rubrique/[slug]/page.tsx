import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RUBRIQUES, getRubriqueLabel } from "@/lib/categories";
import { ArticleCard } from "@/components/ArticleCard";
import type { Article } from "@/lib/types";

export function generateStaticParams() {
  return RUBRIQUES.map((r) => ({ slug: r.slug }));
}

export default async function RubriquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const label = getRubriqueLabel(slug);
  if (!label) return notFound();
  const dbList = await prisma.article.findMany({
    where: { status: "published", rubriqueSlug: slug },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 36,
  });
  type DbArticle = typeof dbList[number];
  const list: Article[] = dbList.map((a: DbArticle) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt ?? undefined,
    image: a.image ?? undefined,
    publishedAt: (a.publishedAt ?? a.createdAt).toISOString(),
    author: a.author ?? undefined,
    body: a.body,
    rubrique: a.rubriqueSlug ?? undefined,
  }));
  // Libellé affiché: remplacer l'« et » isolé par « & »
  const displayLabel = label.replace(/(^|\s)et(\s)/gi, "$1&$2");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-2xl font-bold">{displayLabel}</h1>
        <Link href="/articles" className="text-sm hover:underline text-[var(--brand-600)]">
          Tous les articles
        </Link>
      </div>
      {list.length === 0 ? (
        <p className="text-neutral-600">Aucun article pour l’instant.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <ArticleCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}
