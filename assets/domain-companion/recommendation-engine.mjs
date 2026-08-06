import { generateLabels } from "./name-generator.mjs";
import { scoreCandidate } from "./scoring.mjs";
import { availabilityProvider } from "./availability.mjs";

const FAMILY_TLDS = {
  identity: [".com", ".fr", ".me", ".family", ".eth"],
  professional: [".digital", ".com", ".pro", ".consulting", ".io"],
  creative: [".studio", ".art", ".music", ".digital", ".x"],
  rare: [".eth", ".x", ".crypto", ".wallet", ".nft"]
};

function selectTlds(catalog, family, portrait) {
  const wanted = FAMILY_TLDS[family] || [];
  const ranked = [...catalog].sort((a, b) => {
    const aIndex = wanted.indexOf(a.tld);
    const bIndex = wanted.indexOf(b.tld);
    const aRank = aIndex < 0 ? 99 : aIndex;
    const bRank = bIndex < 0 ? 99 : bIndex;
    if (portrait.territory && /france|strasbourg|alsace/i.test(portrait.territory)) {
      if (a.tld === ".fr") return -1;
      if (b.tld === ".fr") return 1;
    }
    return aRank - bRank;
  });
  return ranked.filter((item) => item.active !== false).slice(0, 5);
}

export async function recommendDomains(portrait, catalog, limitPerFamily = 3) {
  const labels = generateLabels(portrait);
  const families = ["identity", "professional", "creative", "rare"];
  const recommendations = {};
  for (const family of families) {
    const familyLabels = labels[family].length ? labels[family] : labels.identity;
    const candidates = [];
    for (const label of familyLabels.slice(0, 7)) {
      for (const tld of selectTlds(catalog, family, portrait).slice(0, 3)) {
        const domain = `${label}${tld.tld}`;
        const score = scoreCandidate({ label, tld, family, portrait });
        const availability = await availabilityProvider.check(domain);
        candidates.push({ domain, label, tld, family, score, availability });
      }
    }
    recommendations[family] = candidates
      .sort((a, b) => b.score.total - a.score.total || a.domain.localeCompare(b.domain))
      .filter((candidate, index, all) => all.findIndex((item) => item.domain === candidate.domain) === index)
      .slice(0, limitPerFamily);
  }
  return recommendations;
}
