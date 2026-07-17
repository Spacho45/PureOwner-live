import type { OracleCard as OracleCardType } from "../types/oracle";
import { OracleCard } from "./OracleCard";

const positions = ["PASSÉ", "PRÉSENT", "ÉVOLUTION"] as const;

type OracleRevealProps = {
  cards: OracleCardType[];
  revealedCount: number;
};

export function OracleReveal({ cards, revealedCount }: OracleRevealProps) {
  return (
    <section className="oracle-reveal" aria-labelledby="reveal-title">
      <p className="oracle-reveal__kicker">VOTRE COMBINAISON</p>
      <h2 id="reveal-title">Les cartes se dévoilent</h2>
      <p className="oracle-reveal__status" aria-live="polite">
        {revealedCount < 3
          ? `Révélation ${Math.min(revealedCount + 1, 3)} sur 3`
          : "Votre tirage est complet"}
      </p>
      <div className="oracle-reveal__cards">
        {cards.map((card, index) => (
          <figure className="oracle-reveal__item" key={card.id}>
            <figcaption>{positions[index]}</figcaption>
            <OracleCard
              card={card}
              interactive={false}
              faceUp
              revealed={index < revealedCount}
              revealDelay={index * 90}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
