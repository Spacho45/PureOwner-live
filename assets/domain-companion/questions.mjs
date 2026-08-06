export const QUESTIONS = [
  {
    id: "intent",
    field: "intent",
    type: "choice",
    eyebrow: "Votre point de départ",
    vision: "Vous êtes plus que les profils que les plateformes construisent de vous.",
    title: "Que voulez-vous garder en propre ?",
    help: "Choisissez un premier repère. Vous pourrez le modifier à tout moment.",
    options: ["Mon nom", "Mon site", "Mon activité", "Mes accès"]
  },
  {
    id: "presence",
    field: "presence",
    type: "choice",
    eyebrow: "Présence choisie",
    title: "Cette identité sera-t-elle personnelle ou professionnelle ?",
    help: "Vous pourrez garder les deux dimensions dans votre portrait.",
    options: ["personnelle", "professionnelle", "les deux"]
  },
  {
    id: "firstName",
    field: "firstName",
    type: "text",
    eyebrow: "Identité",
    title: "Quel prénom voulez-vous rendre visible ?",
    placeholder: "Votre prénom ou prénom d’usage",
    help: "Le prénom d’usage peut être différent de votre état civil."
  },
  {
    id: "middleName",
    field: "middleName",
    type: "text",
    eyebrow: "Nuance",
    title: "Un deuxième prénom compte-t-il dans votre identité ?",
    placeholder: "Facultatif",
    help: "Vous pouvez passer cette question."
  },
  {
    id: "lastName",
    field: "lastName",
    type: "text",
    eyebrow: "Identité",
    title: "Quel nom voulez-vous associer à cette présence ?",
    placeholder: "Votre nom choisi",
    help: "Il sert à créer des variantes lisibles, jamais à vous suivre ailleurs."
  },
  {
    id: "nickname",
    field: "nickname",
    type: "text",
    eyebrow: "Nom familier",
    title: "Avez-vous un pseudonyme ou un nom court ?",
    placeholder: "Ex. Nico",
    help: "Un pseudonyme peut devenir une identité numérique à part entière."
  },
  {
    id: "activity",
    field: "activity",
    type: "text",
    eyebrow: "Projet",
    title: "Quelle activité voulez-vous rendre reconnaissable ?",
    placeholder: "Ex. entrepreneur du Web3",
    help: "Quelques mots suffisent."
  },
  {
    id: "passions",
    field: "passions",
    type: "tags",
    eyebrow: "Ce qui vous anime",
    title: "Quels thèmes voulez-vous relier à votre nom ?",
    placeholder: "Ex. musique, Web3, transmission",
    help: "Séparez vos idées par des virgules."
  },
  {
    id: "territory",
    field: "territory",
    type: "text",
    eyebrow: "Ancrage",
    title: "Un territoire fait-il partie de votre histoire ?",
    placeholder: "Ex. Strasbourg, Alsace, France",
    help: "Indiquez seulement ce que vous souhaitez rendre visible."
  },
  {
    id: "tone",
    field: "tone",
    type: "choice",
    eyebrow: "Tonalité",
    title: "Quelle impression votre nom doit-il laisser ?",
    help: "Cette préférence influence le choix des extensions.",
    options: ["sobre", "créatif", "pionnier", "proche"]
  },
  {
    id: "autonomy",
    field: "autonomy",
    type: "choice",
    eyebrow: "Autonomie",
    title: "Quel niveau d’indépendance recherchez-vous ?",
    help: "Le Web classique et le Web3 n’offrent pas les mêmes usages.",
    options: ["simple à utiliser", "portable", "décentralisé", "à explorer"]
  }
];

export const SECTION_CONTEXT = {
  top: "l’accueil PureOwner",
  etat: "le constat sur l’identité numérique",
  torrents: "le transfert de propriété",
  usages: "les usages d’un nom numérique",
  rarete: "la rareté des noms",
  marketplace: "le marché des domaines",
  learn: "les ressources pédagogiques",
  accompagnement: "l’accompagnement PureOwner",
  reserver: "la réservation d’un nom",
  about: "la vision PureOwner",
  guide: "le guide PureOwner",
  comparison: "la comparaison Web2 et Web3"
};
