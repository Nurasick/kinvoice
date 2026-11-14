/**
 * A family snapshot on the fridge: Mom with Sarah, Emily and Mike, drawn as a flat cartoon in a
 * Polaroid frame. Decorative; the scene's accessible label already tells the story. Owner: Nurali.
 */
import s from "./landing.module.css";

interface Person {
  x: number;
  /** head centre y */
  y: number;
  skin: string;
  top: string;
  hair: string;
  /** what sits behind the head: long hair, ponytail or bun */
  back?: "long" | "ponytail" | "bun";
  glasses?: boolean;
}

// Drawn back to front: Emily, Sarah, Mike, then Mom in front.
const PEOPLE: readonly Person[] = [
  { x: 38, y: 70, skin: "#f1c6a8", top: "#4fc59f", hair: "#b5502b", back: "ponytail" },
  { x: 76, y: 62, skin: "#e9b48f", top: "#2550c0", hair: "#4a2f22", back: "long" },
  { x: 160, y: 60, skin: "#d9a07a", top: "#ffb81c", hair: "#2b2420" },
  { x: 118, y: 78, skin: "#f0c9a9", top: "#b49ad6", hair: "#c9c9cf", back: "bun", glasses: true },
];

const R = 15;

function Back({ p }: { p: Person }) {
  if (p.back === "long") {
    return <path d={`M${p.x - 17} ${p.y + 22}Q${p.x - 21} ${p.y - 19} ${p.x} ${p.y - 19}Q${p.x + 21} ${p.y - 19} ${p.x + 17} ${p.y + 22}Z`} fill={p.hair} />;
  }
  if (p.back === "ponytail") {
    return <ellipse cx={p.x + 15} cy={p.y - 4} rx={6} ry={12} transform={`rotate(24 ${p.x + 15} ${p.y - 4})`} fill={p.hair} />;
  }
  if (p.back === "bun") return <circle cx={p.x} cy={p.y - 17} r={7} fill={p.hair} />;
  return null;
}

function Figure({ p }: { p: Person }) {
  const { x, y } = p;
  const neck = y + 17;
  return (
    <g>
      {/* torso with rounded shoulders that start right under the chin */}
      <path
        d={`M${x - 24} 150V${neck + 14}Q${x - 24} ${neck + 1} ${x - 11} ${neck}H${x + 11}Q${x + 24} ${neck + 1} ${x + 24} ${neck + 14}V150Z`}
        fill={p.top}
      />
      <Back p={p} />
      <rect x={x - 4} y={y + 10} width={8} height={10} rx={3} fill={p.skin} />
      <circle cx={x} cy={y} r={R} fill={p.skin} />
      {/* hair cap with a soft fringe */}
      <path
        d={`M${x - 16} ${y + 1}Q${x - 16} ${y - 18} ${x} ${y - 17}Q${x + 16} ${y - 18} ${x + 16} ${y + 1}Q${x + 9} ${y - 9} ${x} ${y - 9}Q${x - 9} ${y - 9} ${x - 16} ${y + 1}Z`}
        fill={p.hair}
      />
      <circle cx={x - 8} cy={y + 6} r={2.6} fill="#f29b8b" opacity={0.55} />
      <circle cx={x + 8} cy={y + 6} r={2.6} fill="#f29b8b" opacity={0.55} />
      <circle cx={x - 5} cy={y + 1} r={1.6} fill="#2a2420" />
      <circle cx={x + 5} cy={y + 1} r={1.6} fill="#2a2420" />
      {p.glasses && (
        <g fill="none" stroke="#5b5f6b" strokeWidth={1.2}>
          <circle cx={x - 5} cy={y + 1} r={4} />
          <circle cx={x + 5} cy={y + 1} r={4} />
          <path d={`M${x - 1} ${y + 1}h2`} />
        </g>
      )}
      <path d={`M${x - 5} ${y + 7}Q${x} ${y + 11.5} ${x + 5} ${y + 7}`} fill="none" stroke="#7a3b2e" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

export function FamilyPhoto({ caption }: { caption: string }) {
  return (
    <figure className={`${s.photo} ${s.paperShadow}`}>
      <svg viewBox="0 0 200 150" className="block w-full rounded-[2px]" aria-hidden>
        <rect width="200" height="150" fill="#cfe6f7" />
        <circle cx="176" cy="24" r="12" fill="#ffdf5e" />
        <path d="M0 116Q60 94 120 110T200 102V150H0Z" fill="#9bd3a3" />
        <path d="M0 132Q70 118 140 128T200 124V150H0Z" fill="#86c28f" />
        {PEOPLE.map((p) => (
          <Figure key={p.x} p={p} />
        ))}
      </svg>
      <figcaption className={`${s.hand} mt-1.5 text-center text-[1.05rem] leading-tight text-[#2a2a33]`}>{caption}</figcaption>
    </figure>
  );
}
