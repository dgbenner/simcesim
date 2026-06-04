// Season helpers. Rounds alternate Winter/Summer, so "last" and "next" season are both
// simply the other season. Use these to name the specific season instead of the vague
// word "season" wherever the timeframe is known.
export const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)
export const otherSeason = (s) => (s === 'summer' ? 'winter' : 'summer')
