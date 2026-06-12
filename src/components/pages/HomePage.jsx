import { useMemo, useState } from 'react'
import { useUI } from '../../state/ui'
import { SUMMARY, ROUND_META } from '../../data/roundResults'
import { COMPLETED_ROUNDS } from '../../data/roundResults'
import { ROUNDS, HOTEL_RED, COURSE } from '../../data/team'
import { CURRENT_ROUND, CURRENT_DEADLINE } from '../../data/config'
import { cn } from '../../lib/cn'
import { pct, usdShort } from '../../lib/format'

// HOME — read-only dashboard mirroring the real Cesim home (spec addendum §3). A results
// carousel (3 KPIs: cumulative TSR, cumulative earnings, EBITDA prev 6 months) charting
// Hotel Red across rounds against the competition range, plus the standard side cards.
// Hotel Red is the user's series; competitors inform the min/max envelope (identities
// ghosted per the anonymization rule). Round 4 is in progress → shown as a pending slot.

const RED = 1 // Hotel Red column index
const COMP = [0, 2, 3] // competitor column indices

// Running sum of net profit per team → cumulative earnings by round.
function cumulativeEarnings() {
  const out = {}
  let running = [0, 0, 0, 0]
  for (const n of COMPLETED_ROUNDS) {
    running = running.map((v, i) => v + (SUMMARY.netProfit[n]?.[i] ?? 0))
    out[n] = [...running]
  }
  return out
}

