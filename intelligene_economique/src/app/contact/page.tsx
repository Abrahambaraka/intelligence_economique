export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Contact</h1>
    <form action="/api/contact" method="post" className="space-y-4">
        <div>
      <label htmlFor="name" className="block text-sm mb-1">Nom</label>
      <input id="name" name="name" placeholder="Votre nom" required className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <div>
      <label htmlFor="email" className="block text-sm mb-1">Email</label>
      <input id="email" type="email" name="email" placeholder="vous@exemple.com" required className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
        </div>
        <div>
      <label htmlFor="message" className="block text-sm mb-1">Message</label>
      <textarea id="message" name="message" placeholder="Votre message" required rows={6} className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm" />
        </div>
  <button className="rounded-md px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)]">
          Envoyer
        </button>
      </form>
    </div>
  );
}
