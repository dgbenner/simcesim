// Team rosters + course meta. Hotel Red is the only active team; competitors are
// ghosted wherever they appear. Sarah Wall is the instructor mistakenly listed on
// Hotel Red — ghost her in the roster, but she stays as instructor in the footer.

export const COURSE = {
  name: 'Mini MBA June 2026',
  universe: 'Universe 1, Mini MBA June 2026',
  instructor: 'Dan McLaughlin',
  roundLabel: 'Round 2',
  roundDeadline: '2026-06-09 13:05',
  countdown: '06d 10:46:09', // static chrome only
}

export const HOTEL_RED = {
  name: 'Hotel Red',
  accent: 'red',
  members: [
    { name: 'Maddie Lenarz Hooyman', initials: 'ML', color: '#e8821e' },
    { name: 'Dan Benner', initials: 'DB', color: '#3aa544' },
    { name: 'Sara Hawkins-Lindau', initials: 'SH', color: '#2f6fb0' },
  ],
}

// Competitor teams — present but ghosted everywhere a comparison appears. Member names are
// stored as INITIALS ONLY (anonymization rule, spec addendum §1): only Hotel Red members
// appear by full name; everyone else is reduced to first+last initials.
export const COMPETITORS = [
  {
    name: 'The Northline',
    accent: 'green',
    members: ['LC', 'CT', 'JJ', 'TJ', 'JR'],
  },
  {
    name: 'Blue',
    accent: 'blue',
    members: ['TH', 'PP', 'KD', 'TS'],
  },
  {
    name: 'Hotel of America',
    accent: 'orange',
    members: ['AS', 'CJ', 'VB', 'KC'],
  },
]

// The three active decision-makers on Hotel Red.
export const ACTIVE_MEMBERS = HOTEL_RED.members

// ── Name anonymization (spec addendum §1) ─────────────────────────────────────────────
// Only Hotel Red members appear by full name. Every other person — competitors, and the
// mistakenly-rostered instructor Sarah Wall — is shown by first + last initial only.
const HOTEL_RED_NAMES = new Set(HOTEL_RED.members.map((m) => m.name))

export function initialsOf(name) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Full name only for Hotel Red; initials for anyone else. Already-initialed strings
// (e.g. competitor members, "SW") pass straight through.
export function displayName(name) {
  if (!name) return ''
  if (HOTEL_RED_NAMES.has(name)) return name
  if (/^[A-Z]{1,3}$/.test(name.trim())) return name.trim()
  return initialsOf(name)
}

// All 7 real rounds, numbered AND season-labeled. Seasons alternate with ODD = Winter,
// EVEN = Summer (CONFIRMED: Round 1 = Winter from the real export; Round 4 = Summer, the
// live round). The app teaches with the Round 1 · Winter data in hand: Round 1 is the
// completed anchor, Round 2 · Summer is the current decision round. Practice rounds dropped.
export const ROUNDS = [
  { n: 1, season: 'Winter', state: 'past' },
  { n: 2, season: 'Summer', state: 'current' },
  { n: 3, season: 'Winter', state: 'future' },
  { n: 4, season: 'Summer', state: 'future' },
  { n: 5, season: 'Winter', state: 'future' },
  { n: 6, season: 'Summer', state: 'future' },
  { n: 7, season: 'Winter', state: 'future' },
]
export const CURRENT_ROUND = ROUNDS.find((r) => r.state === 'current')
