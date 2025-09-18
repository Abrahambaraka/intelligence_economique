import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "ID manquant" }, { status: 400 });
  const data = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const updatable: Record<string, string> = {};
  if (typeof data["title"] === "string") updatable.title = (data["title"] as string).trim();
  if (typeof data["excerpt"] === "string") updatable.excerpt = (data["excerpt"] as string).trim();
  if (typeof data["body"] === "string") updatable.body = (data["body"] as string).trim();
  if (typeof data["image"] === "string") updatable.image = (data["image"] as string).trim();
  if (typeof data["rubrique"] === "string") updatable.rubriqueSlug = (data["rubrique"] as string).trim();
  if (typeof data["status"] === "string") updatable.status = (data["status"] as string).trim();
  if (Object.keys(updatable).length === 0) {
    return NextResponse.json({ ok: false, error: "Aucun champ à mettre à jour" }, { status: 400 });
  }
  try {
    const updated = await prisma.article.update({ where: { id }, data: updatable });
    return NextResponse.json({ ok: true, id: updated.id });
  } catch {
    return NextResponse.json({ ok: false, error: "Mise à jour échouée" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "ID manquant" }, { status: 400 });
  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Suppression échouée" }, { status: 400 });
  }
}
