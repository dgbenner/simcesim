// Hand-rolled SVG stress gauge (spec §2: no chart library). Semicircular dial, green →
// amber → red, with a needle at `value` (0–100) and a center readout.
function polar(cx, cy, r, angleDeg) {
  const a = (angleDeg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}
function arcPath(cx, cy, r, startDeg, endDeg) {
  const [x1, y1] = polar(cx, cy, r, startDeg)
  const [x2, y2] = polar(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

export function Gauge({ value = 0, label = 'Stress', width = 180 }) {
  const v = Math.max(0, Math.min(100, value))
  const cx = width / 2
  const cy = width / 2
  const r = width / 2 - 16
  // 180° sweep from left (180°) to right (360°/0°).
  const zones = [
    { from: 0, to: 0.5, color: '#3aa544' }, // green
    { from: 0.5, to: 0.78, color: '#e8b500' }, // amber
    { from: 0.78, to: 1, color: '#d8382b' }, // red
  ]
  const toDeg = (f) => 180 + f * 180
  const needleDeg = toDeg(v / 100)
  const [nx, ny] = polar(cx, cy, r - 6, needleDeg)

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={width / 2 + 16} role="img" aria-label={`${label}: ${Math.round(v)}%`}>
        {zones.map((z, i) => (
          <path
            key={i}
            d={arcPath(cx, cy, r, toDeg(z.from), toDeg(z.to))}
            fill="none"
            stroke={z.color}
            strokeWidth={12}
          />
        ))}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#2a2f36" strokeWidth={2.5} />
        <circle cx={cx} cy={cy} r={4} fill="#2a2f36" />
        <text x={cx} y={cy - 14} textAnchor="middle" className="fill-cesim-ink" style={{ fontSize: 18, fontWeight: 700 }}>
          {Math.round(v)}%
        </text>
      </svg>
      <div className="text-[12px] font-semibold text-cesim-muted">{label}</div>
    </div>
  )
}
