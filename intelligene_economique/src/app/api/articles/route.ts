import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

type DbArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  image: string | null;
  author: string | null;
  rubriqueSlug: string | null;
  status: "draft" | "published" | "archived";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// GET /api/articles?rubrique=slug&status=published — liste des articles (filtrage par rubrique/statut)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rubrique = searchParams.get("rubrique") || undefined;
  const status = (searchParams.get("status") || undefined) as
    | "draft"
    | "published"
    | "archived"
    | undefined;

  const where: { rubriqueSlug?: string; status?: "draft" | "published" | "archived" } = {};
  if (rubrique) where.rubriqueSlug = rubrique;
  if (status) where.status = status;

  const list = await prisma.article.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  return NextResponse.json(
    list.map((a: DbArticle) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt ?? undefined,
      image: a.image ?? undefined,
      publishedAt: a.publishedAt?.toISOString() ?? new Date(a.createdAt).toISOString(),
      author: a.author ?? undefined,
      rubrique: a.rubriqueSlug ?? undefined,
      body: a.body,
    }))
  );
}

// POST /api/articles { title, excerpt?, body, image?, rubrique } — créer et publier un article
export async function POST(req: NextRequest) {
  const data = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const title = String(data["title"] || "").trim();
  const body = String(data["body"] || "").trim();
  const excerpt = (data["excerpt"] ? String(data["excerpt"]) : undefined)?.trim();
  const image = (data["image"] ? String(data["image"]) : undefined)?.trim();
  const rubrique = (data["rubrique"] ? String(data["rubrique"]) : undefined)?.trim();

  if (!title || !body) {
    return NextResponse.json({ ok: false, error: "Titre et contenu requis" }, { status: 400 });
  }

  // Vérifier que la rubrique existe si elle est fournie
  if (rubrique) {
    const rubriqueExists = await prisma.rubrique.findUnique({ where: { slug: rubrique } });
    if (!rubriqueExists) {
      return NextResponse.json({ ok: false, error: `Rubrique "${rubrique}" non trouvée` }, { status: 400 });
    }
  }

  const slugBase = slugify(title);
  let slug = slugBase;
  // garantir un slug unique
  for (let i = 1; i < 1000; i++) {
    const found = await prisma.article.findUnique({ where: { slug } });
    if (!found) break;
    slug = `${slugBase}-${i}`;
  }

  const created = await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      body,
      image,
      rubriqueSlug: rubrique || null, // Utiliser null si pas de rubrique
      status: "published",
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, id: created.id, slug: created.slug });
}
