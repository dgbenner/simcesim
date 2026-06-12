// coachingTips.js
// SIMCesim tutorial coaching tier — the "teacher over your shoulder" layer.
//
// Covers decision-process steps 2–6 (skip 1 "read materials" and 7 "commit").
// Each step has several SETS of three bullets; show one set, rotate on return so a
// repeat visit shows different coaching.
//
// Every bullet starts with a VERB (Open, Read, Check, Compare, Set, Match, Watch…)
// so each reads as a clear action. No set headers — the step title already frames it.
//
// Tone: concrete, pointing. "Look at THIS number, then THAT one, compare to last
// season." Drawn from what the Cesim decision-making guide actually instructs.
// Assume the reader knows none of the terms.
//
// Shape:
//   step  the tutorial step number (2–6)
//   sets  array of bullet-arrays (each inner array = 3 verb-first strings)

export const coachingTips = {
  // ── STEP 2 — Review the market situation (last round's results) ──────────────
  2: [
    [
      'Open Results → Market report and read two numbers: the rate you charged last round and how many nights you actually sold.',
      'Divide nights sold by 9,000 to get your occupancy %. That one number tells you if you ran too empty, too full, or about right.',
      "Fix whatever looked off — too many empty rooms, or rooms full but profit thin — and make that this round's priority.",
    ],
    [
      "Check the Sorting tab to see where you ranked against the other hotels — that's the real scoreboard, not your own numbers alone.",
      'Compare your occupancy to a rival who filled more rooms; if they were cheaper, price is usually why they beat you on volume.',
      "Reconsider your rate if you sold well but made little — selling a lot cheaply isn't winning.",
    ],
    [
      "Start from what actually happened last round, not from a guess — it's your only real evidence.",
      'Track revenue per available room; it blends price and occupancy into one figure you can follow round to round.',
      "Note your profit per room — if it's low or negative, this season's job is to fix that, not to chase more guests.",
    ],
  ],

  // ── STEP 3 — Read the market outlook (this round's parameters + demand) ───────
  3: [
    [
      'Confirm the season first: summer brings vacationers who shop on price, winter brings business travelers who care less about it.',
      'Read the demand note — is the market growing or shrinking? That decides how aggressive your pricing should be.',
      'Treat the forecast as a lean, not a promise; demand resolves against competitors, so nothing here is guaranteed.',
    ],
    [
      "Scan the parameters you can't change — rent, the ~$8 cost per night, the 30% tax — and treat them as the floor you must clear.",
      "Note the interest rate; it's what new borrowing costs, and it climbs the more debt you already carry.",
      'Watch for rising costs flagged in the outlook — if wages or energy are up, holding your old price quietly shrinks profit.',
    ],
    [
      'Read the outlook as coaching: if it says demand is soft, defend your margin rather than chase empty rooms.',
      'Act early on any warning that costs will rise later — move before the increase, not after.',
      'Match your effort to the season — earn in summer, protect the downside in winter.',
    ],
  ],

  // ── STEP 4 — Choose your decision area ────────────────────────────────────────
  4: [
    [
      'Work in your own area (Dan Benner) — your column is what drives the figures you see.',
      "Study the competitors' columns in Results — you only control Hotel Red, but their numbers show what's winning.",
      "Draft your plan in your own area first — it's the safe place to think before anything becomes the team's official answer.",
    ],
  ],

  // ── STEP 5 — Make decisions (Sales → Operations → Finance) ────────────────────
  5: [
    [
      "Set your walk-in rate near last round's, then nudge for the season — a little higher in winter, gentler in summer.",
      "Match staff to the demand you just set; don't carry a summer-sized team into a quiet winter.",
      'Save Finance for last — loans and dividends only make sense once you know what the season earns.',
    ],
    [
      "Anchor your price to last round's rate that sold well, then move off it deliberately, not randomly.",
      "Estimate nights near last round's actual occupancy, not the 9,000 ceiling — you'll never fill it.",
      'Fill rooms rather than hold out for price; cost per night is tiny, so a filled room beats an empty one almost always.',
    ],
    [
      "Check the personnel stress gauge — too few staff for the rooms you'll sell drags quality down and pushes turnover up.",
      "Flex with temps for seasonal swings; firing permanents costs far more than hiring, so don't over-staff then cut.",
      'Fund maintenance and training now — they raise quality and the price you can charge later, so skipping them borrows from next season.',
    ],
    [
      'Change one lever at a time and re-check the projection — changing five at once tells you nothing about what worked.',
      'Glance at projected net profit after each change; if it dropped, the last move hurt — undo or rethink it.',
      'Watch the strip above fill in as you finish each section so no decision is left blank.',
    ],
  ],

  // ── STEP 6 — Review budgets (the Projections forecast) ────────────────────────
  6: [
    [
      'Open Projections and ask first: is net profit positive? In summer it should be; in winter a small loss may be the honest goal.',
      'Confirm the balance sheet balances — total assets equal to equity plus liabilities. If not, something’s off.',
      'Trace any number that looks wrong back to the decision that drives it, fix that, and re-open Projections.',
    ],
    [
      "Read occupancy and rate together if profit is thin — you're either too empty or priced too low, and the income statement shows which.",
      "Check whether a long credit term or a dividend is draining your cash; profit and cash aren't the same thing.",
      "Look at the personnel line if costs seem high — it's usually the biggest one, and over-staffing shows up there.",
    ],
    [
      'Tweak one lever, re-check the forecast, repeat — that cycle is the whole skill.',
      "Compare this forecast to last round's actual result — are you improving the thing that was weak before?",
      'Commit once the forecast looks sane and you can explain why each number is what it is.',
    ],
  ],
}

// Picker: return a coaching set (array of 3 bullets) for a step, rotating by visit
// count or at random.
export function getCoaching(step, { visit = 0, random = false, rng = Math.random } = {}) {
  const sets = coachingTips[step]
  if (!sets || sets.length === 0) return null
  if (random) return sets[Math.floor(rng() * sets.length)]
  return sets[visit % sets.length]
}
