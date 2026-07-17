import { useEffect, useRef, useState } from "react";
import type {
  OracleCard as OracleCardType,
  OracleReading as OracleReadingType,
} from "../types/oracle";

type OracleActionsProps = {
  cards: OracleCardType[];
  reading: OracleReadingType;
  onRestart: () => void;
};

export function formatReadingText(
  cards: OracleCardType[],
  reading: OracleReadingType,
): string {
  return [
    "PUREOWNER — ORACLE WEB3",
    reading.title,
    `Passé — ${cards[0].name} : ${cards[0].subtitle}`,
    `Présent — ${cards[1].name} : ${cards[1].subtitle}`,
    `Évolution — ${cards[2].name} : ${cards[2].subtitle}`,
    reading.introduction,
    "VOTRE PASSÉ NUMÉRIQUE",
    reading.past,
    "CE QUE VOTRE PRÉSENT RÉVÈLE",
    reading.present,
    "CE QUI POURRAIT CHANGER",
    reading.future,
    "LA COMBINAISON DE VOS TROIS CARTES",
    reading.synthesis,
    "CE QUE LE WEB3 NE RÉSOUT PAS SEUL",
    reading.caution,
    "VOTRE PASSAGE",
    reading.conclusion,
  ].join("\n\n");
}

async function copyText(text: string): Promise<void> {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copiedWithSelection = document.execCommand("copy");
  textarea.remove();

  if (copiedWithSelection) return;

  if (navigator.clipboard?.writeText) {
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise<never>((_, reject) => {
        window.setTimeout(() => reject(new Error("Clipboard timeout")), 700);
      }),
    ]);
    return;
  }

  throw new Error("La copie n’a pas pu être effectuée.");
}

function ActionIcon({ name }: { name: "restart" | "copy" | "share" }) {
  if (name === "restart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4v6h6M20 20v-6h-6" />
        <path d="M6.5 17.5a8 8 0 0 1 .8-12.2L10 8M14 16l2.7 2.7a8 8 0 0 0 .8-12.2" />
      </svg>
    );
  }

  if (name === "copy") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="7" y="7" width="12" height="13" rx="2" />
        <path d="M5 17H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 16V3m0 0L7 8m5-5 5 5" />
      <path d="M5 12H3v9h18v-9h-2" />
    </svg>
  );
}

export function OracleActions({ cards, reading, onRestart }: OracleActionsProps) {
  const [status, setStatus] = useState("");
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const manualCopyRef = useRef<HTMLTextAreaElement>(null);
  const text = formatReadingText(cards, reading);

  useEffect(() => {
    if (!manualCopy || !manualCopyRef.current) return;
    manualCopyRef.current.focus();
    manualCopyRef.current.select();
  }, [manualCopy]);

  const handleCopy = async (): Promise<boolean> => {
    setStatus("Copie en cours…");
    try {
      await copyText(text);
      setStatus("Votre tirage a été copié.");
      return true;
    } catch {
      setManualCopy(text);
      setStatus("Copie automatique bloquée : le texte est sélectionné ci-dessous.");
      return false;
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      const copied = await handleCopy();
      setStatus(
        copied
          ? "Le partage natif est indisponible : votre tirage a été copié."
          : "Le partage natif est indisponible : copiez le texte sélectionné.",
      );
      return;
    }

    try {
      await navigator.share({
        title: "PureOwner — Oracle Web3",
        text,
      });
      setStatus("Le panneau de partage a été ouvert.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Partage annulé.");
      } else {
        const copied = await handleCopy();
        setStatus(
          copied
            ? "Le partage n’a pas abouti : votre tirage a été copié."
            : "Le partage n’a pas abouti : copiez le texte sélectionné.",
        );
      }
    }
  };

  return (
    <footer className="oracle-actions">
      <div className="oracle-actions__buttons">
        <button type="button" className="oracle-button oracle-button--outline" onClick={onRestart}>
          <ActionIcon name="restart" />
          REFAIRE UN TIRAGE
        </button>
        <button type="button" className="oracle-button oracle-button--outline" onClick={handleCopy}>
          <ActionIcon name="copy" />
          COPIER MON TIRAGE
        </button>
        <button type="button" className="oracle-button oracle-button--outline" onClick={handleShare}>
          <ActionIcon name="share" />
          PARTAGER
        </button>
      </div>
      <p className="oracle-actions__status" role="status" aria-live="polite">
        {status}
      </p>
      {manualCopy ? (
        <div
          className="oracle-manual-copy"
          role="dialog"
          aria-modal="true"
          aria-labelledby="manual-copy-title"
          aria-describedby="manual-copy-help"
        >
          <div className="oracle-manual-copy__panel">
            <p className="oracle-manual-copy__eyebrow">COPIE MANUELLE</p>
            <h2 id="manual-copy-title">Votre tirage est prêt à être copié</h2>
            <p id="manual-copy-help">
              Le texte est déjà sélectionné. Utilisez ⌘C sur Mac ou Ctrl+C sur Windows.
            </p>
            <textarea ref={manualCopyRef} readOnly value={manualCopy} aria-label="Texte complet du tirage" />
            <button
              type="button"
              className="oracle-button oracle-button--primary"
              onClick={() => setManualCopy(null)}
            >
              FERMER
            </button>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