function KpiChart({ data, fmt }) {
  const W = 380, H = 176, padT = 12, padB = 26, padL = 10, padR = 10
  const plotH = H - padT - padB
  const slots = [1, 2, 3, 4]

  const reds = COMPLETED_ROUNDS.map((n) => data[n][RED])
  const comps = COMPLETED_ROUNDS.flatMap((n) => COMP.map((i) => data[n][i]))
  const all = [...reds, ...comps, 0]
  const lo = Math.min(...all), hi = Math.max(...all)
  const span = hi - lo || 1
  const y = (v) => padT + plotH * (1 - (v - lo) / span)
  const zeroY = y(0)
  const slotW = (W - padL - padR) / slots.length

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="KPI by round">
      {/* zero baseline */}
      <line x1={padL} y1={zeroY} x2={W - padR} y2={zeroY} stroke="#cbd5e1" strokeWidth="1" />
      {slots.map((n, k) => {
        const cx = padL + slotW * k + slotW / 2
        const pending = !COMPLETED_ROUNDS.includes(n)
        if (pending) {
          return (
            <g key={n}>
              <rect x={cx - 16} y={padT} width="32" height={plotH} fill="none" stroke="#e2e8f0" strokeDasharray="3 3" rx="3" />
              <text x={cx} y={zeroY - 6} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 8 }}>pending</text>
              <text x={cx} y={H - 8} textAnchor="middle" className="fill-slate-500" style={{ fontSize: 10 }}>R{n}</text>
            </g>
          )
        }
        const redV = data[n][RED]
        const cVals = COMP.map((i) => data[n][i])
        const cMin = Math.min(...cVals), cMax = Math.max(...cVals)
        const barX = cx - 15
        const wx = cx + 13 // competition whisker x (just right of the bar)
        return (
          <g key={n}>
            {/* competition min–max range */}
            <line x1={wx} y1={y(cMax)} x2={wx} y2={y(cMin)} stroke="#94a3b8" strokeWidth="2" />
            <line x1={wx - 3} y1={y(cMax)} x2={wx + 3} y2={y(cMax)} stroke="#94a3b8" strokeWidth="2" />
            <line x1={wx - 3} y1={y(cMin)} x2={wx + 3} y2={y(cMin)} stroke="#94a3b8" strokeWidth="2" />
            {/* Hotel Red bar */}
            <rect x={barX} y={Math.min(zeroY, y(redV))} width="22" height={Math.abs(y(redV) - zeroY)} fill="#c0392b" rx="2" />
            <text x={cx} y={H - 8} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 10 }}>R{n}</text>
            <text x={barX + 11} y={(redV >= 0 ? y(redV) - 4 : y(redV) + 10)} textAnchor="middle" className="fill-cesim-ink" style={{ fontSize: 8.5, fontWeight: 700 }}>
              {fmt(redV)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function ResultsCarousel() {
  const cumEarn = useMemo(() => cumulativeEarnings(), [])
  const slides = [
    { title: 'Cumulative total shareholder return', sub: '% per annum', data: SUMMARY.tsr, fmt: (v) => pct(v, 0) },
    { title: 'Cumulative earnings', sub: 'running net profit, USD', data: cumEarn, fmt: usdShort },
    { title: 'EBITDA, previous 6 months', sub: 'USD', data: SUMMARY.ebitda, fmt: usdShort },
  ]
  const [i, setI] = useState(0)
  const s = slides[i]
  const go = (d) => setI((p) => (p + d + slides.length) % slides.length)

  return (
    <div className="card p-4">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-[14px] font-bold text-cesim-ink">Results summary</h2>
          <div className="text-[12px] font-semibold text-cesim-link">{s.title}</div>
          <div className="text-[11px] text-cesim-muted">{s.sub}</div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => go(-1)} className="grid h-6 w-6 place-items-center rounded border border-gray-300 text-cesim-muted hover:border-cesim-link hover:text-cesim-link" aria-label="Previous KPI">‹</button>
          <button type="button" onClick={() => go(1)} className="grid h-6 w-6 place-items-center rounded border border-gray-300 text-cesim-muted hover:border-cesim-link hover:text-cesim-link" aria-label="Next KPI">›</button>
        </div>
      </div>

      <KpiChart data={s.data} fmt={s.fmt} />

      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] text-cesim-muted">
          <span className="flex items-center gap-1"><span className="inline-block h-2 w-2.5 rounded-sm bg-brand-red" /> Hotel Red</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-0.5 bg-slate-400" /> Competition range</span>
        </div>
        <div className="flex items-center gap-1.5">
          {slides.map((_, k) => (
            <button key={k} type="button" onClick={() => setI(k)} aria-label={`Slide ${k + 1}`}
              className={cn('h-1.5 w-1.5 rounded-full', k === i ? 'bg-cesim-link' : 'bg-gray-300')} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Card({ title, children, action }) {
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-cesim-ink">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  )
}

const ACTIVITY = [
  { who: null, text: 'Results available for Round 3 · Winter', when: 'Jun 11' },
  { who: 'Dan Benner', text: 'updated Sales decisions for Round 4', when: 'Jun 11' },
  { who: 'Maddie Lenarz Hooyman', text: 'submitted decisions', when: 'Jun 10' },
  { who: 'Sara Hawkins-Lindau', text: 'reviewed the market outlook', when: 'Jun 10' },
  { who: null, text: 'Round 4 · Summer opened — decisions due Jun 16', when: 'Jun 9' },
]

function ActivityCard() {
  return (
    <Card title="Activity">
      <ul className="space-y-2">
        {ACTIVITY.map((a, k) => (
          <li key={k} className="flex items-start gap-2 text-[12px] leading-snug">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cesim-link/50" />
            <span className="flex-1 text-cesim-ink">
              {a.who && <span className="font-semibold">{a.who} </span>}
              <span className={a.who ? 'text-cesim-muted' : 'text-cesim-ink'}>{a.text}</span>
            </span>
            <span className="shrink-0 text-[10px] text-cesim-muted">{a.when}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function ScheduleCard() {
  const { goToResults } = useUI()
  return (
    <Card title="Schedule">
      <ul className="space-y-1">
        {ROUNDS.map((r) => {
          const current = r.n === CURRENT_ROUND
          const past = r.state === 'past'
          return (
            <li key={r.n}>
              <button
                type="button"
                disabled={!past && !current}
                onClick={() => past && goToResults('market', r.n)}
                className={cn(
                  'flex w-full items-center justify-between rounded px-2 py-1 text-left text-[12px]',
                  current && 'bg-cesim-link/10 font-semibold text-cesim-link',
                  past && 'text-cesim-ink hover:bg-gray-50',
                  !past && !current && 'cursor-default text-cesim-muted opacity-50',
                )}
              >
                <span>Round {r.n} · {r.season}</span>
                <span className="text-[10px] text-cesim-muted">
                  {current ? `due ${CURRENT_DEADLINE.slice(5, 10).replace('-', '/')}` : past ? 'completed' : 'upcoming'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function TeamCard() {
  return (
    <Card title="Team — Hotel Red">
      <ul className="space-y-2">
        {HOTEL_RED.members.map((m) => (
          <li key={m.name} className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: m.color }}>
              {m.initials}
            </span>
            <span className="text-[12px] text-cesim-ink">{m.name}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function EmptyCard({ title, empty }) {
  return (
    <Card title={title}>
      <div className="grid h-16 place-items-center rounded border border-dashed border-gray-200 text-[12px] text-cesim-muted">
        {empty}
      </div>
    </Card>
  )
}

export function HomePage() {
  const { goToResults, goToDecision } = useUI()
  return (
    <div>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-cesim-ink">Home</h1>
          <p className="text-[12px] text-cesim-muted">
            {COURSE.universe} · current round{' '}
            <span className="font-semibold text-cesim-ink">{ROUND_META[CURRENT_ROUND]?.label ?? `Round ${CURRENT_ROUND} · Summer`}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => goToDecision('sales')} className="rounded bg-cesim-link px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-header-bottom">
            Make decisions →
          </button>
          <button type="button" onClick={() => goToResults('market')} className="rounded border border-gray-300 px-3 py-1.5 text-[12px] font-semibold text-cesim-ink hover:border-cesim-link">
            View results
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ResultsCarousel />
        <ActivityCard />
        <ScheduleCard />
        <TeamCard />
        <EmptyCard title="Tasks" empty="No tasks" />
        <EmptyCard title="Messages" empty="No messages" />
      </div>
    </div>
  )
}
