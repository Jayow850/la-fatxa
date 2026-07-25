"use client";
// Visual size comparison: bag silhouette vs a familiar reference object.
const REFS = {
  phone:    { w: 7,  h: 15, label: "iPhone",        color: "#2A2622" },
  laptop:   { w: 30, h: 21, label: '13" Laptop',    color: "#5E2A3B" },
  bottle:   { w: 7,  h: 24, label: "Water bottle",  color: "#4A7A8B" },
  notebook: { w: 15, h: 21, label: "A5 notebook",   color: "#B08D57" },
};

export default function ScaleSvg({ product, refKey = "laptop" }) {
  const w = parseInt(product.dim_cm) || 30;
  const h = parseInt(product.dim_cm.split("×")[1]) || 24;
  const r = REFS[refKey];
  const s = 8 / 3, baseY = 180;
  const bagW = w * s, bagH = h * s, refW = r.w * s, refH = r.h * s;
  const fits = w >= r.w && h >= r.h;
  return (
    <svg viewBox="0 0 420 210" className="w-full h-auto">
      <line x1="20" y1={baseY} x2="400" y2={baseY} stroke="#EADCD3" strokeWidth="1.2" />
      <rect x="60" y={baseY - bagH} width={bagW} height={bagH} rx="7" fill="#E8D5C4" stroke="#7A2E43" strokeWidth="1.8" />
      <path d={`M ${60 + bagW * .28} ${baseY - bagH} q ${bagW * .22} -28 ${bagW * .44} 0`} fill="none" stroke="#7A2E43" strokeWidth="2.2" />
      <text x={60 + bagW / 2} y={baseY + 18} textAnchor="middle" fontSize="10" fill="#93807F" fontFamily="Jost">
        {product.name.replace("The ", "")} · {w}×{h}cm
      </text>
      <rect x="245" y={baseY - refH} width={refW} height={refH} rx="4" fill={r.color} opacity=".9" />
      <text x={245 + refW / 2} y={baseY + 18} textAnchor="middle" fontSize="10" fill="#93807F" fontFamily="Jost">
        {r.label} · {r.w}×{r.h}cm
      </text>
      <text x="210" y="28" textAnchor="middle" fontSize="11.5" fontFamily="Jost" fontWeight="500" fill={fits ? "#3f8f5a" : "#a05a3a"}>
        {fits ? `✓ ${r.label} fits inside comfortably` : `✗ ${r.label} won't fit — size up`}
      </text>
    </svg>
  );
}
export { REFS };
