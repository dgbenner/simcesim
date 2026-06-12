import { useMemo, useState } from 'react'
import { useUI } from '../../state/ui'
import { SUMMARY, ROUND_META, RESULT_TEAMS, COMPLETED_ROUNDS } from '../../data/roundResults'
import { ROUNDS, HOTEL_RED, COURSE } from '../../data/team'
import { CURRENT_ROUND, CURRENT_DEADLINE } from '../../data/config'
import { cn } from '../../lib/cn'
import { pct, usdShort } from '../../lib/format'

// HOME — read-only dashboard mirroring the real Cesim home (spec addendum §3). A results
// carousel (3 KPIs: cumulative TSR, cumulative earnings, EBITDA prev 6 months) charting
// ALL FOUR teams side by side across rounds — competition is the heart of the sim, so every
// team's bar is shown by name and color. Hotel Red is outlined as "you". Round 4 is in
// progress → shown as a pending slot.

const TEAM_ORDER = ['northline', 'red', 'blue', 'america'] // = data column order
const TEAM_COLOR = { northline: '#2e8b57', red: '#c0392b', blue: '#2f6fb0', america: '#e8821e' }
const teamName = (key) => RESULT_TEAMS.find((t) => t.key === key)?.name ?? key

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
  const W = 440, H = 198, padT = 14, padB = 26, padL = 46, padR = 10
  const plotH = H - padT - padB
  const slots = [1, 2, 3, 4]

  const allVals = COMPLETED_ROUNDS.flatMap((n) => data[n])
  const lo = Math.min(0, ...allVals), hi = Math.max(0, ...allVals)
  const span = hi - lo || 1
  const y = (v) => padT + plotH * (1 - (v - lo) / span)
  const zeroY = y(0)
  const slotW = (W - padL - padR) / slots.length
  const groupW = slotW * 0.74
  const barW = groupW / 4
  const gridVals = [...new Set([hi, (hi + lo) / 2, lo])]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="KPI by round, all teams">
      {/* gridlines + y-axis value labels */}
      {gridVals.map((gv, k) => (
        <g key={k}>
          <line x1={padL} y1={y(gv)} x2={W - padR} y2={y(gv)} stroke={gv === 0 ? '#cbd5e1' : '#eef2f6'} strokeWidth="1" />
          <text x={padL - 4} y={y(gv) + 3} textAnchor="end" className="fill-slate-400" style={{ fontSize: 8 }}>{fmt(gv)}</text>
        </g>
      ))}
      {slots.map((n, k) => {
        const cx = padL + slotW * k + slotW / 2
        const x0 = padL + slotW * k + (slotW - groupW) / 2
        const pending = !COMPLETED_ROUNDS.includes(n)
        return (
          <g key={n}>
            <text x={cx} y={H - 8} textAnchor="middle" className="fill-slate-600" style={{ fontSize: 10 }}>R{n}</text>
            {pending ? (
              <>
                <rect x={x0} y={padT} width={groupW} height={plotH} fill="none" stroke="#e2e8f0" strokeDasharray="3 3" rx="3" />
                <text x={cx} y={zeroY - 5} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 8 }}>pending</text>
              </>
            ) : (
              TEAM_ORDER.map((key, ti) => {
                const v = data[n][ti]
                const bx = x0 + ti * barW
                const isYou = key === 'red'
                return (
                  <rect
                    key={key}
                    x={bx + 0.5}
                    y={Math.min(zeroY, y(v))}
                    width={barW - 1}
                    height={Math.max(0, Math.abs(y(v) - zeroY))}
                    fill={TEAM_COLOR[key]}
                    rx="1"
                    stroke={isYou ? '#5e1812' : 'none'}
                    strokeWidth={isYou ? 0.75 : 0}
                  />
                )
              })
            )}
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

      <div className="mt-1 flex items-end justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-cesim-muted">
          {TEAM_ORDER.map((key) => (
            <span key={key} className="flex items-center gap-1">
              <span className="inline-block h-2 w-2.5 rounded-sm" style={{ backgroundColor: TEAM_COLOR[key] }} />
              <span className={key === 'red' ? 'font-semibold text-cesim-ink' : ''}>
                {teamName(key)}{key === 'red' && ' (you)'}
              </span>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
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
