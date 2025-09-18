import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

type DbMagazine = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  issue: string;
  pdfUrl: string | null;
  status: "draft" | "published" | "archived";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// GET /api/magazines?status=published — liste des magazines (filtrage par statut)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") || undefined) as
    | "draft"
    | "published"
    | "archived"
    | undefined;

  const where: { status?: "draft" | "published" | "archived" } = {};
  if (status) where.status = status;

  const list = await prisma.magazine.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  return NextResponse.json(
    list.map((m: DbMagazine) => ({
      id: m.id,
      title: m.title,
      slug: m.slug,
      excerpt: m.excerpt ?? undefined,
      image: m.image ?? undefined,
      publishedAt: m.publishedAt?.toISOString() ?? new Date(m.createdAt).toISOString(),
      issue: m.issue,
      pdfUrl: m.pdfUrl ?? undefined,
    }))
  );
}

// POST /api/magazines { title, issue, excerpt?, image?, pdfUrl? } — créer et publier un magazine
export async function POST(req: NextRequest) {
  const data = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const title = String(data["title"] || "").trim();
  const issue = String(data["issue"] || "").trim();
  const excerpt = (data["excerpt"] ? String(data["excerpt"]) : undefined)?.trim();
  const image = (data["image"] ? String(data["image"]) : undefined)?.trim();
  const pdfUrl = (data["pdfUrl"] ? String(data["pdfUrl"]) : undefined)?.trim();

  if (!title || !issue) {
    return NextResponse.json({ ok: false, error: "Titre et numéro requis" }, { status: 400 });
  }

  const slugBase = slugify(title);
  let slug = slugBase;
  for (let i = 1; i < 1000; i++) {
    const found = await prisma.magazine.findUnique({ where: { slug } });
    if (!found) break;
    slug = `${slugBase}-${i}`;
  }

  const created = await prisma.magazine.create({
    data: {
      title,
      slug,
      excerpt,
      image,
      issue,
      pdfUrl,
      status: "published",
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, id: created.id, slug: created.slug });
}
