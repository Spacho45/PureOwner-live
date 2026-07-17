import type { OracleCard, OracleReading } from "../types/oracle";
import { hashString, pickSeeded, seededRandom } from "./seededRandom";

const passage = `Vous n’avez pas besoin de quitter le Web que vous utilisez aujourd’hui.

Vous pouvez continuer à utiliser vos applications, vos services et vos habitudes.

Le changement consiste à ajouter progressivement une couche que vous contrôlez davantage :

un nom, une clé, une preuve, une réputation ou un actif numérique.`;

function lowerFirst(value: string): string {
  return value.charAt(0).toLocaleLowerCase("fr-FR") + value.slice(1);
}

function toward(name: string): string {
  if (name.startsWith("Le ")) return `au ${name.slice(3)}`;
  if (name.startsWith("Les ")) return `aux ${name.slice(4)}`;
  return `à ${name}`;
}

export function generateOracleReading(cards: OracleCard[]): OracleReading {
  if (cards.length !== 3) {
    throw new Error("Un tirage de l’Oracle Web3 doit contenir exactement trois cartes.");
  }

  const [pastCard, presentCard, futureCard] = cards;
  const seed = hashString(cards.map((card) => card.id).join("::"));
  const random = seededRandom(seed);
  const sharedKeyword =
    pastCard.keywords.find(
      (keyword) =>
        presentCard.keywords.includes(keyword) || futureCard.keywords.includes(keyword),
    ) ?? presentCard.keywords[Math.floor(random() * presentCard.keywords.length)];

  const title = pickSeeded(
    [
      `${pastCard.name}, ${presentCard.name}, ${futureCard.name} : votre passage`,
      `De ${pastCard.name} ${toward(futureCard.name)}`,
      `Trois cartes pour une identité plus consciente`,
    ],
    random,
  );

  const introduction = pickSeeded(
    [
      `Votre tirage dessine un mouvement : reconnaître ce qui dépend encore d’un intermédiaire, observer la manière dont votre identité circule aujourd’hui, puis envisager une couche numérique que vous pourriez davantage piloter.`,
      `Ces trois cartes ne prédisent rien. Elles proposent une lecture de vos usages : d’abord la trace d’une dépendance, ensuite son mécanisme actuel, enfin une évolution possible à explorer avec méthode.`,
      `Entre ${pastCard.name}, ${presentCard.name} et ${futureCard.name}, l’oracle met moins en scène une rupture qu’un déplacement progressif de la confiance vers des preuves et des choix plus explicites.`,
    ],
    random,
  );

  const past = pickSeeded(
    [
      `${pastCard.livedSituation} Derrière cette expérience, ${lowerFirst(pastCard.web2Problem)} ${pastCard.name} vous invite ainsi à distinguer l’usage que vous faites d’un service de ce que vous contrôlez réellement.`,
      `${pastCard.name} ouvre le tirage par une scène familière : ${lowerFirst(pastCard.livedSituation)} Cette situation rappelle que ${lowerFirst(pastCard.web2Problem)} Ce passé n’est pas une faute ; c’est le fonctionnement ordinaire du Web actuel.`,
      `La première carte revient sur une dépendance souvent discrète. ${pastCard.livedSituation} Autrement dit, ${lowerFirst(pastCard.web2Problem)} Nommer ce mécanisme est déjà une façon de reprendre de la perspective.`,
    ],
    random,
  );

  const present = pickSeeded(
    [
      `Avec ${presentCard.name}, le mécanisme devient plus lisible : ${lowerFirst(presentCard.web2Problem)} ${presentCard.livedSituation} Votre présent numérique se joue donc moins dans la quantité de services utilisés que dans les liens de confiance qui les relient à vous.`,
      `${presentCard.name} place le regard sur l’architecture actuelle. ${presentCard.livedSituation} Dans ce contexte, ${lowerFirst(presentCard.web2Problem)} La carte ne demande pas de tout remplacer, mais de voir où passent vos permissions, vos preuves et vos habitudes.`,
      `Au centre, ${presentCard.name} révèle une tension entre simplicité et dépendance. ${presentCard.web2Problem} ${presentCard.livedSituation} C’est ici que le mot « ${sharedKeyword} » prend son sens : il devient un choix à rendre plus explicite.`,
    ],
    random,
  );

  const future = pickSeeded(
    [
      `${futureCard.name} ouvre une possibilité concrète : ${lowerFirst(futureCard.web3Benefit)} Dans la pratique, ${lowerFirst(futureCard.practicalChange)} Cette évolution ne demande pas de quitter vos outils actuels, mais de tester une nouvelle couche là où elle vous est utile.`,
      `La troisième carte ne promet pas un avenir automatique. Elle suggère que ${lowerFirst(futureCard.web3Benefit)} Ainsi, ${lowerFirst(futureCard.practicalChange)} Le changement possible tient dans cette capacité à choisir le bon niveau de contrôle.`,
      `Avec ${futureCard.name}, le tirage passe de l’observation à l’expérimentation. ${futureCard.web3Benefit} Il devient alors possible que ${lowerFirst(futureCard.practicalChange)} Une étape modeste et comprise vaut mieux qu’une migration précipitée.`,
    ],
    random,
  );

  const synthesis = pickSeeded(
    [
      `${pastCard.name} montre le point de départ, ${presentCard.name} en révèle la structure et ${futureCard.name} propose un levier. Ensemble, les cartes relient ${pastCard.keywords[0]}, ${presentCard.keywords[1]} et ${futureCard.keywords[2]} : ce que vous utilisez peut progressivement être accompagné de preuves, de permissions ou d’actifs que vous comprenez mieux.`,
      `La combinaison avance par couches. ${pastCard.name} nomme ce qui vous a rendu dépendant ; ${presentCard.name} aide à voir comment cette dépendance circule ; ${futureCard.name} transforme cette lecture en option pratique. Le fil commun est « ${sharedKeyword} » : non comme une promesse, mais comme un critère pour choisir vos prochains usages.`,
      `Ces cartes se complètent sans opposer brutalement Web2 et Web3. ${pastCard.name} rappelle une limite vécue, ${presentCard.name} clarifie l’intermédiaire présent et ${futureCard.name} ajoute une capacité possible. Votre passage consiste à conserver ce qui fonctionne tout en rendant une part de votre identité plus portable, lisible ou maîtrisée.`,
    ],
    random,
  );

  const caution = pickSeeded(
    [
      `Le Web3 déplace certaines responsabilités au lieu de les faire disparaître. Pour ${pastCard.name}, retenez ceci : ${lowerFirst(pastCard.caution)} ${presentCard.name} ajoute une seconde vigilance : ${lowerFirst(presentCard.caution)} Enfin, ${futureCard.name} rappelle que ${lowerFirst(futureCard.caution)} Avancez avec des usages limités, des vérifications simples et une solution de retour.`,
      `Aucun protocole ne remplace votre attention, la qualité d’un service ou un recours humain. ${pastCard.caution} De même, ${lowerFirst(presentCard.caution)} Et avant d’adopter la perspective de ${futureCard.name}, gardez en tête que ${lowerFirst(futureCard.caution)}`,
      `La combinaison demande trois formes de prudence : protéger ce qui donne accès, comprendre ce qui est rendu visible et vérifier ce qui devient irréversible. Concrètement, ${lowerFirst(pastCard.caution)} Ensuite, ${lowerFirst(presentCard.caution)} Enfin, ${lowerFirst(futureCard.caution)}`,
    ],
    random,
  );

  return {
    title,
    introduction,
    past,
    present,
    future,
    synthesis,
    caution,
    conclusion: passage,
  };
}
