import { normalizeLabel } from "./normalization.mjs";

const text = (value) => String(value || "").trim();

function firstItem(value) {
  if (Array.isArray(value)) return text(value[0]);
  return text(value).split(",").map((item) => item.trim()).find(Boolean) || "";
}

function domain(label, extension) {
  return `${normalizeLabel(label) || "mon-identite"}${extension}`;
}

export function buildDomainOrientations(profile = {}) {
  const firstName = text(profile.firstName);
  const lastName = text(profile.lastName);
  const nickname = text(profile.nickname) || firstName;
  const activity = firstItem(profile.activities || profile.activity);
  const occupation = firstItem(profile.occupations || profile.passions);
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || nickname || "mon identité";
  const shortName = nickname || firstName || lastName || "moi";
  const signature = [firstName, lastName].filter(Boolean).join("-") || shortName;
  const professionalBase = [lastName || shortName, activity].filter(Boolean).join("-") || signature;

  return {
    social: {
      eyebrow: "Vie sociale & privée",
      title: "L’image que vous choisissez de partager",
      description: "Pour vos réseaux, communautés et espaces plus personnels.",
      choices: [
        { id: "social-authentic", title: "Authentique", domain: domain(shortName, ".social"), tone: "Proche, spontané et humain", preview: "Un point de départ pour vos profils, vos liens choisis et vos cercles." },
        { id: "social-creative", title: "Créatif", domain: domain([shortName, occupation].filter(Boolean).join("-"), ".life"), tone: "Expressif et singulier", preview: "Un espace pour vos goûts, vos créations et les récits que vous décidez de montrer." },
        { id: "social-community", title: "Communautaire", domain: domain([shortName, activity].filter(Boolean).join("-"), ".community"), tone: "Ouvert et fédérateur", preview: "Une adresse commune pour réunir vos réseaux et vos communautés." },
        { id: "social-private", title: "Cercle choisi", domain: domain(`${shortName}-prive`, ".me"), tone: "Discret et maîtrisé", preview: "Une porte d’entrée privée où chaque partage reste intentionnel." }
      ]
    },
    personal: {
      eyebrow: "Navigation & IA",
      title: "La présence qui vous accompagne sur le Web",
      description: "Pour exprimer vos préférences auprès des sites et des intelligences artificielles.",
      choices: [
        { id: "personal-stable", title: "Identité stable", domain: domain(signature, ".id"), tone: "Reconnaissable et portable", preview: "Une identité constante, réutilisable sans reconstruire votre profil à chaque service." },
        { id: "personal-dialogue", title: "Dialogue avec les IA", domain: domain(`${shortName}-context`, ".ai"), tone: "Contextuel et explicite", preview: "Une carte de préférences qui indique aux IA comment vous présenter et vous assister." },
        { id: "personal-sovereign", title: "Souverain", domain: domain(`${shortName}-owner`, ".digital"), tone: "Autonome et contrôlé", preview: "Un socle personnel où consentements, données et accès restent sous votre contrôle." },
        { id: "personal-explorer", title: "Explorateur", domain: domain([shortName, occupation].filter(Boolean).join("-"), ".web3"), tone: "Curieux et évolutif", preview: "Une présence capable d’évoluer avec vos usages, vos communautés et vos découvertes." }
      ]
    },
    professional: {
      eyebrow: "Présence professionnelle",
      title: "L’image formelle que vous souhaitez refléter",
      description: "Pour votre activité, vos preuves, vos contacts et votre réputation.",
      choices: [
        { id: "professional-signature", title: "Signature personnelle", domain: domain(signature, ".com"), tone: "Sobre et universel", preview: `Une présentation claire de ${fullName}, de son parcours et de ses contacts.` },
        { id: "professional-expert", title: "Expertise", domain: domain(professionalBase, ".pro"), tone: "Précis et crédible", preview: "Un espace centré sur vos compétences, vos réalisations et vos références." },
        { id: "professional-studio", title: "Studio / activité", domain: domain([shortName, activity || "studio"].filter(Boolean).join("-"), ".studio"), tone: "Créatif et structuré", preview: "Une vitrine pour vos projets, méthodes, collaborations et offres." },
        { id: "professional-advisory", title: "Conseil", domain: domain(lastName || shortName, ".consulting"), tone: "Institutionnel et rassurant", preview: "Une présence formelle pour présenter votre vision, vos services et vos engagements." }
      ]
    }
  };
}

export function constellationReady(selections = {}) {
  return ["social", "personal", "professional"].every((key) => Boolean(selections[key]));
}

export function buildConstellation(profile = {}, selections = {}) {
  const orientations = buildDomainOrientations(profile);
  const nodes = Object.entries(orientations).map(([key, column]) => ({
    key,
    label: column.eyebrow,
    choice: column.choices.find((choice) => choice.id === selections[key]) || null
  }));
  return {
    identity: [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.nickname || "Votre identité",
    ready: nodes.every((node) => node.choice),
    nodes
  };
}
