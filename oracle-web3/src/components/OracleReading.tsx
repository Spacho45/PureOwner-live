import type {
  OracleCard as OracleCardType,
  OracleReading as OracleReadingType,
} from "../types/oracle";
import { OracleGlyph } from "./OracleGlyph";

type OracleReadingProps = {
  cards: OracleCardType[];
  reading: OracleReadingType;
};

const positions = ["PASSÉ", "PRÉSENT", "ÉVOLUTION"] as const;

export function OracleReading({ cards, reading }: OracleReadingProps) {
  const sections = [
    {
      heading: "Votre passé numérique",
      body: reading.past,
      card: cards[0],
    },
    {
      heading: "Ce que votre présent révèle",
      body: reading.present,
      card: cards[1],
    },
    {
      heading: "Ce qui pourrait changer",
      body: reading.future,
      card: cards[2],
    },
    {
      heading: "La combinaison de vos trois cartes",
      body: reading.synthesis,
      card: cards[1],
      combined: true,
    },
    {
      heading: "Ce que le Web3 ne résout pas seul",
      body: reading.caution,
      card: cards[0],
      caution: true,
    },
  ];

  return (
    <section className="oracle-reading" aria-labelledby="reading-title">
      <div className="oracle-reading__header">
        <p>VOTRE TIRAGE</p>
        <h2 id="reading-title">{reading.title}</h2>
        <div className="oracle-reading__ornament" aria-hidden="true">
          <span />
        </div>
        <p>{reading.introduction}</p>
      </div>

      <div className="oracle-reading__cards" aria-label="Vos trois cartes révélées">
        {cards.map((card, index) => (
          <figure key={card.id}>
            <figcaption>{positions[index]}</figcaption>
            <div className="oracle-reading-card">
              <div className="oracle-reading-card__symbol">
                <OracleGlyph cardId={card.id} />
              </div>
              <span>{String(card.number).padStart(2, "0")}</span>
              <strong>{card.name}</strong>
              <small>{card.subtitle}</small>
            </div>
          </figure>
        ))}
      </div>

      <div className="oracle-reading__body">
        {sections.map((section) => (
          <article className="oracle-reading__section" key={section.heading}>
            <div
              className={`oracle-reading__section-icon${section.caution ? " is-caution" : ""}`}
              aria-hidden="true"
            >
              {section.combined ? (
                <span className="oracle-combination-icon">
                  <i />
                  <i />
                  <i />
                </span>
              ) : (
                <OracleGlyph cardId={section.card.id} />
              )}
            </div>
            <div>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </div>
          </article>
        ))}

        <article className="oracle-reading__section oracle-reading__passage">
          <div className="oracle-reading__section-icon oracle-passage-icon" aria-hidden="true">
            <span />
          </div>
          <div>
            <h3>Votre passage</h3>
            {reading.conclusion.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
