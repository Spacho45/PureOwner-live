import { normalizeLabel, words } from "./normalization.mjs";

export const SCORE_WEIGHTS = Object.freeze({
  usage: 25,
  readability: 20,
  identity: 15,
  tld: 15,
  professional: 10,
  length: 5,
  international: 5,
  originality: 5
});

const FAMILY_SIGNALS = {
  identity: ["identity", "general", "country"],
  professional: ["business", "professional", "technology", "finance"],
  creative: ["creative", "music", "art", "community"],
  rare: ["web3", "identity", "creative"]
};

function overlap(haystack = [], needles = []) {
  return needles.some((needle) => haystack.includes(needle));
}

export function scoreCandidate({ label, tld, family, portrait = {} }) {
  const normalized = normalizeLabel(label);
  const categories = tld.categories || [];
  const portraitTerms = words([
    portrait.firstName, portrait.middleName, portrait.lastName, portrait.nickname,
    portrait.activity, portrait.territory, ...(portrait.projects || []), ...(portrait.passions || [])
  ].filter(Boolean).join(" "));
  const chosenIdentityTerms = words([
    portrait.firstName, portrait.middleName, portrait.lastName, portrait.nickname
  ].filter(Boolean).join(" "));
  const labelTerms = normalized.split("-");
  const matchingTerms = labelTerms.filter((term) => portraitTerms.includes(term));
  const compactLength = normalized.replace(/-/g, "").length;
  const breakdown = {
    usage: family === "professional" && portrait.presence === "professionnelle" ? 25 : family === "identity" ? 22 : 18,
    readability: normalized.length <= 24 && !/\d/.test(normalized) ? 20 : normalized.length <= 32 ? 15 : 9,
    identity: labelTerms.some((term) => chosenIdentityTerms.includes(term)) ? 15 : matchingTerms.length >= 2 ? 12 : matchingTerms.length ? 9 : 5,
    tld: overlap(categories, FAMILY_SIGNALS[family] || []) ? 15 : 7,
    professional: family === "professional" || (tld.tone || []).includes("sérieux") ? 10 : 6,
    length: compactLength >= 4 && compactLength <= 18 ? 5 : compactLength <= 24 ? 3 : 1,
    international: /^[a-z0-9-]+$/.test(normalized) && !/[0-9]/.test(normalized) ? 5 : 3,
    originality: family === "rare" || (normalized.includes("-") && normalized.length < 22) ? 5 : 3
  };
  const penalties = [];
  if (normalized.length > 30) penalties.push({ reason: "nom long", points: 8 });
  if (/\d/.test(normalized)) penalties.push({ reason: "chiffre potentiellement ambigu", points: 4 });
  if ((normalized.match(/-/g) || []).length > 1) penalties.push({ reason: "plusieurs tirets", points: 4 });
  if (/(.)\1\1/.test(normalized)) penalties.push({ reason: "répétition", points: 3 });
  if (/\b(19|20)\d{2}\b/.test(normalized)) penalties.push({ reason: "information personnelle précise", points: 8 });
  const subtotal = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  const total = Math.max(0, Math.min(100, subtotal - penalties.reduce((sum, item) => sum + item.points, 0)));
  return { total, breakdown, penalties };
}
