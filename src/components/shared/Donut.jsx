// Hand-rolled SVG donut (spec §2: no chart library in v1). Renders proportional arcs
// with a legend. Used for the Sales mix pie. Falls back to a neutral ring when empty.
import { int } from '../../lib/format'

function arc(cx, cy, r, startAngle, endAngle) {
  const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const [x1, y1] = p(startAngle)
  const [x2, y2] = p(endAngle)
  const large = endAngle - startAngle > Math.PI ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
}

export function Donut({ data, size = 132, thickness = 22, unit = '' }) {
  const cx = size / 2
  const cy = size / 2
  const r = (size - thickness) / 2
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0)

  // Prefix-sum the fractions into arc angles (start at 12 o'clock) without reassigning
  // any captured variable.
  const TWO_PI = Math.PI * 2
  const START = -Math.PI / 2
  const fracs = data.map((d) => (total > 0 ? Math.max(0, d.value) / total : 0))
  const segments = data.map((d, i) => {
    const before = fracs.slice(0, i).reduce((s, f) => s + f, 0)
    const start = START + before * TWO_PI
    const end = start + fracs[i] * TWO_PI
    return { ...d, frac: fracs[i], start, end }
  })

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} role="img" aria-label="Sales mix">
        {total === 0 && (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={thickness} />
        )}
        {segments.map((s, i) =>
          s.frac > 0 ? (
            <path
              key={i}
              d={arc(cx, cy, r, s.start, s.frac >= 1 ? s.end - 0.001 : s.end)}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
            />
          ) : null,
        )}
      </svg>
      <ul className="space-y-1 text-[12px]">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
            <span className="text-cesim-ink">{d.label}</span>
            <span className="ml-auto tabular-nums text-cesim-muted">
              {int(d.value)} {unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
