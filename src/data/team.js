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

// Competitor teams — present but ghosted everywhere a comparison appears.
export const COMPETITORS = [
  {
    name: 'The Northline',
    accent: 'green',
    members: ['Lauren Ciernia', 'Chrysa Theien', 'Jill Johansen', 'Tiffany Jahangiri', 'Jay Ramkumar'],
  },
  {
    name: 'Blue',
    accent: 'blue',
    members: ['Tanner Harms', 'Philip Punnoose', 'Kyle Durant', 'Tom Sonnek'],
  },
  {
    name: 'Hotel of America',
    accent: 'orange',
    members: ['Amber Scott', 'Chris Jones', 'Victoria Bartness', 'Kristie Case'],
  },
]

// The three active decision-makers on Hotel Red.
export const ACTIVE_MEMBERS = HOTEL_RED.members

// All 7 real rounds, numbered AND season-labeled. Winter/summer alternate; Round 2 is
// Summer (CONFIRMED). Practice rounds dropped. Round 2 is current; past/future inactive.
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
