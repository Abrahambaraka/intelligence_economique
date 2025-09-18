export type Rubrique = { slug: string; label: string };

export const RUBRIQUES: Rubrique[] = [
  { slug: "mines-petrole-gaz", label: "NOTE D’INFORMATION" },
  { slug: "economie-finance", label: "ENQUÊTES & INVESTIGATIONS" },
  { slug: "actualite-societe", label: "ANALYSE DES SITUATIONS" },
  { slug: "environnement-energie", label: "FLASH NOTE" },
  { slug: "communication-information", label: "DECOUVERTE" },
  { slug: "batiment-travaux", label: "INTERVIEW" },
  { slug: "entreprise-entreprenariat", label: "PLAIDOYER" },
  { slug: "tribune", label: "TRIBUNE" },
];

export function getRubriqueLabel(slug?: string) {
  if (!slug) return undefined;
  return RUBRIQUES.find((r) => r.slug === slug)?.label;
}
