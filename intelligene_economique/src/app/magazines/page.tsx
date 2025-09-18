import { prisma } from "@/lib/prisma";

export default async function MagazinesPage() {
  const mags = await prisma.magazine.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 60,
  });
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Magazines</h1>
      <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {mags.map((m: { id: string; title: string; image: string | null; issue: string; pdfUrl: string | null }) => (
          <article key={m.id} className="rounded-lg overflow-hidden bg-white border border-neutral-200 hover:shadow-sm transition-shadow">
            {m.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.image} alt="" className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-1">{m.title}</h2>
              <p className="text-sm text-neutral-600 mb-2">{m.issue}</p>
              {m.pdfUrl && (
                <a className="text-sm hover:underline text-[var(--brand-600)]" href={m.pdfUrl}>
                  Télécharger le PDF
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
