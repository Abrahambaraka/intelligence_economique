export type Rubrique = { slug: string; label: string };

export const RUBRIQUES: Rubrique[] = [
  { slug: "note-information", label: "NOTE D'INFORMATION" },
  { slug: "enquetes-investigations", label: "ENQUÊTES & INVESTIGATIONS" },
  { slug: "analyse-situations", label: "ANALYSE DES SITUATIONS" },
  { slug: "flash-note", label: "FLASH NOTE" },
  { slug: "decouverte", label: "DECOUVERTE" },
  { slug: "interview", label: "INTERVIEW" },
  { slug: "plaidoyer", label: "PLAIDOYER" },
  { slug: "tribune", label: "TRIBUNE" },
];

export function getRubriqueLabel(slug?: string) {
  if (!slug) return undefined;
  return RUBRIQUES.find((r) => r.slug === slug)?.label;
}
