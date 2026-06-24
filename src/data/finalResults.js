// finalResults.js — Hotel Red's end-of-game self-analysis (final-results addendum).
// Three categories, each a stack of Question/Answer cards. Content is verbatim from the
// real retrospective. Read-only reflection; no computation.

export const FINAL_DOWNLOADS = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  round: n,
  href: `/data/results/results-r${String(n).padStart(2, '0')}.xls`,
}))

export const FINAL_COLUMNS = [
  {
    key: 'high',
    header: 'High Level',
    blurb: 'Overall game & strategy',
    cards: [
      {
        icon: '🎯',
        q: 'Was our strategy clear and consistent across all sessions?',
        a: 'Yes — a steady mid-price ($125–150 all game), lean-staffing (~4 permanents), stable-quality strategy, while rivals swung $100–250. Consistent, but passive: we held position rather than pressing any advantage.',
      },
      {
        icon: '📈',
        q: 'Which variables had the biggest impact?',
        a: 'Price, overwhelmingly — it drove occupancy and revenue every round, and our discipline kept us profitable when rivals cratered. Staffing stability was second: holding ~4 permanents avoided the layoff/recruitment costs that hurt others.',
      },
      {
        icon: '💤',
        q: 'Which variables did very little?',
        a: 'Marketing and training — parked at ~$11,200 and exactly $1,000 for most of the game, too static to move results. Maintenance held quality steady but never built an edge.',
      },
      {
        icon: '🎛️',
        q: 'What were the strongest controls, and did we waste effort?',
        a: 'Strongest: price, then quality-building (maintenance + training together), then demand-timed marketing. We mastered price and ignored the other two — that’s where the upside was left unclaimed.',
      },
    ],
  },
  {
    key: 'decisions',
    header: 'Our Decisions',
    blurb: 'Hotel Red’s choices & consequences',
    cards: [
      {
        icon: '🩹',
        q: 'Which round hurt us most, and what one decision would have changed it?',
        a: 'Round 3 (+14k) — we dropped to $130 in a soft winter and barely profited while Northline held $165 for +51k. The fix was simply not flinching: winter business travelers were less price-sensitive, so holding price would have earned more.',
      },
      {
        icon: '💸',
        q: 'Where did we leave the most money on the table?',
        a: 'The summer high-seasons, R4 and R6. Demand was strongest exactly when we stayed cautious; rivals pushed more volume and out-earned us. We protected a downside that wasn’t there in a boom.',
      },
      {
        icon: '🏦',
        q: 'What did our debt and idle cash cost us?',
        a: 'The big one. We carried the same $3.3M long-term loan untouched all 7 rounds — ~$674k in total interest — while cash grew from $702k to $1.74M sitting nearly idle (earning ~4% while debt cost 5%+). Never paid down debt, never paid a dividend. Our single biggest unforced cost.',
      },
    ],
  },
  {
    key: 'competitors',
    header: 'Competitors',
    blurb: 'Learning from the field',
    cards: [
      {
        icon: '🏆',
        q: 'Who actually played the best full game?',
        a: 'It converged late — by R7, TSR was tight (America 13.5, Northline 11.2, us 10.8, Blue 7.1). We led the early game by a wide margin but the lead eroded as others worked the levers we left idle. America climbed from worst to first.',
      },
      {
        icon: '🎢',
        q: 'What did Blue’s wild swings (+257k to −90k) teach?',
        a: 'Blue chased quality hardest and priced aggressively — big wins in booms, craters in soft rounds. High variance got punished over a long game; they finished last on TSR. Extreme swings are risky across many rounds.',
      },
      {
        icon: '🚀',
        q: 'How did America recover from a last-place start?',
        a: 'They dropped the disastrous $250 price after R1, settled into the ~$150 mid-band we used, and rode the summer booms harder. Steadiness plus capturing peaks beat their early gamble — they learned our early lesson and added the volume-pressing we didn’t.',
      },
    ],
  },
]
