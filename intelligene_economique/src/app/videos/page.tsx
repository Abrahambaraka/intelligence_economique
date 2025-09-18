import { prisma } from "@/lib/prisma";

export default async function VideosPage() {
  const vids = await prisma.video.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 40,
  });
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Vidéos</h1>
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
        {vids.map((v: { id: string; title: string; videoUrl: string; excerpt: string | null }) => (
          <article key={v.id} className="rounded-lg overflow-hidden border border-neutral-200 bg-white hover:shadow-sm transition-shadow">
            {v.videoUrl.includes("youtube.com") ? (
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={v.videoUrl}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <video controls className="w-full h-auto">
                <source src={v.videoUrl} />
              </video>
            )}
            <div className="p-4 border-t border-neutral-200">
              <h2 className="font-semibold text-lg mb-1">{v.title}</h2>
              <p className="text-sm text-neutral-600">{v.excerpt || ""}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
