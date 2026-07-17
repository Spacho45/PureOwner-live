import { useEffect, useMemo, useRef, useState } from "react";
import { OracleActions } from "./components/OracleActions";
import { OracleDevPanel } from "./components/OracleDevPanel";
import { OracleIntro } from "./components/OracleIntro";
import { OracleReading } from "./components/OracleReading";
import { OracleReveal } from "./components/OracleReveal";
import { OracleSelection } from "./components/OracleSelection";
import { oracleCards } from "./data/oracleCards";
import { generateOracleReading } from "./lib/generateOracleReading";
import type { OracleCard, OracleStage } from "./types/oracle";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export default function App() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [stage, setStage] = useState<OracleStage>("selection");
  const [revealedCount, setRevealedCount] = useState(0);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [showIds, setShowIds] = useState(false);
  const revealRun = useRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const motionAllowed = animationsEnabled && !prefersReducedMotion;

  const selectedCards = useMemo(
    () =>
      selectedIds
        .map((id) => oracleCards.find((card) => card.id === id))
        .filter((card): card is OracleCard => Boolean(card)),
    [selectedIds],
  );

  const reading = useMemo(
    () => (selectedCards.length === 3 ? generateOracleReading(selectedCards) : null),
    [selectedCards],
  );

  const toggleCard = (card: OracleCard) => {
    setSelectedIds((current) => {
      if (current.includes(card.id)) {
        return current.filter((id) => id !== card.id);
      }
      return current.length < 3 ? [...current, card.id] : current;
    });
  };

  const startReveal = () => {
    if (selectedCards.length !== 3) return;

    const run = revealRun.current + 1;
    revealRun.current = run;
    setRevealedCount(0);
    setStage("revealing");
    window.scrollTo({ top: 0, behavior: motionAllowed ? "smooth" : "auto" });

    if (!motionAllowed) {
      window.setTimeout(() => {
        if (revealRun.current !== run) return;
        setRevealedCount(3);
        setStage("reading");
      }, 80);
      return;
    }

    [520, 1220, 1920].forEach((delay, index) => {
      window.setTimeout(() => {
        if (revealRun.current === run) setRevealedCount(index + 1);
      }, delay);
    });

    window.setTimeout(() => {
      if (revealRun.current !== run) return;
      setStage("reading");
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    }, 2750);
  };

  const reset = () => {
    revealRun.current += 1;
    setSelectedIds([]);
    setRevealedCount(0);
    setStage("selection");
    window.scrollTo({ top: 0, behavior: motionAllowed ? "smooth" : "auto" });
  };

  const forceCombination = (ids: string[]) => {
    if (new Set(ids).size !== 3) return;
    revealRun.current += 1;
    setSelectedIds(ids);
    setRevealedCount(0);
    setStage("selection");
  };

  return (
    <div className={`oracle-app${motionAllowed ? "" : " animations-off"}`}>
      <a className="skip-link" href="#oracle-main">
        Aller au contenu
      </a>
      <div className="oracle-app__outer-frame" aria-hidden="true" />
      <main id="oracle-main" className="oracle-shell">
        {stage === "selection" ? (
          <>
            <OracleIntro />
            <OracleSelection
              cards={oracleCards}
              selectedIds={selectedIds}
              showIds={showIds}
              onToggle={toggleCard}
              onReveal={startReveal}
            />
          </>
        ) : null}

        {stage === "revealing" ? (
          <OracleReveal cards={selectedCards} revealedCount={revealedCount} />
        ) : null}

        {stage === "reading" && reading ? (
          <>
            <OracleReading cards={selectedCards} reading={reading} />
            <OracleActions cards={selectedCards} reading={reading} onRestart={reset} />
          </>
        ) : null}
      </main>

      {import.meta.env.DEV ? (
        <OracleDevPanel
          cards={oracleCards}
          animationsEnabled={animationsEnabled}
          showIds={showIds}
          onAnimationsChange={setAnimationsEnabled}
          onShowIdsChange={setShowIds}
          onForce={forceCombination}
          onReset={reset}
        />
      ) : null}
    </div>
  );
}
