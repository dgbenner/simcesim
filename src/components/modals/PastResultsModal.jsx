import { Modal } from '../shared/Modal'
import { TimeframeLabel } from '../shared/TimeframeLabel'
import { useUI } from '../../state/ui'
import { LAST_ROUND, ANCHOR } from '../../data/lastRoundResults'
import { otherSeason } from '../../lib/season'
import { usd, int, pct } from '../../lib/format'

// The "check past results" modal (spec addendum, Part 2). Two clearly separated voices:
//   • the yellow box = INSTRUCTION (how to use this as a benchmark for the current decision)
//   • the tagged rows = RECAP (purely what the hotel DID last season — past tense)
// Rounds alternate seasons, so we name the season ("last winter") not the vaguer "round".

const lastSeason = LAST_ROUND.season.toLowerCase() // last completed round's season
const thisSeason = otherSeason(lastSeason) // the current decision season

function Row({ label, value, hint, note }) {
  return (
    <div className="border-b border-gray-100 py-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] font-semibold text-cesim-ink">{label}</span>
        <span className="shrink-0 text-right">
          <span className="text-[14px] font-bold tabular-nums text-cesim-ink">{value}</span>
          {hint && <span className="ml-1 text-[11px] text-cesim-muted">{hint}</span>}
        </span>
      </div>
      {note && <p className="mt-0.5 text-[11px] leading-snug text-cesim-muted">{note}</p>}
    </div>
  )
}

export function PastResultsModal() {
  const { pastResultsOpen, setPastResultsOpen, goToResults } = useUI()

  return (
    <Modal
      open={pastResultsOpen}
      onClose={() => setPastResultsOpen(false)}
      title={`What the hotel did last ${lastSeason}`}
      subtitle={`A recap of your last completed round (${LAST_ROUND.label}).`}
      width="max-w-md"
      footer={
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => goToResults('market')}
            className="text-[12px] font-semibold text-cesim-link hover:underline"
          >
            See full results →
          </button>
          <button
            type="button"
            onClick={() => setPastResultsOpen(false)}
            className="rounded bg-cesim-link px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-header-bottom"
          >
            Got it
          </button>
        </div>
      }
    >
      {/* INSTRUCTION voice — how to use the recap below */}
      <div className="mb-4 flex gap-2 rounded border-l-2 border-amber-400 bg-amber-50 p-2.5 text-[12px] leading-relaxed text-amber-900">
        <span aria-hidden className="select-none">💡</span>
        <p>
          <span className="font-bold">Use this as your benchmark.</span> Last {lastSeason} it charged{' '}
          {usd(ANCHOR.bookedRate)} for walk-ins and filled about half its rooms. For this {thisSeason}, start
          near that and decide: go <span className="font-semibold">higher</span> to earn more per room (and
          likely fill fewer), or <span className="font-semibold">lower</span> to fill more.
        </p>
      </div>

      {/* RECAP voice — purely what happened last season */}
      <TimeframeLabel className="mb-1.5">Last {lastSeason} — what happened</TimeframeLabel>

      <Row
        label="Walk-in room rate"
        value={usd(ANCHOR.bookedRate)}
        hint="/ night"
        note="The rate it charged individual ('walk-in') guests."
      />
      <Row
        label="Average rate, all sales"
        value={usd(ANCHOR.avgRate)}
        hint="/ night"
        note="Lower — it blends in rooms pre-sold to agencies at a discount."
      />
      <Row
        label="Occupancy"
        value={pct(ANCHOR.occupancy)}
        note={`Share of the ${int(ANCHOR.capacity)} room-nights it filled.`}
      />
      <Row
        label="Nights sold"
        value={`${int(ANCHOR.nightsSold)} of ${int(ANCHOR.capacity)}`}
        hint="room-nights"
      />
      <Row
        label="Marketing spend"
        value={usd(ANCHOR.marketing)}
        note="What it spent promoting walk-in demand. The field's default starts here."
      />

      <p className="mt-3 text-[11px] leading-relaxed text-cesim-muted">
        Remember: <span className="font-semibold">{int(ANCHOR.capacity)}</span> is total capacity (the
        ceiling), not a target. Realistic nights are roughly occupancy × capacity — well below {int(ANCHOR.capacity)}.
      </p>
    </Modal>
  )
}
