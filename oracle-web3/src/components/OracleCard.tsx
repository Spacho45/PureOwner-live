import type { CSSProperties } from "react";
import type { OracleCard as OracleCardType } from "../types/oracle";
import { OracleGlyph } from "./OracleGlyph";

type OracleCardProps = {
  card: OracleCardType;
  selected?: boolean;
  selectionIndex?: number;
  faceUp?: boolean;
  revealed?: boolean;
  disabled?: boolean;
  interactive?: boolean;
  showId?: boolean;
  revealDelay?: number;
  onToggle?: (card: OracleCardType) => void;
};

export function OracleCard({
  card,
  selected = false,
  selectionIndex,
  faceUp = false,
  revealed = false,
  disabled = false,
  interactive = true,
  showId = false,
  revealDelay = 0,
  onToggle,
}: OracleCardProps) {
  const className = [
    "oracle-card",
    selected ? "is-selected" : "",
    faceUp ? "is-face-up" : "",
    revealed ? "is-revealed" : "",
    disabled ? "is-disabled" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cardStyle = { "--reveal-delay": `${revealDelay}ms` } as CSSProperties;
  const content = (
    <span className="oracle-card__inner">
      <span className="oracle-card__face oracle-card__back" aria-hidden="true">
        <span className="oracle-card__back-border" />
        <span className="oracle-card__back-geometry">
          <span className="oracle-card__diamond oracle-card__diamond--one" />
          <span className="oracle-card__diamond oracle-card__diamond--two" />
          <span className="oracle-card__orbit" />
        </span>
        <span className="oracle-monogram" aria-hidden="true">
          <span className="oracle-monogram__letters">PO</span>
          <span className="oracle-monogram__keyhole" />
        </span>
        <span className="oracle-card__corner oracle-card__corner--top" />
        <span className="oracle-card__corner oracle-card__corner--bottom" />
      </span>
      <span className="oracle-card__face oracle-card__front" aria-hidden={!faceUp}>
        <span className="oracle-card__front-frame" />
        <span className="oracle-card__number">{String(card.number).padStart(2, "0")}</span>
        <span className="oracle-card__glyph-wrap">
          <OracleGlyph cardId={card.id} />
        </span>
        <span className="oracle-card__front-copy">
          <strong>{card.name}</strong>
          <span>{card.subtitle}</span>
        </span>
        {showId ? <code className="oracle-card__id">{card.id}</code> : null}
      </span>
      {selected && selectionIndex ? (
        <span className="oracle-card__selection-order" aria-hidden="true">
          {selectionIndex}
        </span>
      ) : null}
      {showId && !faceUp ? <code className="oracle-card__id--back">{card.id}</code> : null}
    </span>
  );

  if (!interactive) {
    return (
      <div
        className={className}
        style={cardStyle}
        role="img"
        aria-label={`${card.name}, ${card.subtitle}`}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={cardStyle}
      aria-label={
        selected
          ? `Désélectionner la carte ${selectionIndex} sur 3`
          : "Sélectionner cette carte face cachée"
      }
      aria-pressed={selected}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled || selected) onToggle?.(card);
      }}
    >
      {content}
    </button>
  );
}
