type OracleGlyphProps = {
  cardId: string;
  decorative?: boolean;
};

const commonProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.35,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function OracleGlyph({ cardId, decorative = true }: OracleGlyphProps) {
  const index = [
    "la-cle",
    "le-passeport",
    "le-domaine",
    "le-coffre",
    "le-masque",
    "le-miroir",
    "le-contrat",
    "le-joyau",
    "le-registre",
    "le-pont",
    "leclair",
    "lalliance",
    "larchive",
    "la-piece",
    "le-souverain",
    "le-portail",
    "le-phare",
    "le-sceau",
    "le-refuge",
    "la-boussole",
    "laube",
  ].indexOf(cardId);

  const variant = index >= 0 ? index : 0;

  return (
    <svg
      className="oracle-glyph"
      viewBox="0 0 100 100"
      aria-hidden={decorative}
      role={decorative ? undefined : "img"}
    >
      <circle {...commonProps} cx="50" cy="50" r="34" opacity="0.34" />
      <circle {...commonProps} cx="50" cy="50" r="22" opacity="0.18" />
      {variant === 0 ? (
        <>
          <circle {...commonProps} cx="50" cy="35" r="11" />
          <path {...commonProps} d="M50 46v30m0-12h13m-13 8h8" />
        </>
      ) : null}
      {variant === 1 ? (
        <>
          <rect {...commonProps} x="34" y="25" width="32" height="50" rx="3" />
          <circle {...commonProps} cx="50" cy="42" r="9" />
          <path {...commonProps} d="M41 42h18M50 33c4 5 4 13 0 18M50 33c-4 5-4 13 0 18M41 62h18" />
        </>
      ) : null}
      {variant === 2 ? (
        <>
          <path {...commonProps} d="M50 22v16m0 0 22 13-22 27-22-27 22-13Z" />
          <circle {...commonProps} cx="50" cy="38" r="3" />
          <path {...commonProps} d="M28 51h44M50 38v40" />
        </>
      ) : null}
      {variant === 3 ? (
        <>
          <rect {...commonProps} x="27" y="34" width="46" height="37" rx="4" />
          <path {...commonProps} d="M35 34v-8h30v8M50 49v12" />
          <circle {...commonProps} cx="50" cy="47" r="3" />
        </>
      ) : null}
      {variant === 4 ? (
        <>
          <path {...commonProps} d="M20 50s12-18 30-18 30 18 30 18-12 18-30 18S20 50 20 50Z" />
          <circle {...commonProps} cx="50" cy="50" r="10" />
          <path {...commonProps} d="M50 40v20M40 50h20" opacity="0.45" />
        </>
      ) : null}
      {variant === 5 ? (
        <>
          <ellipse {...commonProps} cx="50" cy="48" rx="20" ry="28" />
          <path {...commonProps} d="M50 20v56M37 77h26" />
          <path {...commonProps} d="M43 38c4-4 10-4 14 0M43 56c4 4 10 4 14 0" opacity="0.5" />
        </>
      ) : null}
      {variant === 6 ? (
        <>
          <path {...commonProps} d="M30 22h32l8 8v48H30Z" />
          <path {...commonProps} d="M62 22v10h8M39 43h22M39 52h22M39 61h14" />
          <path {...commonProps} d="m42 70 5 5 12-12" />
        </>
      ) : null}
      {variant === 7 ? (
        <>
          <path {...commonProps} d="m50 20 24 22-24 38-24-38 24-22Z" />
          <path {...commonProps} d="M26 42h48M38 42l12 38 12-38M38 42l12-22 12 22" />
        </>
      ) : null}
      {variant === 8 ? (
        <>
          <path {...commonProps} d="M30 24h40v52H30zM38 34h24M38 44h24M38 54h24M38 64h14" />
          <circle {...commonProps} cx="68" cy="68" r="9" />
          <path {...commonProps} d="m64 68 3 3 6-7" />
        </>
      ) : null}
      {variant === 9 ? (
        <>
          <path {...commonProps} d="M18 68c8-27 20-40 32-40s24 13 32 40" />
          <path {...commonProps} d="M25 68h50M34 68V56M50 68V48M66 68V56" />
          <circle {...commonProps} cx="50" cy="28" r="4" />
        </>
      ) : null}
      {variant === 10 ? (
        <>
          <path {...commonProps} d="m55 17-27 38h21l-4 28 27-40H51Z" />
          <path {...commonProps} d="M26 77h48" opacity="0.45" />
        </>
      ) : null}
      {variant === 11 ? (
        <>
          <circle {...commonProps} cx="38" cy="48" r="17" />
          <circle {...commonProps} cx="62" cy="48" r="17" />
          <path {...commonProps} d="M30 70c10 8 30 8 40 0M50 24v48" opacity="0.6" />
        </>
      ) : null}
      {variant === 12 ? (
        <>
          <path {...commonProps} d="M27 26h46v48H27zM36 35h28v30H36z" />
          <path {...commonProps} d="M22 21h8M22 21v8M78 21h-8M78 21v8M22 79h8M22 79v-8M78 79h-8M78 79v-8" />
        </>
      ) : null}
      {variant === 13 ? (
        <>
          <circle {...commonProps} cx="50" cy="50" r="25" />
          <circle {...commonProps} cx="50" cy="50" r="17" />
          <path {...commonProps} d="M50 32v36M41 40c2-5 16-5 18 1 2 8-18 7-18 16 0 7 14 8 19 2" />
        </>
      ) : null}
      {variant === 14 ? (
        <>
          <path {...commonProps} d="M50 20 72 33v34L50 80 28 67V33Z" />
          <path {...commonProps} d="M50 20v60M28 33l22 13 22-13" />
          <circle {...commonProps} cx="50" cy="54" r="6" />
        </>
      ) : null}
      {variant === 15 ? (
        <>
          <path {...commonProps} d="M28 78V25h44v53M38 78V37h24v41" />
          <circle {...commonProps} cx="54" cy="58" r="2" />
          <path {...commonProps} d="M21 78h58" />
        </>
      ) : null}
      {variant === 16 ? (
        <>
          <path {...commonProps} d="M50 20v60M30 67 50 80l20-13M35 39c5-7 10-10 15-10s10 3 15 10" />
          <path {...commonProps} d="M29 49h42M35 58h30" opacity="0.65" />
          <circle {...commonProps} cx="50" cy="20" r="4" />
        </>
      ) : null}
      {variant === 17 ? (
        <>
          <circle {...commonProps} cx="50" cy="49" r="22" />
          <path {...commonProps} d="M50 21v11m0 34v11M22 49h11m34 0h11" />
          <path {...commonProps} d="m40 50 7 7 14-16" />
        </>
      ) : null}
      {variant === 18 ? (
        <>
          <path {...commonProps} d="M24 53c0-19 11-32 26-32s26 13 26 32v23H24Z" />
          <path {...commonProps} d="M35 76V54a15 15 0 0 1 30 0v22" />
          <circle {...commonProps} cx="50" cy="58" r="4" />
        </>
      ) : null}
      {variant === 19 ? (
        <>
          <circle {...commonProps} cx="50" cy="50" r="27" />
          <path {...commonProps} d="m50 28 8 19-8 25-8-19 8-25Z" />
          <path {...commonProps} d="M50 18v10M50 72v10M18 50h24M58 50h24" />
        </>
      ) : null}
      {variant === 20 ? (
        <>
          <path {...commonProps} d="M24 67c9-18 18-27 26-27s17 9 26 27" />
          <path {...commonProps} d="M31 67h38M38 58h24M44 49h12" />
          <circle {...commonProps} cx="50" cy="29" r="7" />
          <path {...commonProps} d="M50 17v5M38 23l4 4M62 23l-4 4" />
        </>
      ) : null}
    </svg>
  );
}
