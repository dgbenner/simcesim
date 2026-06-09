// coachingTips.js
// SIMCesim tutorial coaching tier — the "teacher over your shoulder" layer.
//
// These cover decision-process steps 2–6 (skip 1 "read materials" and 7 "commit" —
// both are self-evident). Each step has several SETS of three bullets; show one set,
// rotate on return so a repeat visit shows different coaching.
//
// Tone: concrete, pointing. "Look at THIS number, then THAT one, compare to last
// season." Drawn from what the Cesim decision-making guide actually instructs.
// Assume the reader knows none of the terms — point them at where to look and what
// it means, not at jargon.
//
// Header for each set is ONE WORD (e.g. "Coaching", "Start", "Check") — not
// "How to work through it". Pick per your UI; `label` field carries a suggested word.
//
// Shape:
//   step   the tutorial step number (2–6)
//   sets   array of { label, bullets: [3 strings] }

export const coachingTips = {
  // ── STEP 2 — Review the market situation (last round's results) ──────────────
  2: [
    {
      label: 'Start',
      bullets: [
        'Open Results → Market report and read two numbers: the room rate you charged last round, and how many nights you actually sold.',
        'Now find your occupancy % — nights sold ÷ 9,000. That single number tells you if you were too empty, too full, or about right.',
        'Whatever looks off — too many empty rooms, or rooms full but profit thin — is the thing to adjust this round.',
      ],
    },
    {
      label: 'Compare',
      bullets: [
        "On the Sorting tab, see where you ranked against the other hotels — that's the real scoreboard, not your own numbers alone.",
        'If a rival filled more rooms than you, ask whether they were cheaper. Price is usually why one hotel beats another on volume.',
        "If you made less profit despite selling well, your rate was probably too low. Selling a lot cheaply isn't winning.",
      ],
    },
    {
      label: 'Read',
      bullets: [
        "Last round's results are your only real evidence. Start every decision from 'what actually happened,' not from a guess.",
        'Check revenue per available room — it blends price and occupancy into one figure you can track round to round.',
        "Note your profit per room. If it's low or negative, the season's job is to fix that, not to chase more guests.",
      ],
    },
  ],

  // ── STEP 3 — Read the market outlook (this round's parameters + demand) ───────
  3: [
    {
      label: 'Confirm',
      bullets: [
        'First, confirm the season. Summer = vacationers who shop on price. Winter = business travelers who care less about price.',
        'Read the demand note: is the market growing or shrinking this round? That shifts how aggressive your pricing should be.',
        'Remember demand resolves against competitors — the outlook is a forecast, not a promise. Treat it as a lean, not a fact.',
      ],
    },
    {
      label: 'Costs',
      bullets: [
        "Scan the parameters for what you can't change: rent, the ~$8 cost per night, the 30% tax rate. These set the floor you must clear.",
        "Note the interest rate — it's what new borrowing costs you, and it climbs the more debt you already carry.",
        'Watch for cost increases flagged in the outlook (wages, energy). If costs are rising, holding your old price quietly shrinks profit.',
      ],
    },
    {
      label: 'Read',
      bullets: [
        "The outlook is coaching you. If it says demand is soft, that's a hint to defend margin, not chase empty rooms.",
        "If it warns construction or hiring costs will rise later, that's a nudge about timing — act before the increase, not after.",
        'Match your effort to the season: summer is where you earn, winter is where you protect the downside.',
      ],
    },
  ],

  // ── STEP 4 — Choose your decision area ────────────────────────────────────────
  4: [
    {
      label: 'Where',
      bullets: [
        'Work in your own area (Dan Benner). Your column is what drives the figures you see.',
        "The greyed competitor columns aren't yours to touch — you only control Hotel Red.",
        "Make your plan in your own area first; it's the safe draft before anything becomes the team's official answer.",
      ],
    },
  ],

  // ── STEP 5 — Make decisions (Sales → Operations → Finance) ────────────────────
  5: [
    {
      label: 'Order',
      bullets: [
        "Sales first. Set your walk-in rate near last round's, then nudge for the season — higher in winter, gentler in summer.",
        "Then Operations: match staff to the demand you just set. Don't carry a summer-sized team into a quiet winter.",
        'Finance last, once the cash picture is clear — loans and dividends only make sense after you know what the season earns.',
      ],
    },
    {
      label: 'Price',
      bullets: [
        "Your rate only matters next to rivals'. Last round's price that sold well is your anchor; move off it deliberately, not randomly.",
        "For the nights estimate, don't reach for 9,000 — that's the ceiling. Start near last round's actual occupancy and adjust.",
        'Every room you fill brings in roughly its full rate (cost per night is tiny), so a filled room beats an empty one almost always.',
      ],
    },
    {
      label: 'People',
      bullets: [
        'Check the personnel stress gauge. Too few staff for the rooms you’ll sell drags quality down and pushes turnover up.',
        'Flex with temps for seasonal swings — firing permanents costs far more than hiring them, so don’t over-staff then cut.',
        'Maintenance and training cost you now but raise quality, which supports the price you can charge later. Skipping them is borrowing from next season.',
      ],
    },
    {
      label: 'Watch',
      bullets: [
        'Change one lever at a time and re-check the projection. Changing five at once tells you nothing about what worked.',
        'After each change, glance at projected net profit — if it dropped, the last move hurt; undo or rethink it.',
        "The strip above fills as you finish each section. Let it confirm you haven't left a decision blank.",
      ],
    },
  ],

  // ── STEP 6 — Review budgets (the Projections forecast) ────────────────────────
  6: [
    {
      label: 'Check',
      bullets: [
        'Open Projections. First question: is net profit positive? In summer it should be; in winter, a small loss may be the honest goal.',
        'Second: does the balance sheet balance — total assets equal to equity plus liabilities? If not, something’s off.',
        'If a number looks wrong, trace it back to the decision that drives it, fix that, and re-open Projections.',
      ],
    },
    {
      label: 'Trace',
      bullets: [
        "Profit thin? Look at occupancy and rate together — you're either too empty or priced too low. The income statement shows which.",
        "Cash tight? Check whether a long credit term or a dividend is draining it. Profit and cash aren't the same thing.",
        "Costs high? Personnel is usually the biggest line — see if you're over-staffed for the demand you set.",
      ],
    },
    {
      label: 'Loop',
      bullets: [
        'Treat this as a loop: tweak one lever, re-check the forecast, repeat. That cycle is the whole skill.',
        'Compare this forecast to last round’s actual result — are you improving the thing that was weak before?',
        "When the forecast looks sane and you can explain why each number is what it is, you're ready to commit.",
      ],
    },
  ],
}

// Picker: return a coaching set for a step, rotating by visit count or at random.
export function getCoaching(step, { visit = 0, random = false, rng = Math.random } = {}) {
  const sets = coachingTips[step]
  if (!sets || sets.length === 0) return null
  if (random) return sets[Math.floor(rng() * sets.length)]
  return sets[visit % sets.length]
}
