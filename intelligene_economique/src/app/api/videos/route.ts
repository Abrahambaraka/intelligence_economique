import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

type DbVideo = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  videoUrl: string;
  duration: string | null;
  status: "draft" | "published" | "archived";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

// GET /api/videos?status=published — liste des vidéos (filtrage par statut)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") || undefined) as
    | "draft"
    | "published"
    | "archived"
    | undefined;

  const where: { status?: "draft" | "published" | "archived" } = {};
  if (status) where.status = status;

  const list = await prisma.video.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  return NextResponse.json(
    list.map((v: DbVideo) => ({
      id: v.id,
      title: v.title,
      slug: v.slug,
      excerpt: v.excerpt ?? undefined,
      image: v.image ?? undefined,
      publishedAt: v.publishedAt?.toISOString() ?? new Date(v.createdAt).toISOString(),
      videoUrl: v.videoUrl,
      duration: v.duration ?? undefined,
    }))
  );
}

// POST /api/videos { title, videoUrl, excerpt?, image?, duration? } — créer et publier une vidéo
export async function POST(req: NextRequest) {
  const data = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const title = String(data["title"] || "").trim();
  const videoUrl = String(data["videoUrl"] || "").trim();
  const excerpt = (data["excerpt"] ? String(data["excerpt"]) : undefined)?.trim();
  const image = (data["image"] ? String(data["image"]) : undefined)?.trim();
  const duration = (data["duration"] ? String(data["duration"]) : undefined)?.trim();

  if (!title || !videoUrl) {
    return NextResponse.json({ ok: false, error: "Titre et URL vidéo requis" }, { status: 400 });
  }

  const slugBase = slugify(title);
  let slug = slugBase;
  for (let i = 1; i < 1000; i++) {
    const found = await prisma.video.findUnique({ where: { slug } });
    if (!found) break;
    slug = `${slugBase}-${i}`;
  }

  const created = await prisma.video.create({
    data: {
      title,
      slug,
      excerpt,
      image,
      videoUrl,
      duration,
      status: "published",
      publishedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, id: created.id, slug: created.slug });
}
