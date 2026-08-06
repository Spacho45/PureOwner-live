import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normalizeLabel, uniqueLabels } from "../assets/domain-companion/normalization.mjs";
import { generateLabels } from "../assets/domain-companion/name-generator.mjs";
import { scoreCandidate, SCORE_WEIGHTS } from "../assets/domain-companion/scoring.mjs";
import { recommendDomains } from "../assets/domain-companion/recommendation-engine.mjs";
import { UnverifiedAvailabilityProvider } from "../assets/domain-companion/availability.mjs";
import {
  buildDomainOrientations,
  buildConstellation,
  constellationReady
} from "../assets/domain-companion/constellation.mjs";
import {
  suggestFacetsFromJournal,
  upsertFacetDecision,
  removeFacetDecision,
  facetOriginLabel
} from "../assets/domain-companion/facet-model.mjs";

const catalog = JSON.parse(await readFile(new URL("../data/tlds.json", import.meta.url), "utf8"));
const nicolas = {
  firstName: "Nicolas",
  middleName: "Jean",
  lastName: "Schneider",
  nickname: "Nico",
  territory: "Strasbourg, France",
  activity: "entrepreneur Web3",
  projects: ["projet international"],
  passions: ["Web3", "musique", "entrepreneuriat"],
  presence: "les deux",
  tone: "pionnier",
  autonomy: "décentralisé"
};

test("normalise les caractères européens en labels DNS lisibles", () => {
  assert.equal(normalizeLabel(" François de l’Œuvre "), "francois-de-loeuvre");
  assert.equal(normalizeLabel("Straße & Æsir — Łódź"), "strasse-aesir-lodz");
  assert.equal(normalizeLabel("---Nico___Web3---"), "nico-web3");
  assert.ok(normalizeLabel("a".repeat(90)).length <= 63);
});

test("déduplique les variantes après normalisation", () => {
  assert.deepEqual(uniqueLabels(["Nico", "nico", "Níco", "nico-"]), ["nico"]);
});

test("génère les quatre familles de Nicolas de façon déterministe", () => {
  const first = generateLabels(nicolas);
  const second = generateLabels(nicolas);
  assert.deepEqual(first, second);
  assert.ok(first.identity.includes("nicolas-schneider"));
  assert.ok(first.identity.includes("nico"));
  assert.ok(first.professional.some((label) => label.includes("schneider")));
  assert.ok(first.creative.some((label) => label.includes("musique") || label.includes("web3")));
  assert.ok(first.rare.length > 0);
});

test("le barème public totalise exactement 100 points", () => {
  assert.equal(Object.values(SCORE_WEIGHTS).reduce((sum, value) => sum + value, 0), 100);
});

test("explique les bonus et pénalités du score", () => {
  const fr = catalog.find((item) => item.tld === ".fr");
  const clear = scoreCandidate({ label: "nicolas-schneider", tld: fr, family: "identity", portrait: nicolas });
  const risky = scoreCandidate({ label: "nicolas--schneider-1986-tres-long-identifiant", tld: fr, family: "identity", portrait: nicolas });
  assert.ok(clear.total > risky.total);
  assert.ok(risky.penalties.length >= 2);
  assert.equal(Object.keys(clear.breakdown).length, 8);
});

test("recommande quatre costumes et laisse la disponibilité non vérifiée", async () => {
  const result = await recommendDomains(nicolas, catalog, 3);
  assert.deepEqual(Object.keys(result), ["identity", "professional", "creative", "rare"]);
  for (const candidates of Object.values(result)) {
    assert.equal(candidates.length, 3);
    assert.ok(candidates.every((candidate) => candidate.availability.label === "Disponibilité à vérifier"));
    assert.ok(candidates.every((candidate) => candidate.score.total >= 0 && candidate.score.total <= 100));
  }
});

test("le fournisseur de disponibilité n’invente jamais une réponse", async () => {
  const provider = new UnverifiedAvailabilityProvider();
  assert.deepEqual(await provider.check("nico.fr"), {
    domain: "nico.fr",
    status: "unverified",
    label: "Disponibilité à vérifier",
    checkedAt: null
  });
});

test("une recherche suggère une facette sans la choisir silencieusement", () => {
  const journal = [{ value: "musique Web3", field: "domainSearch", origin: "search" }];
  const suggestions = suggestFacetsFromJournal(journal, []);
  const creative = suggestions.find((facet) => facet.label === "Créatif");
  assert.equal(creative.status, "suggested");
  assert.equal(creative.origin, "search");
  assert.match(creative.explanation, /pourraient révéler/);
  assert.match(creative.explanation, /Souhaitez-vous/);
});

test("une décision explicite peut choisir, écarter puis reconsidérer une facette", () => {
  let decisions = upsertFacetDecision([], { label: "Créatif", status: "chosen", origin: "search", decidedAt: "2026-01-01" });
  assert.equal(decisions[0].status, "chosen");
  decisions = upsertFacetDecision(decisions, { label: "Créatif", status: "rejected", origin: "search", decidedAt: "2026-01-02" });
  assert.equal(decisions.length, 1);
  assert.equal(decisions[0].status, "rejected");
  decisions = removeFacetDecision(decisions, "Créatif");
  assert.deepEqual(decisions, []);
});

test("l’origine d’une facette reste lisible", () => {
  assert.equal(facetOriginLabel("direct"), "Réponse directe");
  assert.equal(facetOriginLabel("search"), "Recherche PureOwner");
  assert.equal(facetOriginLabel("manual"), "Préférence ajoutée manuellement");
});

test("compose trois colonnes de quatre orientations", () => {
  const orientations = buildDomainOrientations({
    firstName: "Nicolas",
    lastName: "Schneider",
    nickname: "Nico",
    activities: "entrepreneuriat Web3, musique",
    occupations: "conférencier, collectionneur"
  });
  assert.deepEqual(Object.keys(orientations), ["social", "personal", "professional"]);
  for (const column of Object.values(orientations)) {
    assert.equal(column.choices.length, 4);
    assert.ok(column.choices.every((choice) => choice.domain.includes(".")));
  }
  assert.match(orientations.social.choices[0].domain, /^nico\./);
  assert.match(orientations.professional.choices[0].domain, /^nicolas-schneider\./);
});

test("la constellation exige un choix dans chacun des trois univers", () => {
  const profile = { firstName: "Nicolas", lastName: "Schneider", nickname: "Nico" };
  const incomplete = { social: "social-authentic", personal: "personal-stable" };
  assert.equal(constellationReady(incomplete), false);
  const selections = { ...incomplete, professional: "professional-signature" };
  assert.equal(constellationReady(selections), true);
  const constellation = buildConstellation(profile, selections);
  assert.equal(constellation.ready, true);
  assert.equal(constellation.nodes.length, 3);
  assert.ok(constellation.nodes.every((node) => node.choice?.domain));
});
