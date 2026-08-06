const FACET_RULES = [
  {
    label: "Créatif",
    adjective: "créative",
    signals: [
      { label: "de la musique", terms: ["musique", "music", ".music", ".studio", ".art"] },
      { label: "du Web3", terms: ["web3", ".eth", ".crypto", ".wallet", ".nft", ".x", ".brave"] }
    ]
  },
  {
    label: "Professionnel",
    adjective: "professionnelle",
    signals: [
      { label: "d’une activité professionnelle", terms: [".pro", ".digital", ".consulting", ".company", "entrepreneur", "business"] }
    ]
  },
  {
    label: "Territorial",
    adjective: "territoriale",
    signals: [
      { label: "d’un ancrage territorial", terms: ["strasbourg", "alsace", "france", ".fr"] }
    ]
  },
  {
    label: "Autonome",
    adjective: "autonome",
    signals: [
      { label: "des identités portables", terms: ["wallet", "portable", "décentralisé", "decentralise", ".eth", ".crypto"] }
    ]
  }
];

function naturalList(items) {
  if (items.length < 2) return items[0] || "certains thèmes";
  if (items.length === 2) return `${items[0]} et ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} et ${items.at(-1)}`;
}

function searchOnly(journal = []) {
  return journal.filter((entry) => entry.origin === "search" || entry.field === "domainSearch" || entry.field === "domain");
}

export function suggestFacetsFromJournal(journal = [], decisions = []) {
  const searchable = searchOnly(journal).map((entry) => String(entry.value || "").toLocaleLowerCase("fr"));
  const decided = new Set(decisions.map((decision) => decision.label));
  return FACET_RULES.flatMap((rule) => {
    if (decided.has(rule.label)) return [];
    const evidence = rule.signals
      .filter((signal) => signal.terms.some((term) => searchable.some((value) => value.includes(term))))
      .map((signal) => signal.label);
    if (!evidence.length) return [];
    return [{
      label: rule.label,
      status: "suggested",
      origin: "search",
      evidence,
      explanation: `Vos recherches autour ${naturalList(evidence)} pourraient révéler une facette ${rule.adjective}. Souhaitez-vous l’ajouter à votre portrait ?`
    }];
  });
}

export function upsertFacetDecision(decisions = [], decision) {
  return [...decisions.filter((item) => item.label !== decision.label), {
    label: String(decision.label).trim(),
    status: decision.status,
    origin: decision.origin,
    decidedAt: decision.decidedAt || new Date().toISOString()
  }].filter((item) => item.label);
}

export function removeFacetDecision(decisions = [], label) {
  return decisions.filter((item) => item.label !== label);
}

export function migrateFacetDecisions(decisions, confirmedFacets = []) {
  if (Array.isArray(decisions) && (decisions.length || !confirmedFacets.length)) return decisions;
  return confirmedFacets.map((label) => ({ label, status: "chosen", origin: "search", decidedAt: null }));
}

export function facetOriginLabel(origin) {
  return {
    direct: "Réponse directe",
    search: "Recherche PureOwner",
    manual: "Préférence ajoutée manuellement"
  }[origin] || "Origine non précisée";
}
