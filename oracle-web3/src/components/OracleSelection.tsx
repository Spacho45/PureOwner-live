import type { OracleCard as OracleCardType } from "../types/oracle";
import { OracleCardGrid } from "./OracleCardGrid";

type OracleSelectionProps = {
  cards: OracleCardType[];
  selectedIds: string[];
  showIds: boolean;
  onToggle: (card: OracleCardType) => void;
  onReveal: () => void;
};

export function OracleSelection({
  cards,
  selectedIds,
  showIds,
  onToggle,
  onReveal,
}: OracleSelectionProps) {
  const ready = selectedIds.length === 3;

  return (
    <section className="oracle-selection" aria-labelledby="selection-title">
      <h2 id="selection-title" className="sr-only">
        Choisissez trois cartes
      </h2>
      <OracleCardGrid
        cards={cards}
        selectedIds={selectedIds}
        showIds={showIds}
        onToggle={onToggle}
      />
      <div className="oracle-selection__controls">
        <div className="oracle-selection__rule" aria-hidden="true" />
        <p className="oracle-counter" aria-live="polite" aria-atomic="true">
          <strong>{selectedIds.length} / 3</strong>
          <span>{ready ? "Le passage est prêt" : "cartes choisies"}</span>
        </p>
        <button
          type="button"
          className="oracle-button oracle-button--primary"
          disabled={!ready}
          onClick={onReveal}
        >
          RÉVÉLER MON TIRAGE
        </button>
      </div>
    </section>
  );
}
