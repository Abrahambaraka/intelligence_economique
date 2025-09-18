export default function AProposPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6">À propos</h1>
      <div className="flex items-center gap-4 mb-8">
        {/* Remplacez l'image ci-dessous par le portrait réel dans public/images/gerant.jpg */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/gerant.jpg"
          alt="Photo de Pierre Louis BONDOKO"
          className="h-20 w-20 rounded-full object-cover border border-neutral-200 bg-neutral-100"
        />
        <div>
          <p className="text-sm text-neutral-600">Administrateur Général</p>
          <p className="text-lg font-semibold text-neutral-900">Pierre Louis BONDOKO</p>
        </div>
      </div>
      <div className="prose prose-neutral max-w-none">
        <p>
          Depuis près d&apos;une décennie, l’agence Intelligence Économique accompagne les décideurs publics et privés dans la maîtrise de l’information stratégique et de l’influence. Une vocation à offrir à nos partenaires les outils pour anticiper, détecter les signaux faibles, décrypter leur environnement et transformer les enjeux en opportunité durable.
        </p>

  <h2 className="mt-8 font-bold">Pôle Expertise &amp; Stratégie</h2>
        <ul>
          <li>Veille stratégique, prospective et gestion des risques</li>
          <li>Protection, valorisation et sécurisation de l’information sensible</li>
          <li>Études, diagnostics et modélisation de stratégies adaptées aux réalités contemporaines</li>
        </ul>

  <h2 className="mt-8 font-bold">Pôle Conseil &amp; Réseaux d’Influence</h2>
        <ul>
          <li>Relations institutionnelles et affaires publiques</li>
          <li>Développement, activation et animation de réseaux d’influence</li>
          <li>Accompagnement sur mesure et ingénierie de solutions stratégiques</li>
        </ul>

  <h2 className="mt-8 font-bold">Pôle Communication &amp; Influence</h2>
        <ul>
          <li>Stratégie d’image, communication de crise et valorisation médiatique</li>
          <li>Actions d’influence, lobbying, plaidoyer</li>
          <li>Production journalistique, édition spécialisée et contenus à forte valeur ajoutée</li>
        </ul>

  <h2 className="mt-8 font-bold">Conférence Scientifique Brillant Futur</h2>
        <p>
          Un espace permanent de l’Agence Intelligence Économique, dédié à la réflexion stratégique, au dialogue intellectuel et à la promotion des valeurs d’excellence, d’innovation et de leadership éclairé.
        </p>

  <h2 className="mt-8 font-bold">Prix Spécial Intelligence Économique</h2>
        <p>
          Une distinction prestigieuse honorant les parcours d’exception et l’engagement au service de l’intelligence économique.
        </p>

  <h2 className="mt-8 font-bold">Supports &amp; Médias</h2>
        <p>
          Cellule audiovisuelle dédiée à l’investigation et à la production stratégique
        </p>

        <h2>Contacts</h2>
        <p>
          Administrateur Général : Pierre Louis BONDOKO<br />
          130b, Boulevard du 30 juin - Commune de la Gombe - Kinshasa – Rdc<br />
          (+243) 84 200 00 09 – 81 359 02 28 {" "}
          <a href="mailto:bondokodonpepe@gmail.com">bondokodonpepe@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
