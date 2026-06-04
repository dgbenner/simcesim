# Decision-making guide

*Bundled source document for SIMCESIM. This is the platform's step-by-step decision
guide — it carries the field language, the decision sequence, and the ratio formulas.
It also feeds the in-app explain layer and (v2) the corpus-grounded chatbot.*

---

## The decision process (7 steps)

The original Cesim "Tutorial" page is really a process outline, not a tutorial. These
seven steps are the macro-sequence each round:

1. **Read the accompanying materials** — this guide and the case description.
2. **Review the market situation** and last round's results.
3. **Read the market outlook** for the coming season.
4. **Choose your decision area** (your own Student area).
5. **Make decisions** — the heart of the round. Fill them in dependency order:
   **Sales → Operations → Finance.**
6. **Review budgets** — open the Projections to check your forecast statements.
7. **Copy as the team's decisions** when you're satisfied.

Step 5 is the part the original never walks you through. SIMCESIM's top strip makes it
concrete by stepping you through the decisions in dependency order and looping.

---

## Why this order (Sales → Operations → Finance)

Some areas must be filled first because they affect others:

- **Sales first** — price, marketing, and your demand estimate set the operating
  picture: how many room-nights you expect to sell and at what rate.
- **Operations next** — size personnel, training, and maintenance *to that demand*.
  Staffing and quality only make sense once you know the volume you're serving.
- **Finance last** — loans, dividends, and credit term are set after the operating
  picture is clear, because they respond to the cash the operation throws off.

---

## Sales decisions

- **Walk-in room rate** — the nightly rate individuals pay during the season. Your main
  pricing lever. Higher rate lifts revenue per filled night but, in the live market,
  competes against rivals for volume. Business travelers (winter) are less price-sensitive
  than leisure guests (summer).
- **Estimated nights sold** — your forecast of walk-in room-nights. This is an
  **estimation cell**: it feeds the budgeted income statement but does not set your
  actual sales. Actual demand resolves at the deadline in the live system.
- **Advance sales to travel agencies** — room-nights you pre-sell now to agencies for a
  future season (next season, and two seasons ahead). The more nights you offer, the
  lower the price per night (a volume discount). The cap is the lesser of your capacity
  and what agencies are willing to buy. The two advance windows trade against each other.
- **Marketing** — drives walk-in demand more than advance, and lifts advance prices
  somewhat. Because the variable cost of filling an otherwise-empty room is very low,
  marketing that fills rooms is high-contribution.

## Operations decisions

- **Maintenance and renovation** — raises facility condition, which feeds **Quality
  Level**, which supports demand and the price you can command.
- **Direct cost saving effort** — reduces per-night direct cost; the saving is
  cumulative across rounds.
- **Administration cost saving effort** — reduces the fixed admin line; also cumulative.
- **Personnel this period** — permanent headcount (part-time allowed). Hiring costs
  recruitment; cutting costs layoffs — and layoffs are dearer than recruitment, so churn
  is expensive. Understaffing raises stress and can hurt quality.
- **Wage / month** — higher wages reduce turnover and attract more competent hires, but
  raise personnel expense.
- **Training budget per person** — buys competence (with diminishing returns), which
  raises personnel quality and Quality Level.
- **Change in room capacity** — buying rooms in sets of five. *Out of scope for this
  course: there is no demand growth to build for.*

## Finance decisions

- **Changes in long-term loans** — borrow (cash in now, interest and gearing up) or
  repay (you can't repay more than you currently owe).
- **Dividends paid** — paid only out of available retained earnings. The owner expects a
  steady dividend stream.
- **Credit term** — days you let agencies wait before paying. Longer terms tie up cash in
  receivables but can help win advance sales.

---

## The Quality Level chain

```
Quality Level     = facility condition + personnel quality
personnel quality = f(temp / permanent ratio, average competence)
competence        = f(new / old personnel ratio, training this + prior rounds, new-hire wages)
```

Quality Level feeds demand and the price you can command. It is central, and the
original tool barely explains it.

---

## Ratio formulas

```
ROCE %  (annual)      = EBIT / (avg shareholders' equity + avg interest-bearing liabilities)
Gross profit ratio %  = gross profit / sales revenue
Net profit ratio %    = net profit / sales revenue
Gearing %             = (avg interest-bearing liabilities − avg cash) / avg shareholders' equity
Asset turnover        = total revenue / total assets
Dividend payout %     = dividend / profit for the round
EPS                   = profit for the round / number of shares (100,000)
P/E                   = share price / EPS
Hotel occupancy %     = nights sold / capacity in nights
Gross profit per room = gross profit / total room capacity
Net profit per room   = net profit / total room capacity
```

The scoreboard metric is **Cumulative Total Shareholder Return (TSR)** — share-price
change + dividends + reinvested returns, annualized.

---

## The honesty boundary

The real demand model — how many room-nights you actually sell given price, marketing,
quality, and **competitors' actions** — is hidden and partly competitor-dependent.
SIMCESIM does not fake it. It reproduces the deterministic accounting (income statement,
balance sheet, occupancy, ratios) and, for demand, uses your estimate. Actual demand
resolves only in the live system. Naming this boundary is part of the lesson.
