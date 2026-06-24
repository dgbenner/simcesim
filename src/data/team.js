// Team rosters + course meta. Hotel Red is the user's team (highlighted as "you");
// competitor teams are shown by name with full stats for comparison — only their PEOPLE
// are anonymized to initials. Sarah Wall is the instructor mistakenly listed on Hotel Red
// — omitted from the roster, but she stays as instructor in the footer.

export const COURSE = {
  name: 'Mini MBA June 2026',
  universe: 'Universe 1, Mini MBA June 2026',
  instructor: 'Dan McLaughlin',
  roundLabel: 'Sandbox',
  roundDeadline: '—',
  countdown: 'practice', // static chrome only
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

// Competitor teams — shown by name with full stats for comparison (un-ghosted). Member
// names are stored as INITIALS ONLY (anonymization rule, spec addendum §1): only Hotel Red
// members appear by full name; everyone else is reduced to first+last initials.
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

// The 7 real rounds (all COMPLETE + review-only, real data in roundResults.js) plus a
// separate editable SANDBOX round — a practice playground, not a real round. Seasons
// alternate ODD = Winter, EVEN = Summer; the sandbox is a Summer round labeled "Sandbox".
import { SANDBOX_ROUND, seasonOfRound } from './config'

export const ROUNDS = [
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({
    n,
    season: seasonOfRound(n) === 'winter' ? 'Winter' : 'Summer',
    state: 'past', // every real round is complete + reviewable
  })),
  { n: SANDBOX_ROUND, season: 'Summer', state: 'current', sandbox: true },
]
export const CURRENT_ROUND = ROUNDS.find((r) => r.state === 'current')
