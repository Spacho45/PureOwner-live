import type { OracleCard } from "../types/oracle";

export const oracleCards: OracleCard[] = [
  {
    id: "la-cle",
    number: 1,
    name: "La Clé",
    subtitle: "Ce que vous possédez réellement",
    category: "propriete",
    web2Problem:
      "Vos accès numériques dépendent de comptes administrés par des plateformes.",
    livedSituation:
      "Vous avez peut-être déjà perdu un mot de passe, reçu un code de vérification ou été temporairement bloqué hors de votre propre compte.",
    web3Benefit:
      "Une clé cryptographique permet de prouver directement que vous contrôlez une identité ou un actif numérique.",
    practicalChange:
      "Vous pouvez signer, vous connecter ou recevoir des actifs sans dépendre entièrement d’un compte centralisé.",
    caution:
      "Posséder sa clé implique de la protéger et de prévoir une solution de récupération.",
    keywords: ["clé", "wallet", "contrôle", "signature", "propriété"],
  },
  {
    id: "le-passeport",
    number: 2,
    name: "Le Passeport",
    subtitle: "Une identité qui voyage avec vous",
    category: "identite",
    web2Problem:
      "Chaque application recrée une nouvelle version de votre identité et conserve sa propre copie de vos informations.",
    livedSituation:
      "Vous avez déjà rempli plusieurs fois les mêmes formulaires, créé de nouveaux comptes ou transmis à nouveau les mêmes données.",
    web3Benefit:
      "Une identité numérique portable peut être reconnue par plusieurs services.",
    practicalChange:
      "Vous pourriez prouver certaines informations sans transmettre systématiquement toutes vos données.",
    caution:
      "Une identité portable doit rester sélective afin d’éviter de rendre toutes les activités publiques.",
    keywords: ["identité", "preuve", "portable", "connexion", "profil"],
  },
  {
    id: "le-domaine",
    number: 3,
    name: "Le Domaine",
    subtitle: "Votre point d’ancrage numérique",
    category: "nom",
    web2Problem:
      "Votre présence en ligne dépend de noms d’utilisateur dispersés entre plusieurs plateformes.",
    livedSituation:
      "Votre identifiant est parfois déjà pris, différent selon les services ou perdu lorsqu’une plateforme ferme.",
    web3Benefit:
      "Un nom Web3 peut devenir un identifiant lisible relié à votre wallet et à vos actifs.",
    practicalChange:
      "Une seule adresse peut servir de nom, de profil, de destination de paiement et de point d’accès.",
    caution:
      "Tous les domaines Web3 ne disposent pas des mêmes standards, intégrations ou garanties.",
    keywords: ["domaine", "nom", "wallet", "identité", "adresse"],
  },
  {
    id: "le-coffre",
    number: 4,
    name: "Le Coffre",
    subtitle: "Ce que vous choisissez de garder",
    category: "donnees",
    web2Problem:
      "Vos fichiers et souvenirs numériques sont souvent enfermés dans des espaces dont les règles peuvent changer.",
    livedSituation:
      "Beaucoup d’utilisateurs accumulent photos, documents et messages dans plusieurs clouds sans savoir précisément comment les récupérer ou les déplacer.",
    web3Benefit:
      "Un stockage chiffré et adressable peut vous aider à organiser des données sous des règles d’accès que vous définissez.",
    practicalChange:
      "Vous pourriez partager un document avec une autorisation vérifiable, puis retirer cet accès selon les capacités du service utilisé.",
    caution:
      "Le chiffrement ne remplace ni les sauvegardes, ni une bonne organisation, ni le choix d’un service fiable.",
    keywords: ["coffre", "données", "chiffrement", "accès", "sauvegarde"],
  },
  {
    id: "le-masque",
    number: 5,
    name: "Le Masque",
    subtitle: "Révéler seulement ce qui est utile",
    category: "confidentialite",
    web2Problem:
      "Prouver une information demande souvent de montrer un document qui en révèle beaucoup d’autres.",
    livedSituation:
      "Il est possible que vous ayez déjà envoyé une pièce d’identité complète alors qu’un service voulait seulement confirmer votre âge ou votre pays.",
    web3Benefit:
      "Des preuves sélectives peuvent confirmer un attribut sans exposer l’ensemble du document d’origine.",
    practicalChange:
      "Vous pourriez démontrer que vous remplissez une condition sans communiquer systématiquement votre identité complète.",
    caution:
      "La confidentialité dépend du protocole, de son paramétrage et des informations que vous acceptez de relier entre elles.",
    keywords: ["confidentialité", "preuve", "sélectivité", "attribut", "discrétion"],
  },
  {
    id: "le-miroir",
    number: 6,
    name: "Le Miroir",
    subtitle: "L’image que vos traces composent",
    category: "reputation",
    web2Problem:
      "Votre réputation numérique reste fragmentée entre avis, profils et historiques contrôlés par des services distincts.",
    livedSituation:
      "Une contribution appréciée sur une plateforme vous aide rarement lorsque vous arrivez dans une autre communauté.",
    web3Benefit:
      "Des attestations portables peuvent rendre certaines expériences ou contributions vérifiables ailleurs.",
    practicalChange:
      "Vous pourriez présenter des preuves de participation ou de compétence sans recréer entièrement votre historique.",
    caution:
      "Une réputation portable doit laisser une place au contexte, à l’évolution et au droit de ne pas tout montrer.",
    keywords: ["réputation", "attestation", "contribution", "confiance", "contexte"],
  },
  {
    id: "le-contrat",
    number: 7,
    name: "Le Contrat",
    subtitle: "Des règles visibles avant d’agir",
    category: "regles",
    web2Problem:
      "Les conditions d’un service sont souvent longues, modifiables et difficiles à relier à chaque action concrète.",
    livedSituation:
      "Vous avez peut-être accepté une mise à jour de conditions sans pouvoir mesurer immédiatement ce qu’elle changeait pour vous.",
    web3Benefit:
      "Un contrat programmable peut exécuter des règles publiques lorsque des conditions précises sont réunies.",
    practicalChange:
      "Une transaction ou une autorisation peut suivre une logique consultable avant votre validation.",
    caution:
      "Un code visible peut contenir des erreurs ; il doit être compris, audité et accompagné de recours adaptés.",
    keywords: ["contrat", "règles", "code", "validation", "audit"],
  },
  {
    id: "le-joyau",
    number: 8,
    name: "Le Joyau",
    subtitle: "Une singularité que vous pouvez transmettre",
    category: "actif",
    web2Problem:
      "De nombreux objets numériques restent des licences d’usage confinées à l’application qui les vend.",
    livedSituation:
      "Vous avez peut-être acheté un élément virtuel impossible à utiliser, montrer ou transmettre en dehors d’un seul service.",
    web3Benefit:
      "Un actif numérique inscrit sur un registre peut être identifiable et transférable selon des règles explicites.",
    practicalChange:
      "Vous pourriez conserver la preuve d’origine d’un objet et l’utiliser dans les environnements qui le reconnaissent.",
    caution:
      "La rareté technique ne crée pas automatiquement une valeur, une utilité ou des droits juridiques.",
    keywords: ["actif", "origine", "transfert", "objet", "traçabilité"],
  },
  {
    id: "le-registre",
    number: 9,
    name: "Le Registre",
    subtitle: "Une mémoire partagée et vérifiable",
    category: "trace",
    web2Problem:
      "Les historiques importants sont généralement conservés dans une base privée que seul l’opérateur peut modifier ou expliquer.",
    livedSituation:
      "Beaucoup d’utilisateurs doivent faire confiance à une capture d’écran ou à un relevé lorsqu’ils veulent prouver qu’une action a bien eu lieu.",
    web3Benefit:
      "Un registre partagé peut fournir une référence commune pour vérifier l’existence et l’ordre de certaines opérations.",
    practicalChange:
      "Vous pourriez contrôler une preuve de date, de transfert ou d’émission sans demander l’accès à une base interne.",
    caution:
      "Une trace immuable doit rester minimale : une information sensible ne devrait pas être publiée directement.",
    keywords: ["registre", "preuve", "historique", "vérification", "mémoire"],
  },
  {
    id: "le-pont",
    number: 10,
    name: "Le Pont",
    subtitle: "Relier sans tout recommencer",
    category: "interoperabilite",
    web2Problem:
      "Vos données et vos actifs circulent difficilement entre des services conçus comme des mondes fermés.",
    livedSituation:
      "Changer d’application signifie souvent perdre un historique, reconfigurer un profil ou abandonner des éléments accumulés.",
    web3Benefit:
      "Des standards ouverts peuvent permettre à plusieurs applications de reconnaître une même preuve ou un même actif.",
    practicalChange:
      "Vous pourriez retrouver certains éléments de votre identité numérique en passant d’un service compatible à un autre.",
    caution:
      "Les ponts et connecteurs ajoutent des dépendances techniques qui doivent être évaluées avec prudence.",
    keywords: ["pont", "standard", "interopérabilité", "migration", "compatibilité"],
  },
  {
    id: "leclair",
    number: 11,
    name: "L’Éclair",
    subtitle: "L’action directe au bon moment",
    category: "transaction",
    web2Problem:
      "Une action numérique simple peut traverser plusieurs intermédiaires, délais et systèmes de validation invisibles.",
    livedSituation:
      "Vous avez peut-être attendu qu’un paiement, un remboursement ou une validation soit traité par plusieurs acteurs.",
    web3Benefit:
      "Certains réseaux permettent un règlement ou une preuve d’action rapide entre participants.",
    practicalChange:
      "Vous pourriez déclencher une opération vérifiable sans attendre la synchronisation de toutes les bases intermédiaires.",
    caution:
      "La vitesse ne dispense pas de vérifier le destinataire, le réseau, les frais et le caractère réversible ou non de l’action.",
    keywords: ["vitesse", "transaction", "réseau", "règlement", "attention"],
  },
  {
    id: "lalliance",
    number: 12,
    name: "L’Alliance",
    subtitle: "Décider à plusieurs sans centre unique",
    category: "gouvernance",
    web2Problem:
      "Les règles d’une communauté en ligne sont souvent décidées par l’entreprise qui héberge son espace.",
    livedSituation:
      "Une plateforme peut changer ses priorités, ses tarifs ou ses règles sans que sa communauté dispose d’un véritable pouvoir de décision.",
    web3Benefit:
      "Une gouvernance partagée peut donner à plusieurs parties des moyens transparents de proposer et de voter.",
    practicalChange:
      "Vous pourriez participer à certaines décisions d’un service ou d’un collectif selon des règles connues à l’avance.",
    caution:
      "Le vote numérique ne garantit ni l’équité, ni la participation, ni l’absence de concentration du pouvoir.",
    keywords: ["gouvernance", "vote", "collectif", "règles", "participation"],
  },
  {
    id: "larchive",
    number: 13,
    name: "L’Archive",
    subtitle: "Ce qui doit rester accessible",
    category: "perennite",
    web2Problem:
      "Un lien, un contenu ou un service peut disparaître lorsque son hébergeur ferme, supprime ou réorganise ses données.",
    livedSituation:
      "Vous avez peut-être retrouvé un ancien favori devenu introuvable, ou un contenu important supprimé avec la plateforme qui l’hébergeait.",
    web3Benefit:
      "Des systèmes distribués peuvent multiplier les copies et identifier un contenu par son empreinte.",
    practicalChange:
      "Vous pourriez vérifier qu’un document est identique à sa version d’origine et le retrouver auprès de plusieurs sources.",
    caution:
      "La persistance doit respecter les droits, la confidentialité et le besoin légitime de corriger ou retirer certains contenus.",
    keywords: ["archive", "pérennité", "empreinte", "contenu", "mémoire"],
  },
  {
    id: "la-piece",
    number: 14,
    name: "La Pièce",
    subtitle: "Échanger une valeur numérique",
    category: "echange",
    web2Problem:
      "Les échanges en ligne dépendent souvent d’intermédiaires qui imposent leurs horaires, territoires et conditions.",
    livedSituation:
      "Beaucoup d’utilisateurs connaissent des délais, des plafonds ou des frais difficiles à anticiper lorsqu’ils échangent de la valeur en ligne.",
    web3Benefit:
      "Un jeton peut représenter une unité échangeable sur un réseau accessible à ses participants.",
    practicalChange:
      "Vous pourriez transférer une valeur ou un droit d’usage directement vers une adresse compatible.",
    caution:
      "Les jetons peuvent être volatils, mal conçus ou réglementés différemment ; ils ne constituent pas une promesse de gain.",
    keywords: ["échange", "jeton", "valeur", "transfert", "prudence"],
  },
  {
    id: "le-souverain",
    number: 15,
    name: "Le Souverain",
    subtitle: "Choisir qui peut agir en votre nom",
    category: "autonomie",
    web2Problem:
      "Votre identité numérique est souvent soumise aux permissions d’un compte principal que la plateforme peut suspendre ou limiter.",
    livedSituation:
      "Il est possible que l’accès à plusieurs outils dépende d’une seule adresse, d’un seul appareil ou d’un fournisseur de connexion.",
    web3Benefit:
      "Une identité auto-administrée peut vous permettre de gérer directement plusieurs clés et délégations.",
    practicalChange:
      "Vous pourriez autoriser un appareil ou un service pour une tâche précise sans lui céder tout le contrôle.",
    caution:
      "L’autonomie exige des règles claires, des limites de permission et des procédures de récupération testées.",
    keywords: ["autonomie", "permission", "délégation", "contrôle", "récupération"],
  },
  {
    id: "le-portail",
    number: 16,
    name: "Le Portail",
    subtitle: "Entrer sans recréer une identité",
    category: "connexion",
    web2Problem:
      "Chaque nouveau service vous demande souvent un compte, un mot de passe et une nouvelle copie de vos informations.",
    livedSituation:
      "Vous avez probablement utilisé plusieurs boutons de connexion et oublié quel fournisseur avait servi pour quel compte.",
    web3Benefit:
      "Une connexion par signature peut prouver le contrôle d’une adresse sans créer un mot de passe supplémentaire.",
    practicalChange:
      "Vous pourriez accéder à un service compatible en confirmant une demande lisible depuis votre wallet.",
    caution:
      "Une demande de signature doit être comprise avant validation ; toutes les interfaces ne la présentent pas clairement.",
    keywords: ["connexion", "signature", "accès", "wallet", "permission"],
  },
  {
    id: "le-phare",
    number: 17,
    name: "Le Phare",
    subtitle: "Rendre la confiance plus lisible",
    category: "verification",
    web2Problem:
      "Il est difficile de distinguer une source authentique d’une imitation lorsque les repères dépendent d’une interface ou d’un badge privé.",
    livedSituation:
      "Beaucoup d’utilisateurs hésitent devant un profil, un document ou un message qui semble officiel sans pouvoir en vérifier facilement l’origine.",
    web3Benefit:
      "Une signature ou une attestation peut relier un contenu à l’émetteur qui l’a produit.",
    practicalChange:
      "Vous pourriez contrôler l’origine d’une preuve avant de lui accorder votre confiance.",
    caution:
      "Une signature confirme un émetteur, pas nécessairement la vérité, la qualité ou l’intention de ce qu’il affirme.",
    keywords: ["vérification", "origine", "signature", "source", "confiance"],
  },
  {
    id: "le-sceau",
    number: 18,
    name: "Le Sceau",
    subtitle: "Une preuve sans copie superflue",
    category: "attestation",
    web2Problem:
      "Les diplômes, certificats et justificatifs circulent souvent sous forme de fichiers faciles à copier et longs à vérifier.",
    livedSituation:
      "Vous avez peut-être envoyé plusieurs fois le même PDF puis attendu qu’une organisation contacte son émetteur.",
    web3Benefit:
      "Une attestation vérifiable peut confirmer qu’une information a été émise par une source identifiée.",
    practicalChange:
      "Vous pourriez présenter une preuve dont l’authenticité est contrôlable sans multiplier les échanges manuels.",
    caution:
      "L’attestation doit pouvoir expirer, être révoquée ou corrigée lorsque la situation change.",
    keywords: ["attestation", "certificat", "preuve", "émetteur", "révocation"],
  },
  {
    id: "le-refuge",
    number: 19,
    name: "Le Refuge",
    subtitle: "Prévoir le retour quand tout se complique",
    category: "recuperation",
    web2Problem:
      "La récupération d’un compte dépend souvent d’une adresse secondaire, d’un numéro de téléphone ou du support d’une plateforme.",
    livedSituation:
      "Un changement de téléphone ou la perte d’un appareil peut transformer une simple connexion en parcours de vérification incertain.",
    web3Benefit:
      "Des mécanismes de récupération sociale ou multi-signature peuvent répartir la capacité de restaurer un accès.",
    practicalChange:
      "Vous pourriez définir à l’avance plusieurs gardiens, appareils ou étapes pour retrouver le contrôle.",
    caution:
      "Un refuge efficace doit être testé, mis à jour et conçu sans créer un nouveau point de faiblesse.",
    keywords: ["récupération", "gardien", "sécurité", "continuité", "accès"],
  },
  {
    id: "la-boussole",
    number: 20,
    name: "La Boussole",
    subtitle: "Choisir avant de se connecter",
    category: "discernement",
    web2Problem:
      "Les interfaces vous poussent souvent à accepter rapidement des permissions dont la portée reste abstraite.",
    livedSituation:
      "Vous avez peut-être cliqué sur “tout accepter” pour continuer, puis oublié quels services pouvaient accéder à vos données.",
    web3Benefit:
      "Des permissions explicites et vérifiables peuvent rendre plus visible ce qu’une application demande.",
    practicalChange:
      "Vous pourriez comparer une demande avec votre intention et retirer certaines autorisations lorsque le protocole le permet.",
    caution:
      "Aucune interface ne remplace votre discernement ; une permission claire peut toujours être trop large.",
    keywords: ["discernement", "permission", "choix", "lecture", "intention"],
  },
  {
    id: "laube",
    number: 21,
    name: "L’Aube",
    subtitle: "Commencer par une couche de plus",
    category: "transition",
    web2Problem:
      "Le passage vers de nouveaux usages numériques paraît souvent radical, technique et incompatible avec les habitudes existantes.",
    livedSituation:
      "Beaucoup d’utilisateurs renoncent avant d’essayer parce qu’ils pensent devoir changer tous leurs outils en une seule fois.",
    web3Benefit:
      "Le Web3 peut s’ajouter progressivement à des services familiers par une clé, un nom ou une preuve portable.",
    practicalChange:
      "Vous pourriez commencer par un seul usage utile, le comprendre, puis décider librement de la suite.",
    caution:
      "Une transition saine reste progressive, réversible lorsque c’est possible et guidée par un besoin réel.",
    keywords: ["transition", "début", "progression", "usage", "choix"],
  },
];
