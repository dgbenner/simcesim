// principles.js
// SIMCESIM "Principles" content (GREEN accent variant).
// Companion to "Axiom" (YELLOW), which distills the Cesim decision-making guide.
// Principles are general business-administration / economics 101 concepts written
// for someone with NO prior business background — plain language, a concrete
// real-world example (named company where it fits), and a tie-in to where the idea
// shows up in the hotel sim.
//
// Field shape:
//   id        unique string
//   category  "sales" | "operations" | "finance" | "strategy"
//   contexts  array of page/decision keys for the randomizer to match against,
//             e.g. ["sales","pricing"], ["operations","personnel"], ["finance"],
//             ["any"]  (show-anywhere). A card may list several.
//   level     1 = most basic (weight these to appear more often)
//             2 = builds on the basics
//             3 = a step beyond / strategic
//   title     short heading
//   body      plain-language explanation with the example woven in
//   sim       how this concept appears in the hotel simulation
//
// Overshoot is intentional. Dial frequency down in the UI; randomize which show.

export const principles = [
  // ===================== SALES / PRICING / MARKETING =====================
  {
    id: 'perishable-inventory',
    category: 'sales',
    contexts: ['sales', 'pricing', 'any'],
    level: 1,
    title: "A room you don't sell tonight is gone forever",
    body:
      "Some products can't be stored. A hotel room empty tonight can't be sold tomorrow as 'two nights' — that night is simply lost. Airlines have the same problem with empty seats and concert venues with empty chairs. This is called perishable inventory, and it changes how you price: an empty room earns nothing while you still pay for the building and staff, so a room sold even at a modest rate is usually better than an empty one.",
    sim:
      "Your hotel has 9,000 room-nights a season. Whatever you don't fill just disappears — which is why occupancy %, not just price, drives your results.",
  },
  {
    id: 'price-elasticity',
    category: 'sales',
    contexts: ['sales', 'pricing'],
    level: 1,
    title: 'How much do customers care about price?',
    body:
      'Price elasticity is just: when you raise the price, how much does demand drop? Some buyers are very sensitive (raise the price a little and they leave) — others barely notice. A business traveler whose company pays the bill cares far less about $20 than a family on vacation does. Knowing who is price-sensitive tells you where you can charge more and where you cannot.',
    sim:
      'Winter guests are mostly business travelers (less price-sensitive); summer is leisure-driven (more price-sensitive). The same room rate lands differently by season.',
  },
  {
    id: 'market-segmentation',
    category: 'sales',
    contexts: ['sales', 'pricing', 'marketing'],
    level: 1,
    title: 'Not all customers are the same',
    body:
      'Segmentation means splitting your customers into groups that behave differently, so you can treat each one the way it wants to be treated. Movie theaters charge less for matinees because the afternoon crowd is more price-conscious than the Friday-night crowd. Same seat, different customer, different price.',
    sim:
      'Business vs. leisure travelers are your two big segments, and they peak in opposite seasons. A strategy that wins in summer may not be the one that wins in winter.',
  },
  {
    id: 'yield-management',
    category: 'sales',
    contexts: ['sales', 'pricing'],
    level: 2,
    title: 'Charging different prices for the same thing',
    body:
      'Yield management (or revenue management) means varying price by who is buying and when, to squeeze the most total revenue out of fixed capacity. Airlines are the masters: the person next to you may have paid triple for the identical seat, depending on when and how they booked. It feels unfair, but it is how you fill a plane — or a hotel — without leaving money on the table.',
    sim:
      'Selling rooms in advance to agencies (cheaper, certain) versus to walk-in guests (pricier, uncertain) is a basic form of this. You are slicing the same 9,000 nights into different priced channels.',
  },
  {
    id: 'advance-selling',
    category: 'sales',
    contexts: ['sales', 'advance', 'pricing'],
    level: 2,
    title: 'Selling early for certainty, at a discount',
    body:
      'Selling something before you have to is a trade: you give up some price in exchange for a guaranteed sale. A farmer who locks in a crop price months early sleeps better but may earn less than if they had waited. Travel agencies buy hotel rooms this way — in bulk, ahead of time, cheaper — and resell them.',
    sim:
      'Advance sales to agencies let you lock in occupancy now, but at a lower price per night than walk-ins. It is a hedge against empty rooms, not a profit maximizer.',
  },
  {
    id: 'volume-discount',
    category: 'sales',
    contexts: ['sales', 'advance', 'pricing'],
    level: 1,
    title: 'The more you sell at once, the less you get per unit',
    body:
      "Buy in bulk and you expect a lower price per item — that is a volume discount, and it works in reverse when you are the seller. Offer a wholesaler a huge quantity and they will only take it if you drop your per-unit price. Costco's whole model is built on this. The bigger the batch, the thinner the margin on each piece.",
    sim:
      'The more room-nights you offer agencies in advance, the lower the average price per night they will pay. Offering more is not free — it pushes your rate down.',
  },
  {
    id: 'marketing-demand',
    category: 'sales',
    contexts: ['sales', 'marketing'],
    level: 1,
    title: 'What marketing actually buys you',
    body:
      'Marketing spending is meant to shift demand — get more people to want your product, or be willing to pay a bit more for it. Some of it works fast (a weekend promotion), some builds slowly (years of brand-building, like why people pay more for Nike). It is a cost now, betting on more or better sales later.',
    sim:
      'Your marketing budget lifts walk-in demand more than advance demand, and has both a short-term and a lingering effect — so it spills into future seasons too.',
  },
  {
    id: 'willingness-to-pay',
    category: 'sales',
    contexts: ['sales', 'pricing'],
    level: 2,
    title: 'Price is a question, not a number',
    body:
      'Every customer has a private ceiling — the most they would pay before walking away. That is their willingness to pay. Set your price below everyone\'s ceiling and you sell a lot but leave money behind; set it above most ceilings and you sell little. Good pricing hunts for the sweet spot, and that spot moves with who is buying.',
    sim:
      "Your walk-in room rate is exactly this bet. The 'right' number depends on the season's mix of guests and what competitors are charging.",
  },

  // ===================== OPERATIONS / COST / PEOPLE =====================
  {
    id: 'fixed-vs-variable',
    category: 'operations',
    contexts: ['operations', 'finance', 'any'],
    level: 1,
    title: "Two kinds of cost: ones that move, ones that don't",
    body:
      'Fixed costs stay the same no matter how busy you are — rent, salaries, the building. Variable costs rise and fall with activity — the soap and laundry for each guest. A software company is almost all fixed cost (one more user costs them nearly nothing); a food truck is mostly variable (every taco needs ingredients). Knowing which is which tells you what an extra sale really costs you.',
    sim:
      'Your big costs — rent, depreciation, admin, permanent staff — are fixed. The direct cost per night (~$8) is tiny and variable. That mix shapes every decision.',
  },
  {
    id: 'operating-leverage',
    category: 'operations',
    contexts: ['operations', 'finance'],
    level: 2,
    title: 'Why hotels swing between feast and famine',
    body:
      'When most of your costs are fixed, profit reacts violently to changes in sales. Fill the rooms and almost every extra dollar drops to the bottom line; empty them and you still owe the fixed bills. That is high operating leverage. Airlines, hotels, and cinemas all live with it — a good month is great and a bad month hurts.',
    sim:
      'With low variable cost and heavy fixed cost, your occupancy is the throttle. Half-empty in a soft season bleeds against bills you pay regardless.',
  },
  {
    id: 'contribution-margin',
    category: 'operations',
    contexts: ['operations', 'sales', 'pricing'],
    level: 2,
    title: 'What one more sale is really worth',
    body:
      "Contribution margin is the price of one sale minus the variable cost of that one sale — what is left over to 'contribute' toward your fixed costs and profit. If a room rents for $120 and the variable cost is $8, that night contributes $112. Because that number is so high, filling an otherwise-empty room is almost pure gain.",
    sim:
      'Each night sold contributes nearly its full rate, since the per-night cost is trivial. This is why chasing occupancy can beat protecting price — within limits.',
  },
  {
    id: 'break-even',
    category: 'operations',
    contexts: ['operations', 'finance'],
    level: 2,
    title: 'The point where you stop losing money',
    body:
      'Break-even is the level of sales where revenue exactly covers all your costs — below it you lose money, above it you profit. A new restaurant might need to serve, say, 60 covers a night just to keep the lights on; everything past 60 is profit. Knowing your break-even tells you how much cushion (or trouble) you are in.',
    sim:
      "There's an occupancy level that just covers your fixed bills each season. Below it, especially in soft winter, the goal becomes 'lose as little as possible.'",
  },
  {
    id: 'capacity-utilization',
    category: 'operations',
    contexts: ['operations', 'sales'],
    level: 1,
    title: "Use what you're already paying for",
    body:
      'Capacity utilization is how much of what you have got is actually working. An airline flying half-empty planes, a factory running one shift instead of three, a hotel at 50% occupancy — all are paying for capacity they are not using. Idle capacity is quiet waste: the cost is there whether or not you fill it.',
    sim:
      'Occupancy % is your utilization. The whole building\'s fixed cost is the same at 40% or 90% full — so unused rooms are money already spent and not earned back.',
  },
  {
    id: 'workforce-flexibility',
    category: 'operations',
    contexts: ['operations', 'personnel'],
    level: 1,
    title: 'A core team plus a flexible edge',
    body:
      "Most businesses keep a stable core of permanent staff who know the place well, plus flexible workers they can add or drop as demand rises and falls. Every retailer hires holiday-season temps for exactly this reason — you don't keep December's headcount in February. Permanent staff give you reliability and skill; temporary staff give you the ability to breathe in and out with demand.",
    sim:
      'You choose permanent vs. temporary staff. Permanents bring quality and stability; temps let you flex for the season without long-term cost.',
  },
  {
    id: 'adjustment-costs',
    category: 'operations',
    contexts: ['operations', 'personnel'],
    level: 2,
    title: 'Changing your mind costs money',
    body:
      'Hiring is not free and firing is often worse — severance, lost training, morale. Economists call these adjustment or switching costs. Because of them, lurching your headcount up and down is expensive: you pay to staff up, then pay again to cut back. Steady beats jumpy when each change has a price tag.',
    sim:
      'Recruiting a permanent employee costs less than laying one off (roughly $4k vs. $12k). Hiring people you will later cut is a costly round-trip — lean on temps for swings instead.',
  },
  {
    id: 'quality-cost-tradeoff',
    category: 'operations',
    contexts: ['operations', 'personnel', 'any'],
    level: 2,
    title: 'Quality costs now and pays later',
    body:
      'Spending on quality — training, upkeep, better materials — costs real money today and the payoff arrives later, as customers who come back and pay more. Skimp and you save now but erode the thing people are buying. It is a patience game: the bill is immediate, the reward is delayed.',
    sim:
      'Training and maintenance both cost you this round but raise your Quality Level, which supports demand and the price you can charge in later rounds.',
  },
  {
    id: 'depreciation',
    category: 'operations',
    contexts: ['operations', 'finance'],
    level: 1,
    title: 'Things wear out, so we spread the cost',
    body:
      'Big assets lose value as they age and get used — a new car is worth less the moment you drive it off the lot, and a lot less after ten years. Instead of counting the whole purchase as one giant cost, accounting spreads it out a little each year. That yearly slice is depreciation: a real loss of value, even though no cash leaves your pocket that year.',
    sim:
      'Your rooms depreciate each season (a set amount per room). It shows up as a cost on the income statement and chips away at the building\'s value on the balance sheet — but it is not cash going out the door.',
  },
  {
    id: 'maintenance-as-investment',
    category: 'operations',
    contexts: ['operations'],
    level: 2,
    title: 'Skipping upkeep is borrowing from the future',
    body:
      'Maintenance feels like pure cost, so it is tempting to defer it. But a neglected asset quietly decays — the building gets shabbier, customers notice, and the eventual repair is bigger. Putting off maintenance is really borrowing against the future, with interest paid in lost quality.',
    sim:
      'Condition of facilities slips a little every round from normal wear. Maintenance and renovation hold it up; let it slide and your Quality Level — and demand — follow it down.',
  },
  {
    id: 'diminishing-returns',
    category: 'operations',
    contexts: ['operations', 'marketing', 'personnel'],
    level: 2,
    title: 'The first dollar does the most work',
    body:
      'Keep adding more of one thing and each extra unit helps less than the last. The first hour of studying teaches you a lot; the tenth hour, much less. The first $1,000 of training lifts a green team noticeably; the tenth $1,000 barely moves an already-skilled one. This is diminishing returns, and it is why "more" is not always worth it.',
    sim:
      'Training raises competence fast at first, then tapers — so piling on more eventually buys you very little. Marketing behaves similarly.',
  },
  {
    id: 'process-improvement',
    category: 'operations',
    contexts: ['operations', 'finance'],
    level: 3,
    title: 'Doing the same thing for less',
    body:
      "Process improvement means redesigning how work gets done so it uses less time, money, or waste — without cutting the output. Toyota famously rebuilt car-making this way (the approach behind 'lean'), squeezing out waste step by step. The payoff compounds: a cost you cut this year stays cut.",
    sim:
      'Cost-saving efforts (direct and administrative) are this idea. They cost money up front but lower your costs going forward, and the effect accumulates across rounds.',
  },
  {
    id: 'economies-of-scale',
    category: 'operations',
    contexts: ['operations', 'strategy'],
    level: 3,
    title: 'Bigger can be cheaper per unit',
    body:
      'As a business grows, it can often spread fixed costs over more output, so the cost of each unit falls — that is economies of scale. A bakery making 1,000 loaves a day pays less per loaf than one making 50, because the oven and rent are shared across more bread. But scale usually arrives in lumps, not smooth steps.',
    sim:
      'Room capacity is added in fixed blocks of five rooms — you can not add half a block. Growth comes in chunks, and each chunk takes a season to come online.',
  },

  // ===================== FINANCE / ACCOUNTING =====================
  {
    id: 'three-statements',
    category: 'finance',
    contexts: ['finance', 'any'],
    level: 1,
    title: "Three ways to see a business's money",
    body:
      'Every company is described by three financial statements, each answering a different question. The income statement: did we make money over this period? (like a report card). The balance sheet: what do we own and owe right now? (a snapshot of net worth). The cash flow statement: where did cash actually come and go? (like your bank statement). You need all three — they tell different truths.',
    sim:
      'The Projections panel shows the income statement and balance sheet; Results adds cash flow. Reading all three together is how you understand a round, not just one.',
  },
  {
    id: 'revenue-vs-profit',
    category: 'finance',
    contexts: ['finance', 'sales', 'any'],
    level: 1,
    title: 'Top line vs. bottom line',
    body:
      "Revenue is all the money coming in from sales — the 'top line.' Profit is what is left after every cost is paid — the 'bottom line.' A lemonade stand can take in $100 (revenue) but if lemons, cups, and the table cost $90, it only keeps $10 (profit). Big revenue with bigger costs is a busy way to go broke.",
    sim:
      'Sales revenue sits at the top of the income statement; net profit at the bottom, after personnel, direct cost, overhead, interest, and tax. Chasing revenue alone can shrink profit.',
  },
  {
    id: 'profit-vs-cash',
    category: 'finance',
    contexts: ['finance'],
    level: 2,
    title: 'Profitable and broke at the same time',
    body:
      'Profit and cash are not the same thing, and the gap is timing. You can book a sale today (profit) but not get paid for 60 days (no cash yet) — meanwhile rent is due now. Plenty of profitable businesses have collapsed because the cash arrived too late to pay the bills. Profit is the scorecard; cash is the oxygen.',
    sim:
      "Letting agencies pay you later (a longer credit term) doesn't change the sale, but it ties up cash in 'receivables' — money you have earned but don't have yet.",
  },
  {
    id: 'working-capital',
    category: 'finance',
    contexts: ['finance'],
    level: 3,
    title: 'Money trapped in the day-to-day',
    body:
      'Working capital is the cash tied up just to keep operating — money owed to you by customers, stock sitting on shelves — offset by money you have not yet paid suppliers. When customers pay you slowly, cash gets trapped; when you pay suppliers slowly, cash is freed up. Managing this is unglamorous but it is where a lot of businesses live or die.',
    sim:
      "Your credit term to agencies and the terms you pay suppliers swing your receivables and payables — which is the 'change in working capital' line on the cash flow statement.",
  },
  {
    id: 'debt-vs-equity',
    category: 'finance',
    contexts: ['finance'],
    level: 2,
    title: 'Two ways to fund a business',
    body:
      'You can fund a company with debt (borrowed money you must repay with interest) or equity (the owners\' own money, no repayment but they own a share). Debt is cheaper when times are good but dangerous when they are not — the lender gets paid whether you profit or not. Equity is patient but the owners expect a return eventually.',
    sim:
      'You decide on long-term loans (debt). Short-term loans get taken automatically if you run short of cash — and they cost more. The owner\'s stake is the equity side.',
  },
  {
    id: 'interest-and-risk',
    category: 'finance',
    contexts: ['finance'],
    level: 2,
    title: 'Riskier borrowers pay more',
    body:
      'Interest is the price of borrowing money, and it is not the same for everyone. A lender charges more to a borrower who looks risky — exactly why a low credit score means a higher rate on a car loan. The more debt you already carry, the riskier you look, and the more your next dollar of borrowing costs.',
    sim:
      "Your 'company-specific prime rate' rises as you take on more debt. Short-term emergency loans cost prime PLUS a premium — the expensive kind you want to avoid.",
  },
  {
    id: 'leverage-gearing',
    category: 'finance',
    contexts: ['finance'],
    level: 3,
    title: 'Borrowing magnifies wins and losses',
    body:
      'Leverage (also called gearing) is how much you rely on borrowed money. Borrowing to invest is like using a lever — it amplifies the outcome in both directions. A little debt with good results boosts your return; a lot of debt with bad results can crush you. More gearing means more potential reward and more risk, always together.',
    sim:
      'Gearing % measures your debt against the owners\' equity. Lenders watch it: high gearing flags risk and pushes your borrowing rate up.',
  },
  {
    id: 'dividends',
    category: 'finance',
    contexts: ['finance'],
    level: 2,
    title: 'Paying the owners',
    body:
      'A dividend is profit handed back to the owners instead of kept in the business. Steady, mature companies like Coca-Cola pay reliable dividends; fast-growing ones often pay none, choosing to reinvest every dollar (Amazon famously paid no dividend for decades). It is a real trade-off: cash to owners now, or fuel for growth later.',
    sim:
      'You can pay dividends out of accumulated profit (retained earnings) — and the hotel\'s owner explicitly wants them. But every dollar paid out is a dollar not available to run or grow the business.',
  },
  {
    id: 'retained-earnings',
    category: 'finance',
    contexts: ['finance'],
    level: 2,
    title: 'Profit you keep in the business',
    body:
      "Retained earnings are the profits a company has kept rather than paid out over its whole life — the running total of 'money we made and held onto.' It is a sign of long-term health, and it is the pot that dividends are paid from. Spend it all and there is nothing to draw on later.",
    sim:
      'Retained earnings sit on your balance sheet and set the ceiling on how much dividend you can pay. High retained earnings signal you have been profitable over time.',
  },
  {
    id: 'taxes-loss-carryforward',
    category: 'finance',
    contexts: ['finance'],
    level: 3,
    title: 'A bad year can soften a future tax bill',
    body:
      'Companies pay tax on profit, but a loss is not always wasted: many tax systems let you carry a loss forward to offset tax on future profits. So a rough year can quietly lower next year\'s tax bill. It will not make a loss good — but it cushions the recovery.',
    sim:
      'Tax is 30% of pre-tax profit, and losses carry forward — a loss now reduces tax on profits in later rounds until it is used up.',
  },
  {
    id: 'roce',
    category: 'finance',
    contexts: ['finance', 'strategy'],
    level: 3,
    title: 'Are you using your money well?',
    body:
      'It is not enough to make a profit — the question is whether you made a good profit for the amount of money tied up in the business. Return on capital (ROCE) answers that: profit divided by the capital it took to earn it. Two stores might each make $1M, but if one used half the capital, it is the better business.',
    sim:
      'ROCE % rates your operating profit against the equity and debt invested. It is a core report-card number — efficiency, not just size.',
  },
  {
    id: 'time-value-of-money',
    category: 'finance',
    contexts: ['finance', 'strategy', 'any'],
    level: 2,
    title: 'A dollar today beats a dollar later',
    body:
      'Money now is worth more than the same money later — you could invest it, and there is always the risk later never comes. Asked to choose $100 today or $100 in a year, almost everyone takes today, and they are right to. This simple idea sits under loans, interest, and nearly every investment decision.',
    sim:
      'It is why interest exists, why getting paid sooner (shorter credit term) helps your cash, and why a payoff several rounds away is worth less than one now.',
  },

  // ===================== STRATEGY / CROSS-CUTTING =====================
  {
    id: 'opportunity-cost',
    category: 'strategy',
    contexts: ['any', 'finance', 'operations'],
    level: 1,
    title: 'Every yes is a no to something else',
    body:
      'Opportunity cost is the value of the best thing you gave up to do what you chose. Spend an evening at the movies and the cost is not just the ticket — it is the dinner with friends you skipped. Money and time spent one way can not be spent another, so the real cost of any choice includes the road not taken.',
    sim:
      'A dollar into marketing is a dollar not into training or held as cash. There is no free move — every decision spends something that could have gone elsewhere.',
  },
  {
    id: 'sunk-cost',
    category: 'strategy',
    contexts: ['any', 'finance'],
    level: 1,
    title: "Spilled money shouldn't steer you",
    body:
      "A sunk cost is money already spent that you can not get back — and it should have zero say in what you do next. People sit through a bad movie 'because I paid for the ticket,' which only adds wasted time to wasted money. The only question that matters is what is best from here forward.",
    sim:
      "Last round's spending is gone. Each round, decide from where you are now — don't throw good money after a strategy just because you already invested in it.",
  },
  {
    id: 'competitive-dynamics',
    category: 'strategy',
    contexts: ['any', 'sales', 'pricing'],
    level: 2,
    title: 'Your results depend on the other players',
    body:
      'In most markets you do not control outcomes alone — rivals are making moves too, and your success depends partly on theirs. Drop your price and a competitor may match it, erasing the advantage. It is less like solitaire and more like chess: the board reacts to what everyone does.',
    sim:
      'How many rooms you actually sell depends on your price and quality relative to the other hotels in your market. The same decision can win or lose depending on what they do.',
  },
  {
    id: 'seasonality',
    category: 'strategy',
    contexts: ['any', 'sales', 'operations'],
    level: 1,
    title: 'Predictable ups and downs',
    body:
      "Many businesses have demand that rises and falls on a known calendar — ice cream in summer, toys at Christmas, ski resorts in winter. That's seasonality. The skill is not avoiding it (you can not) but managing across the whole cycle: make hay in the peak, hold the line in the trough.",
    sim:
      'Summer is the leisure high season where most profit is made; winter is soft and the goal is to avoid losses. Plan for the cycle, not just the round in front of you.',
  },
  {
    id: 'forecast-vs-actual',
    category: 'strategy',
    contexts: ['any', 'sales'],
    level: 1,
    title: 'A plan is a guess written down',
    body:
      'A forecast is your best estimate of what will happen — useful, but never exactly right. Weather forecasts, sales projections, budgets: all educated guesses that reality will nudge off course. The point is not to be perfect; it is to have a starting expectation you can compare against what actually occurs, and learn.',
    sim:
      'Projections update as you make decisions, but the real results at the deadline will differ — partly because competitors move. Treat the budget as a guide, not a guarantee.',
  },
  {
    id: 'tradeoffs',
    category: 'strategy',
    contexts: ['any'],
    level: 1,
    title: 'Almost nothing is free',
    body:
      'Most business decisions are not right-vs-wrong; they are this-vs-that. Cut the price and you sell more but earn less per sale. Add staff and service improves but costs rise. Good management is mostly the art of balancing competing goals, not finding a magic answer with no downside.',
    sim:
      'Price vs. volume, quality vs. cost, dividends vs. reinvestment, permanent vs. temporary staff — the sim is a stack of trade-offs. Naming the trade-off is half of making the call.',
  },
  {
    id: 'cost-leadership-vs-differentiation',
    category: 'strategy',
    contexts: ['strategy', 'pricing', 'sales'],
    level: 3,
    title: 'Compete on cheaper, or on better',
    body:
      'Broadly, there are two ways to win customers: be the low-cost option, or be different enough that people pay more. Walmart competes on price; Apple competes on being distinctive. Trying to be both at once usually means being neither — most strong businesses pick a lane.',
    sim:
      'Are you the affordable, fill-every-room hotel or the higher-quality, higher-price one? Your pricing, marketing, and quality decisions should point the same direction.',
  },
  {
    id: 'value-proposition',
    category: 'strategy',
    contexts: ['strategy', 'sales', 'marketing'],
    level: 2,
    title: 'Why should anyone choose you?',
    body:
      'A value proposition is the simple reason a customer picks you over the alternatives — cheaper, closer, nicer, faster, more trusted. If you can not say it in a sentence, customers can not feel it either. Everything you spend on should reinforce that one reason rather than scatter in all directions.',
    sim:
      'Your mix of price, quality, and marketing is your value proposition in action. The clearer and more consistent it is, the more reliably guests choose you over the other hotels.',
  },
  {
    id: 'shareholder-value',
    category: 'strategy',
    contexts: ['any', 'finance'],
    level: 2,
    title: 'The scoreboard above all scoreboards',
    body:
      'For a company with owners, the ultimate measure is not revenue or even profit — it is how much value owners gain over time, through a rising share price plus any dividends paid. That combined figure (total shareholder return) is the closest thing to a final score, because it rolls every other decision up into one number.',
    sim:
      'Cumulative Total Shareholder Return is how the simulation ranks teams. Pricing, staffing, and financing all ultimately feed this one bottom-line measure.',
  },
]

// Optional helper for the randomizer: weight lower-level cards to appear more often,
// and filter by the page/decision context currently in view.
export function pickPrinciple(contextKey, { rng = Math.random, exclude = null } = {}) {
  let pool = principles.filter(
    (p) => p.contexts.includes(contextKey) || p.contexts.includes('any'),
  )
  // Avoid immediately repeating the card we're replacing, when the pool allows.
  if (exclude && pool.length > 1) pool = pool.filter((p) => p.id !== exclude)
  if (pool.length === 0) return null
  // weight = 4 for level 1, 2 for level 2, 1 for level 3 (basics show more)
  const weightOf = (p) => (p.level === 1 ? 4 : p.level === 2 ? 2 : 1)
  const total = pool.reduce((s, p) => s + weightOf(p), 0)
  let r = rng() * total
  for (const p of pool) {
    r -= weightOf(p)
    if (r <= 0) return p
  }
  return pool[pool.length - 1]
}
