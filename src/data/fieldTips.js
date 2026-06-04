// fieldTips.js
// SIMCesim in-context micro-tips (GREEN "Principles" accent, INLINE variant).
//
// These are SHORT snippets meant to sit INSIDE a decision area, next to the field the
// user is actually touching — not in the side panel. They rotate dynamically: each field
// has several tips; show one at a time, cycle on a tap.
//
// Keep them to one or two sentences. Each teaches the economic idea AT THE POINT OF
// INTERACTION, anchored to that specific field. (The long-form `principles.js` cards stay
// for the side panel; this is the in-context layer.)
//
// Keys are remapped to the real field ids in fields.js (the author's camelCase guesses
// were e.g. walkInRoomRate → walkInRate, permanentEmployees → headcount).

export const fieldTips = {
  // ── SALES ──────────────────────────────────────────────────────────────────
  walkInRate: [
    "Price too high and rooms sit empty; too low and you leave money on the table. The sweet spot moves with the season.",
    "Business travelers (winter) barely flinch at price. Leisure guests (summer) shop hard. Same rate, different reaction.",
    "An empty room earns nothing tonight and can't be sold tomorrow — so a filled room at a fair rate usually beats holding out.",
    "Your price only works relative to the hotels next door. You're not setting it in a vacuum.",
    "Each night sold costs you only a few dollars to service — so once fixed costs are covered, most of the rate is profit.",
  ],

  estNightsSold: [
    "This is your forecast, not your sale — a guess to budget against, so reality can tell you how close you were.",
    "Be honest here. Flattering the estimate just flatters your projected profit; it doesn't sell a single room.",
    "A forecast you compare against actuals teaches you something. A forecast you fudge teaches you nothing.",
  ],

  advanceNextSeason: [
    "Selling rooms early to agencies trades price for certainty — guaranteed occupancy, but at a lower rate per night.",
    "The more nights you offer, the less agencies pay per night. Volume and price pull against each other.",
    "These two windows compete: load up two-seasons-out and the nearer season's deals soften, and vice versa.",
  ],

  advanceTwoSeasons: [
    "Locking in distant nights is a hedge against empty rooms later — paid for with a thinner price today.",
    "Offering more volume drags your average price down. There's no free occupancy here.",
    "What you commit far out limits what you can sell in the season just ahead. Don't overspend the future.",
  ],

  marketing: [
    "Marketing shifts demand — it's a cost now, betting on more (or higher-priced) sales later.",
    "With rooms so cheap to service, it doesn't take many extra bookings to pay back a marketing dollar.",
    "Some of this works fast and some lingers into next season — you're buying a little now and a little later.",
    "Pushing harder eventually buys less per dollar. The first chunk of spend does the most work.",
  ],

  // ── OPERATIONS ─────────────────────────────────────────────────────────────
  maintenance: [
    "Upkeep feels like pure cost, but skipping it is borrowing from the future — the building quietly decays.",
    "Condition slips a little every season from wear. This is what holds your Quality Level up.",
    "Spend now, benefit later: better facilities support demand and the price you can charge down the line.",
  ],

  directCostSaving: [
    "This trims the cost of servicing each room-night — and the savings stack up round after round.",
    "Pay once to make every future night a little cheaper to run. That's process improvement, not just a cost.",
    "Diminishing returns apply: the first efforts cut the most fat; later ones shave less.",
  ],

  adminCostSaving: [
    "This chips away at your fixed overhead — the cost you pay whether or not a single room fills.",
    "Lowering a fixed cost helps every season, busy or slow, since it's there regardless of occupancy.",
    "Like all efficiency work, early effort pays best; eventually there's little left to cut.",
  ],

  turnover: [
    "This is an estimate of how many staff leave and get replaced — it feeds your budget, it doesn't set reality.",
    "High turnover quietly costs you: recruiting, retraining, and a dip in the competence guests feel.",
    "Pay and training pull turnover down, but some churn is just normal and outside your control.",
  ],

  headcount: [
    "Permanent staff are your stable, skilled core — reliability and quality, but a fixed cost you carry every season.",
    "Hiring people you'll later lay off is a costly round-trip: recruiting is cheaper than firing.",
    "Headcount can be fractional — part-timers count as decimals. You're sizing labor, not counting whole bodies.",
    "Too few staff for the workload raises stress and can drag down the quality guests experience.",
  ],

  // Retained from the source file. No temporary-staff decision field exists in v1, so
  // these are unused for now but kept for when/if that field is added.
  temporaryEmployees: [
    "Temps are your flexible edge — add them for the busy season, drop them for the slow one, no long-term cost.",
    "This is how you breathe with demand: retailers hire holiday temps for exactly this reason.",
    "Leaning on temps avoids the costly hire-then-fire cycle that comes with over-staffing permanents.",
  ],

  wage: [
    "Higher pay lowers turnover and attracts more capable hires — quality you're partly buying through the paycheck.",
    "Wages are a fixed cost: you pay them at 40% occupancy and at 90% alike.",
    "Underpay and people leave; the savings can evaporate in recruiting and lost competence.",
  ],

  training: [
    "Training raises staff competence, which lifts the quality guests feel — and the price you can hold.",
    "Returns diminish: a green team improves fast, an already-skilled one barely moves per extra dollar.",
    "It's quality you pay for now and collect on later, through guests who return and pay more.",
  ],

  // ── FINANCE ────────────────────────────────────────────────────────────────
  ltLoanChange: [
    "Borrowing is cheaper than the owner's money in good times — but the lender gets paid whether you profit or not.",
    "The more debt you carry, the riskier you look, and the higher your borrowing rate climbs.",
    "You can't repay more than you owe — and if you run short of cash, pricier emergency loans kick in automatically.",
    "Debt is a lever: it magnifies good outcomes and bad ones alike. Use it deliberately.",
  ],

  dividends: [
    "A dividend hands profit back to the owner — who wants it — but every dollar out is a dollar not reinvested.",
    "You can only pay from accumulated profit (retained earnings); you can't hand out money you never made.",
    "Cash to owners now vs. fuel for the business later — a real trade-off, not a free reward.",
  ],

  creditTerm: [
    "Letting agencies pay later can win their business — but it traps your cash in money you've earned and don't have yet.",
    "Longer terms = more receivables = less cash on hand. The sale's the same; the timing isn't.",
    "A dollar collected sooner is worth more than one collected later. Generous terms have a hidden cost.",
  ],
}

// Rotating picker: returns the next tip for a field, cycling deterministically, or pass
// {random:true} to shuffle. Track an index per field in component state.
export function nextFieldTip(fieldKey, { index = 0, random = false, rng = Math.random } = {}) {
  const tips = fieldTips[fieldKey]
  if (!tips || tips.length === 0) return null
  if (random) return tips[Math.floor(rng() * tips.length)]
  return tips[index % tips.length]
}
