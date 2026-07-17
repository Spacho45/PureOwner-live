import type { OracleCard as OracleCardType } from "../types/oracle";
import { OracleCard } from "./OracleCard";

type OracleCardGridProps = {
  cards: OracleCardType[];
  selectedIds: string[];
  showIds: boolean;
  onToggle: (card: OracleCardType) => void;
};

export function OracleCardGrid({
  cards,
  selectedIds,
  showIds,
  onToggle,
}: OracleCardGridProps) {
  const limitReached = selectedIds.length >= 3;

  return (
    <div className="oracle-card-grid" role="group" aria-label="Les 21 cartes de l’oracle">
      {cards.map((card) => {
        const selectedIndex = selectedIds.indexOf(card.id);
        const selected = selectedIndex >= 0;

        return (
          <OracleCard
            key={card.id}
            card={card}
            selected={selected}
            selectionIndex={selected ? selectedIndex + 1 : undefined}
            disabled={limitReached && !selected}
            showId={showIds}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
}
