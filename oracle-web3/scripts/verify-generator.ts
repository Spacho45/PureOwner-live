import { oracleCards } from "../src/data/oracleCards";
import { generateOracleReading } from "../src/lib/generateOracleReading";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(oracleCards.length === 21, "La collection doit contenir 21 cartes.");

for (const card of oracleCards) {
  assert(card.keywords.length === 5, `${card.name} doit contenir cinq mots-clés.`);
  assert(
    [
      card.id,
      card.name,
      card.subtitle,
      card.web2Problem,
      card.livedSituation,
      card.web3Benefit,
      card.practicalChange,
      card.caution,
    ].every((value) => value.trim().length > 0),
    `${card.name} contient un champ vide.`,
  );
}

const combinations = [
  [oracleCards[0], oracleCards[1], oracleCards[2]],
  [oracleCards[4], oracleCards[12], oracleCards[20]],
  [oracleCards[18], oracleCards[6], oracleCards[10]],
];

for (const cards of combinations) {
  const first = generateOracleReading(cards);
  const second = generateOracleReading(cards);
  assert(JSON.stringify(first) === JSON.stringify(second), "Le tirage doit être stable.");
  assert(first.synthesis.includes(cards[0].name), "La synthèse doit relier la première carte.");
  assert(first.synthesis.includes(cards[2].name), "La synthèse doit relier la troisième carte.");
  assert(first.conclusion.includes("une couche que vous contrôlez davantage"), "Le passage final est incomplet.");
}

assert(
  JSON.stringify(generateOracleReading(combinations[0])) !==
    JSON.stringify(generateOracleReading(combinations[1])),
  "Deux combinaisons différentes doivent produire des lectures différentes.",
);

console.log("Générateur validé : 21 cartes, 3 combinaisons stables et narratives.");
