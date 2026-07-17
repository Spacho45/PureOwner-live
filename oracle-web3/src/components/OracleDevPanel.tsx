import { useState } from "react";
import type { OracleCard as OracleCardType } from "../types/oracle";

type OracleDevPanelProps = {
  cards: OracleCardType[];
  animationsEnabled: boolean;
  showIds: boolean;
  onAnimationsChange: (enabled: boolean) => void;
  onShowIdsChange: (enabled: boolean) => void;
  onForce: (ids: string[]) => void;
  onReset: () => void;
};

export function OracleDevPanel({
  cards,
  animationsEnabled,
  showIds,
  onAnimationsChange,
  onShowIdsChange,
  onForce,
  onReset,
}: OracleDevPanelProps) {
  const [open, setOpen] = useState(false);
  const [forcedIds, setForcedIds] = useState([
    cards[0].id,
    cards[1].id,
    cards[2].id,
  ]);
  const [jsonCardId, setJsonCardId] = useState(cards[0].id);
  const jsonCard = cards.find((card) => card.id === jsonCardId) ?? cards[0];
  const validForce = new Set(forcedIds).size === 3;

  return (
    <aside className={`oracle-dev${open ? " is-open" : ""}`} aria-label="Outils de démonstration">
      <button
        type="button"
        className="oracle-dev__toggle"
        aria-expanded={open}
        aria-controls="oracle-dev-panel"
        aria-label={open ? "Fermer les outils de démonstration" : "Ouvrir les outils de démonstration"}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.8 2.8-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1 1.7v.2h-4v-.2a1.8 1.8 0 0 0-1-1.7 1.8 1.8 0 0 0-2 .4l-.1.1-2.8-2.8.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.7-1H2.7v-4h.2a1.8 1.8 0 0 0 1.7-1 1.8 1.8 0 0 0-.4-2l-.1-.1 2.8-2.8.1.1a1.8 1.8 0 0 0 2 .4 1.8 1.8 0 0 0 1-1.7v-.2h4v.2a1.8 1.8 0 0 0 1 1.7 1.8 1.8 0 0 0 2-.4l.1-.1 2.8 2.8-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.7 1h.2v4h-.2a1.8 1.8 0 0 0-1.7 1Z" />
        </svg>
      </button>

      <div id="oracle-dev-panel" className="oracle-dev__panel" hidden={!open}>
        <h2>Mode démonstration</h2>
        <label className="oracle-dev__check">
          <input
            type="checkbox"
            checked={animationsEnabled}
            onChange={(event) => onAnimationsChange(event.target.checked)}
          />
          Animations
        </label>
        <label className="oracle-dev__check">
          <input
            type="checkbox"
            checked={showIds}
            onChange={(event) => onShowIdsChange(event.target.checked)}
          />
          Afficher les IDs
        </label>

        <fieldset>
          <legend>Forcer une combinaison</legend>
          {forcedIds.map((id, index) => (
            <label key={`force-${index}`}>
              Position {index + 1}
              <select
                value={id}
                onChange={(event) => {
                  setForcedIds((current) =>
                    current.map((value, currentIndex) =>
                      currentIndex === index ? event.target.value : value,
                    ),
                  );
                }}
              >
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.number}. {card.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button
            type="button"
            className="oracle-dev__button"
            disabled={!validForce}
            onClick={() => onForce(forcedIds)}
          >
            FORCER
          </button>
          {!validForce ? <p>Choisissez trois cartes différentes.</p> : null}
        </fieldset>

        <label>
          Données JSON
          <select value={jsonCardId} onChange={(event) => setJsonCardId(event.target.value)}>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                {card.name}
              </option>
            ))}
          </select>
        </label>
        <pre>{JSON.stringify(jsonCard, null, 2)}</pre>
        <button type="button" className="oracle-dev__button" onClick={onReset}>
          RÉINITIALISER
        </button>
      </div>
    </aside>
  );
}
