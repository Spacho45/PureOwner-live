const SPECIAL_LATIN = new Map([
  ["ß", "ss"], ["æ", "ae"], ["œ", "oe"], ["ø", "o"],
  ["ł", "l"], ["ð", "d"], ["þ", "th"]
]);

export function normalizeText(value = "") {
  return String(value)
    .trim()
    .toLocaleLowerCase("fr")
    .replace(/[ßæœøłðþ]/g, (character) => SPECIAL_LATIN.get(character) || character)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function normalizeLabel(value = "") {
  return normalizeText(value)
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63)
    .replace(/-+$/g, "");
}

export function words(value = "") {
  return normalizeText(value).match(/[a-z0-9]+/g) || [];
}

export function uniqueLabels(labels = []) {
  return [...new Set(labels.map(normalizeLabel).filter(Boolean))];
}
