# SIMCESIM — Build Specification

> **Audience:** This document is written for Claude Code as the implementer. It is the
> single source of truth for building SIMCESIM. It is not a study guide or a
> human-facing tutorial. Build from it directly. Where something is marked
> `INFERRED`, it was not confirmed against the live system and may need adjustment;
> where marked `CONFIRMED`, it was verified by clicking the real application.

---

## 1. What this is

SIMCESIM is a re-build of the **Cesim Service** hotel business simulation's interface,
created as an MBA capstone artifact. The original tool (used in a Mini MBA course) is
functional but pedagogically broken: it presents decision fields with **no labels of
substance, no value ranges, no units on fields, no descriptions, and almost no
explanation of the terminology or cause-and-effect**. An entire student cohort used it
for a full session and did not learn from it.

SIMCESIM keeps the original's structure (so it is recognizable as "the thing we used")
and **layers teaching affordances on top of it**: a guided decision loop, on-demand
field explanations, decision-entry modals that show cause-and-effect, acronym
tooltips, and (in v2) a corpus-grounded chatbot acting as "the instructor who actually
shows up."

### The thesis (this is the capstone argument — keep it legible in the build)

- **What was broken:** the cohort could not learn from the assigned tool.
- **What was hidden:** the underlying business model is perfectly learnable; the
  *interface* withholds every cue — labels, units, ranges, definitions, relationships.
- **What was possible:** re-layer the missing cues back on, and the same simulation
  becomes teachable.

The three overlay layers map directly onto the three things the original withholds:
the **top strip** supplies *sequence*, the **right dock** supplies *meaning*, the
**field modals** supply *relationships*.

### Honesty boundary (important — do not violate)

The real Cesim demand model — how many room-nights you actually sell given price,
marketing, quality, and **competitors' actions** — is hidden and partly
competitor-dependent. SIMCESIM does **not** fake it. It reproduces only the
**deterministic accounting** (income statement, balance sheet, occupancy, ratios — all
formula-defined). For demand, it uses **Approach A**: the user enters an estimate (just
like Cesim's own estimation cell), and everything downstream computes from that
estimate. SIMCESIM should be explicit, in its explain layer, that actual demand
resolves only in the live system. Naming this boundary is part of the lesson, not a
weakness.

---

## 2. Stack & setup

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Charts:** **None in v1.** The two decision-page widgets (Sales pie, Operations
  stress gauge) are hand-rolled inline **SVG**. Do NOT add Chart.js. If real charting
  is ever needed in v2 (e.g. plotting the user's own results across rounds), use
  **Recharts** (React-native), not Chart.js.
- **Backend:** None in v1. All state is in-memory (React state). No database, no router
  server.
- **Persistence:** None required in v1. (Do NOT use localStorage/sessionStorage for app
  state in v1 — keep it in React state.) The only localStorage use is in v2, for the
  user-supplied Anthropic API key (see §13).
- **Repo:** single-page app, intended to run locally then push to GitHub.

Suggested structure:

```
src/
  components/
    chrome/        # TopBar, NavTabs, Footer, RoundSelector
    strip/         # DecisionLoopStrip
    dock/          # ExplainPanel, (v2) ChatBot
    modals/        # FieldEntryModal, ProjectionsModal
    pages/         # MarketOutlook, Sales, Operations, Finance, DecisionChecklist
    shared/        # InfoIcon, AcronymTooltip, GhostedTable, Pie (SVG), Gauge (SVG)
  data/
    fields.js      # the field catalog (§7) — single source for ranges/units/help
    glossary.js    # acronym + term definitions (§11)
    corpus/        # bundled source docs as md/json (for v2 chatbot + explain layer)
      decision-making-guide.md
      case-description.md
    formulas.js    # deterministic math (§10)
  state/
    decisions.js   # the editable decision values + defaults
  App.jsx
```

---

## 3. Naming, branding, currency

- App name: **SIMCESIM**. The name is intentionally a play on the original; it can be
  shown where the original shows "Cesim Service."
- **Currency: USD.** The original mislabels everything with a `€` symbol but the course
  treats all figures as US dollars. **Render all monetary values with `$`** and include
  a single global note (e.g. in the footer or a one-time banner) that the simulation
  denominates in USD. Do not repeat the currency caveat on every field.

---

## 4. Architecture — the layer model

The original Cesim pages are the **base layer**. SIMCESIM adds overlays:

1. **Top strip (sequence):** a control/progress bar across the top, *below* the
   native top bar. Walks the user through the decision sequence and can loop. See §6.
2. **Right dock (meaning):** a persistent right-hand panel giving plain-language
   explanation of the active field/decision — what it is, its unit, its range, what it
   affects. In v2 this dock also hosts the chatbot as a tab/mode. See §8.
3. **Field-entry modals (relationships):** clicking an editable field opens a modal
   that shows the input, its bounds *and why those bounds exist*, and the cause-effect
   ("raise this → these go up, those go down, this other thing is affected"). See §9.

Plus supporting pieces: acronym tooltips (§11), the Projections lightbox modal (§10),
and global ghosting/disable rules (§5).

**Do not narrate the machinery to the user.** No "this is the explain layer" labels in
the UI chrome; the affordances just work.

---

## 5. Global chrome + ghosting/disable rules

### Top bar (native, reproduce faithfully)
Logo/"SIMCESIM", then the meta strip: "Decisions area: Dan Benner", "Latest changes:
No changes", "Round 2: [static countdown]", "Team: Hotel Red", member avatars, then the
nav row: HOME / DECISIONS / RESULTS / SCHEDULE / TEAMS / READINGS / FORUMS, then
profile / help / logout icons.

- **Countdown clock:** static, non-functional (chrome only).
- **profile / help / logout:** present, low-opacity, disabled.

### Footer (reproduce faithfully)
Course info (Course: Mini MBA June 2026; Universe 1; Instructor: Sarah Wall;
Co-instructor: Dan McLaughlin; Round 2 deadline) and Support/reading links
(Decision-making guide, Case description, Support, Sitemap).

- **Decision-making guide** and **Case description** links: ACTIVE — open the bundled
  source docs in a new tab. These two docs also feed the explain layer and (v2) chatbot
  corpus. See §11/§13.
- Support, Sitemap: present, disabled.

### Utility nav (top-right) — also surface the two source docs
In addition to the footer links, expose **Decision-making guide** and **Case
description** in the top-right utility area, opening in a new tab.

### Results-page utilities (when Results is built, v2)
XLS / Print / Slideshow icons and the **Universe selector**: present, low-opacity,
disabled (single universe = the whole class; no export needed).

### Ghosting rules (apply everywhere)
- **International market:** present but dimmed to low opacity and inactive everywhere it
  appears (Sales tab, Operations tab, all tables). The concept is shown; the depth is
  out of scope for this course.
- **Competitor teams** (The Northline, Blue, Hotel of America): wherever a
  multi-team comparison table or chart appears (Results, Sorting, the competitor
  charts), show **only Hotel Red active**; render the others present but ghosted. Any
  comparison chart that would need competitor data is ghosted (static greyed
  placeholder, no chart library).
- **Sarah Wall:** she is the **instructor**, mistakenly listed on Hotel Red. **Ghost
  her out** of the team roster (Teams page) AND of the **Decision checklist** column
  grid (dim/deactivate her column). The three active members are: **Dan Benner, Maddie
  Lenarz Hooyman, Sara Hawkins-Lindau.** She remains listed as instructor in the footer
  (that's her real role).

### Round selector
- Drop practice rounds entirely.
- List all **7 real rounds**, numbered AND season-labeled (e.g. "Round 1 · Winter",
  "Round 2 · Summer", "Round 3 · Winter", …). Winter/summer alternate; Round 2 is
  Summer (CONFIRMED by the live "summer" page titles).
- Future/unplayed rounds shown but inactive.
- Placement: on the **Decision checklist** the selector is top-**left**; on Results
  pages (v2) the selectors are top-**right**. Reproduce this faithfully.

---

## 6. The decision-loop strip (top strip)

This is the heart of the "sequence" overlay and the answer to the original's biggest
gap — the Tutorial page's step 5 ("Decision-making time") tells you to make decisions
but never walks you through them.

The original Cesim **Tutorial** page is really a 7-step *process outline* (not a
tutorial). Those 7 steps are the macro-sequence; SIMCESIM's strip makes step 5 concrete.

The 7 steps (reproduce as the loop's backbone):
1. Read accompanying materials → (the two source docs in utility nav)
2. Review market situation / last round's results
3. Read the market outlook
4. Choose decision area (your own Student area)
5. **Make decisions** → the fuzzy part. Expand into the dependency-ordered sub-sequence:
   **Sales → Operations → Finance.**
6. Review budgets → (the Projections modal)
7. Copy as team's decisions

### Strip behavior
- Sits across the top, below the native top bar.
- Shows progress: e.g. "5 of 8 decisions made" style counter (count the editable
  decisions the user has filled — see §7 for the editable set).
- Steps through the decisions in **dependency order** (Sales → Operations → Finance);
  highlighting the current step highlights the fields that belong to it.
- **Loops infinitely.** "Repeat season" abstraction — the loop can restart.
- **Intra-round sequencing is the real functionality.** Build this.
- **Inter-round / season progression is OUT OF SCOPE for real functionality in v1.**
  Represent it in the strip as an **inactive** gesture (a dimmed "advance to next
  season/round" affordance). Every round is mechanically identical; only the season
  label changes. Do not build multi-round state in v1.

### Decision dependency order (why this order — for the explain layer)
The guide states some areas must be filled first because they affect others. Order:
**Sales first** (demand/price/marketing) → **Operations** (size personnel & maintenance
to that demand) → **Finance last** (loans/dividends/credit term, after the operating
picture is set).

---

## 7. The editable decision set (field catalog)

This is the complete set of user-editable inputs across the whole simulation, with
**live-confirmed** ranges and units. Everything NOT listed here is a read-only readout
(computed/displayed), not a decision. Put this catalog in `src/data/fields.js` as the
single source for ranges, units, defaults, help text, and modal content.

> **Units go ON or BESIDE the input field**, never buried only in the row label. This
> is the single highest-leverage fix — the original's "unit-on-label" pattern was a
> primary source of confusion. Show `$`, `%`, `# people`, `$/month`, `$/person`,
> `days`, `nights` directly at the field.

> **Every left-hand label gets a clickable info icon** (ⓘ) → opens tooltip/explanation.
> Nearly every readout in the original communicates little bare ("Nights available"
> tells the user almost nothing). Universal info icons are core, not optional.

### SALES page (domestic; international tab ghosted)

| Field | Type | Range (CONFIRMED) | Unit shown | Default | Notes |
|---|---|---|---|---|---|
| Walk-in room rate (this season) | decision | 0–1,000 | `$` | empty | The main lever. |
| Estimated nights sold this season | estimation | 0–7,130 (capacity ceiling) | `nights` | empty | Budget-only: feeds the budgeted income statement, does NOT affect actual sales. |
| Advance sales — next season — "Nights offered to agencies" | decision | 0–min(capacity 9,000, agency cap ≈2,948) | `nights` | 0 | **Relabel** from the original's misleading "Nights sold this season." See below. |
| Advance sales — two seasons ahead — "Nights offered to agencies" | decision | 0–min(capacity 9,000, agency cap ≈2,860) | `nights` | 0 | Same structure; different agency cap. |
| Marketing | decision | 0–1,000,000 | `$` | 7,000 | Drives walk-in more than advance; also lifts advance *prices*. |

**Critical relabel — the "Nights sold this season" bug:** on the two advance-sales
blocks, the original labels the input "Nights sold this season," which is misleading —
it is **nights you are offering to travel agencies for a FUTURE season** (next season,
or two seasons ahead). Relabel to e.g. **"Nights offered to agencies for [season]"**
and explain in the tooltip/modal: you're pre-selling future room-nights to agencies
now; **more nights offered → lower price per night** (the agencies pay less per night
the more volume you push); the cap is the lesser of your capacity and what agencies
will buy at the offered terms (the agency cap is a **dynamic demand-side limit** — show
it, explain it, don't try to reproduce its exact value).

Confirmed error strings (use as the basis for the modal's "why this bound" text):
- "You can't sell more than your capacity of 9000 nights or the [N] nights that travel
  agencies are willing to buy."

**Income-statement Marketing cell** is the SAME marketing input mirrored into the
statement view — NOT a second decision. Make clear it's one field shown twice.

### OPERATIONS page (domestic; international tab ghosted)

| Field | Type | Range (CONFIRMED) | Unit shown | Default | Notes |
|---|---|---|---|---|---|
| Change in room capacity | decision (dropdown) | sets of 5 rooms | rooms | 0 | = **buying rooms**. **GHOST/disable this** — capacity expansion is out of scope for the cohort's learning; no demand growth to build for. Present, dimmed, inactive. |
| Maintenance and renovation | decision | 0–1,000,000 | `$` | 18,750 | Raises facility condition → Quality Level → demand & price. |
| Direct cost saving effort | decision | 0–1,000,000 | `$` | 5,000 | Reduces per-night direct cost; cumulative across rounds. |
| Administration cost saving effort | decision | 0–1,000,000 | `$` | 3,000 | Reduces the fixed admin line; cumulative. |
| Personnel turnover (estimation) | estimation | % | `%` (ON the field, not the label) | 10.0 | Est. share leaving/replaced; driven partly by wage/training, partly uncontrollable. |
| Personnel this period | decision | 2–100 | `# people` (decimals allowed) | 4.00 | **Headcount**, part-time allowed (decimals). Minimum 2 is a real floor. |
| Wage / month | decision | (range not captured) | `$/month` | 3,000 | Per permanent employee; affects turnover + competence. |
| Training budget per person | decision | 0–10,000 | `$/person` | 1,000 | Buys competence → quality; diminishing returns. |

Note: the original has exactly ONE help icon on this whole page (competence level) and
it's weak. SIMCESIM gives every field the ⓘ treatment.

### FINANCE page

| Field | Type | Range (CONFIRMED) | Unit shown | Default | Notes |
|---|---|---|---|---|---|
| Changes in long-term loans | decision | −3,345,725 to 10,000,000 | `$` | 0 | Negative floor = current outstanding balance (can't repay more than you owe). |
| Dividends paid | decision | 0–823,387 | `$` | 0 | Cap = retained earnings available (dividends only pay from retained earnings). |
| Credit term | decision | 0–180 | `days` | 30 | Days of credit to agencies; raises trade receivables (ties up capital). |

These bound-reasons (loan floor = balance owed; dividend cap = retained earnings) are
exactly the kind of "why this bound" content the modals should surface (§9).

---

## 8. Right dock — the explain panel

Persistent right-hand panel. Default mode is **passive explanation of the active
field/decision**: what it is (plain language), its unit, its range, and **what it
affects** downstream. Content sourced from the decision-making guide + case description
+ general hotel-business knowledge for terms the guide doesn't define.

In v2 the dock also hosts the **chatbot** as a tab/expandable mode (§13) — so one side
serves "tell me," the top strip serves "where am I," the modal serves "let me enter and
see relationships."

Real-estate note: the right panel and the (v2) chatbot **share one dockable side** —
panel is the default, chatbot is a tab/mode of the same dock. Don't flank the base with
two separate panels plus a top strip; that crowds the screen.

---

## 9. Field-entry modals (the relationships layer)

Clicking an editable field opens a **modal** (not just inline editing). The modal is
the teaching moment. It contains:

1. **The input** itself, with its unit shown.
2. **The bounds AND why they exist.** Not just "0–180" but "0 to 180 days — this is how
   long you let agencies wait to pay; longer terms tie up more cash in receivables."
   For loans: "−$3,345,725 to $10,000,000 — you can't repay more than the $3,345,725
   you currently owe." For dividends: "$0 to $823,387 — you can only pay dividends out
   of available retained earnings." For advance-sales nights: the capacity + agency-cap
   explanation.
3. **Cause-and-effect / tangibility.** "If you raise this → [X] will probably go up,
   [Y] will probably go down, and [Z] is also affected." Directional, plain-language.
   Sourced from the relationship map below.

### Relationship map (for modal cause-effect text)

- **Walk-in room rate ↑** → revenue per filled night ↑, but (in the live system) nights
  sold likely ↓ (price competes against rivals). Business travelers (winter) are less
  price-sensitive than leisure (summer). *In SIMCESIM (Approach A), actual nights come
  from the user's estimate — note this.*
- **Marketing ↑** → walk-in demand ↑ (more than advance), advance *prices* ↑ somewhat;
  cost ↑ on the income statement. Very low variable cost per night means filling
  otherwise-empty rooms is high-contribution.
- **Advance nights offered ↑** → price per night ↓ (volume discount); the two advance
  windows trade against each other (selling a lot two-seasons-ahead depresses the
  next-season window, and vice versa).
- **Maintenance/renovation ↑** → facility condition ↑ → Quality Level ↑ → demand & price
  support ↑; cost ↑.
- **Direct cost-saving effort ↑** → per-night direct cost ↓ (cumulative); cost ↑ now.
- **Admin cost-saving effort ↑** → fixed admin line ↓ (cumulative); cost ↑ now.
- **Permanent headcount ↑** → personnel expense ↑, recruitment cost ↑ if hiring; layoff
  cost if cutting (asymmetric — recruiting is cheaper than firing); personnel stress ↓;
  understaffing ↑ stress and can hurt quality. (Layoff $12,000/person vs recruit
  $4,000/person domestic — round-trip churn is expensive.)
- **Wage ↑** → turnover ↓, competence of new hires ↑; personnel expense ↑.
- **Training ↑** → competence ↑ → personnel quality ↑ → Quality Level ↑; diminishing
  returns; cost ↑.
- **Credit term ↑** → trade receivables ↑ (capital tied up); can support advance sales.
- **Long-term loan ↑** → cash ↑ now, interest expense ↑, gearing ↑ (more risk → higher
  company-specific prime rate over time).
- **Dividends ↑** → retained earnings ↓, cash ↓ (owner wants dividends per the case).

### Quality Level chain (define clearly — central and under-explained in the original)
`Quality Level = facility condition + personnel quality`, where
`personnel quality = f(temp/permanent ratio, average competence level)` and
`competence = f(new/old personnel ratio, training budgets this+prior, new-hire wages)`.
Quality Level feeds demand and the price you can command.

---

## 10. Deterministic math + Projections modal

SIMCESIM computes only the **formula-defined accounting** (Approach A: demand = user
estimate). Put all of this in `src/data/formulas.js`. All figures USD.

### Parameters (CONFIRMED, from Market Outlook — note these differ slightly by season)
Winter (Round 1) and Summer (Round 2) showed slightly different values; default to the
Summer/Round-2 set since that's the active round, and allow a season param:

- Room capacity: 50 rooms × 180 nights = **9,000 nights/season** per market.
- Price / room (capacity build): 125,000 (winter) / 165,000 (summer outlook). Build is
  ghosted, so this is informational only.
- Depreciation: 1,000 / room / 6 months (→ 50,000/season at 50 rooms). CONFIRMED 50,000.
- Rental payment for property: 62,500 / 6 months (domestic). CONFIRMED 62,500.
- Base administration cost: 50,000 (domestic). CONFIRMED 48,210 appears as the
  post-cost-saving admin line on statements — use the displayed value; base is 50,000.
- Base direct cost per room(-night): 7.70 (domestic). CONFIRMED direct cost ≈ 7.57–7.70.
- Temporary worker monthly wage: ~2,704–2,758 (domestic), varies by round.
- Recruitment cost: 4,000–7,500/person (domestic, varies by round).
- Layoff cost: 12,000/person (domestic, 0–5% band) / 15,000 (5–100% band).
- Tax rate: 30%.
- Prime interest (debt): ~4.04–5.06% annual (varies by round). Cash interest same.
- Short-term premium: +2.01% annual.
- Payables outstanding: 16.67% of sales.

### Income statement (compute, display read-only; matches the Sales-page + Projections)
```
Sales revenue          = nights_sold_estimate * weighted_avg_room_rate
Personnel expenses     = permanent_wages + temporary_wages + training + recruitment + layoffs
Direct cost            = direct_cost_per_night * nights_sold_estimate   (net of cumulative direct savings)
Gross profit           = Sales revenue - (personnel + direct)
Other operating exp    = administration (net of admin savings) + marketing + rental
                         + layoff/recruitment + training + cost-saving efforts + maintenance
EBITDA                 = Operating revenue - Operating expenses
Depreciation           = 50,000 (at 50 rooms)
EBIT                   = EBITDA - Depreciation
Interest income        = cash_interest_rate * cash
Interest expense LT    = prime_rate * long_term_loans
Interest expense ST    = (prime + premium) * short_term_loans  (ST auto-taken only if cash short)
Income before taxes    = EBIT + interest income - interest expenses
Direct taxes           = 30% * income before taxes  (loss carryforward applies)
Net profit             = Income before taxes - taxes
```

### Balance sheet (compute, display read-only)
```
Assets:      PP&E (less depreciation) + trade receivables + cash
Equity:      share capital (fixed) + retained earnings + net profit for period
Liabilities: long-term loans + short-term loans + trade payables
Identity:    total assets == total equity + total liabilities  (must balance)
trade receivables driven by credit term; trade payables = 16.67% of sales (≈30-day terms)
```

### Cash flow (compute, display read-only)
```
From operations: EBITDA + financing income/expense - direct taxes
  + change in working capital (Δreceivables, Δpayables)
  = net operating cash flow
- facilities capex (0 if build ghosted) = net investment cash flow
+ Δlong-term loans + Δshort-term loans - dividends = net financing cash flow
Net change in cash → end-of-period cash. (Depreciation excluded — not real cash.)
```

### Ratios (compute, display read-only) — formulas CONFIRMED from the guide
```
ROCE % (annual)        = EBIT / (avg shareholders' equity + avg interest-bearing liabilities)
Gross profit ratio %   = gross profit / sales revenue
Net profit ratio %     = net profit / sales revenue
Gearing %              = (avg interest-bearing liabilities - avg cash) / avg shareholders' equity
Asset turnover         = total revenue / total assets
Dividend payout %      = dividend / profit for round
EPS                    = profit for round / number of shares (100,000)
P/E                    = share price / EPS
Hotel occupancy %      = nights sold / occupancy-in-nights (capacity)
Gross profit per room  = gross profit / total room capacity
Net profit per room    = net profit / total room capacity
```

### Projections modal (lightbox)
The original "Projections" button opens the same Income statement / Balance sheet view
from any decision page — but it's **unstyled, no scrim, with only an X to close**.
SIMCESIM renders it as a **proper lightbox modal**: dim backdrop/scrim, clearly a
temporary overlay, X to close (top-right). Two tabs inside: **Income statement** /
**Balance sheet**. Reinforces the input→output mental model: open to check the forecast,
close back to your decisions.

- **Label it clearly as a PROJECTION** (a forecast, not a result — "updated as you make
  decisions; actual results at deadline will differ").
- Add plain-language framing around the jargon it contains (EBITDA, gearing, etc.) via
  the acronym tooltip system (§11). Redundancy is the point — people don't know these
  terms.


---

## 11. Explain layer — acronym tooltips + glossary

Put definitions in `src/data/glossary.js`. Two mechanisms:

1. **Acronym underline + tooltip:** every acronym/jargon term in the UI
   (EBITDA, EBIT, ROCE, EPS, P/E, gearing, Δ%, MVP-style terms, etc.) is **underlined**
   and shows a plain-language tooltip on hover/click. Finance and the Projections modal
   are densest with these.
2. **Field info icons (ⓘ):** every decision/readout label gets an icon → tooltip or
   opens the dock explanation.

Minimum glossary set (define all; source from guide where formula-defined, plain
language otherwise):

- **EBITDA** — Earnings Before Interest, Taxes, Depreciation & Amortization. Here:
  operating revenue minus operating expenses. Roughly, profit from running the hotel
  before financing and accounting deductions.
- **EBIT** — EBITDA minus depreciation. Operating profit.
- **ROCE** — Return on Capital Employed. How much operating profit you generate per
  dollar of capital (equity + interest-bearing debt) tied up in the business.
- **Gearing** — how much of the capital structure is debt vs. equity; higher = more
  financial risk → higher borrowing rate over time.
- **EPS** — Earnings Per Share = profit ÷ 100,000 shares.
- **P/E** — share price ÷ EPS; what the market pays per dollar of earnings.
- **Δ% (Delta %)** — the change versus the comparison column (e.g. vs. last season / last
  year). Define explicitly — not obvious to everyone.
- **Occupancy %** — nights sold ÷ nights available (capacity). A room-night unsold is
  gone forever (perishable inventory) — why filling rooms matters.
- **Room-night / nights** — one room for one night. Capacity = rooms × 180 × season.
  Most "nights" figures are room-nights, not rooms. (Directly answers the cohort's
  "is it rooms or nights?" confusion.)
- **Walk-in vs. advance sales** — walk-in = individuals booking during the season at
  your set rate; advance = bulk room-nights pre-sold to travel agencies for future
  seasons at a volume-discounted price.
- **Estimation cell** — a field whose value feeds the *budget/projection* only and does
  NOT change actual results (e.g. estimated nights sold, personnel turnover estimate).
- **Quality Level** — facility condition + personnel quality, as customers experience
  it; supports demand and price.
- **TSR (Cumulative Total Shareholder Return)** — the ultimate scoreboard metric: share
  price change + dividends + reinvested returns, annualized. (How the game is won.)

---

## 12. Design system

Reproduce the Cesim look closely enough to be recognizable; clean it up where it helps
clarity. From the screenshots:

- **Top bar:** deep blue (`#1c4b8f`-ish), white text, white logo mark.
- **Nav row:** white background, blue links, dark-blue active tab with underline.
- **Page background:** light grey (`#f0f0f0`-ish).
- **Cards/sections:** white, blue section-title with a blue underline rule.
- **Table header rows:** pale blue.
- **Hotel Red brand accent:** red (the team's color / flame icon).
- **Editable fields:** distinct treatment so input cells are visually separable from
  read-only readouts (the original's failure to do this caused confusion). Give inputs a
  clear border/background; readouts plain. This input/output distinction is a stated
  requirement.
- **Ghosted elements:** reduced opacity (~35–45%), non-interactive, but still occupying
  their real layout position.
- **Info icons (ⓘ):** small, unobtrusive, on every label.
- **Modals:** lightbox with dim scrim, X top-right.

Read the frontend-design skill conventions for component styling; keep it production-
clean, not generic.

---

## 13. v2 scope (build AFTER v1 is solid)

Do not attempt these in the first pass. v1 must be a clean, demoable milestone first.

### 13a. Corpus-grounded chatbot ("the instructor who shows up")
- Lives as a tab/mode in the right dock.
- Calls the **Anthropic API directly from the client** with a **user-supplied API key**.
  Key entry UI; store in **localStorage** (acceptable for a personal/cohort tool —
  include an explicit note in the UI that this is not production-safe key handling and
  the key stays in the browser).
- **Corpus = bundled static files** in `src/data/corpus/` (decision-making guide +
  case description as markdown) **plus the field catalog + glossary + relationship map**.
  Inject the relevant pieces into the system prompt. **No vector DB / no RAG infra** —
  it's a small corpus; prompt-stuffing is fine.
- Purpose is **educational, not a cheating tool.** It explains levers, terminology, and
  directional cause-effect; it must be **candid about the hidden demand model** — it
  cannot tell you "set rate to $127 → sell exactly N nights," only direction + "watch
  the Projections." (It literally can't cheat, since the demand model isn't in the
  corpus — the architecture enforces honesty.)
- Optional stretch: let the chatbot hold the user's logged live-Cesim observations
  across a session ("we set 130, got 1,540 nights") to help triangulate the hidden
  model — turning the tool into a running lab notebook.
- Implementation reference: client calls `https://api.anthropic.com/v1/messages` with
  the user key; model e.g. a current Claude model; system prompt carries the corpus
  slice. Handle errors/empty responses gracefully.

### 13b. Results pages (with ghosted competitors)
Income statement (Previous-6mo / Rolling-12mo toggle), Balance sheet, Market report,
Operations report, Cash flow, Ratios (the TSR scoreboard), Sorting (league table). All
show Hotel Red active, competitors ghosted. Read-only.

### 13c. Home dashboard
The "Results summary" carousel (3 slides: Cumulative TSR % / Cumulative earnings /
EBITDA), Activity, Schedule, Tasks, Messages, Team. Mostly read-only chrome; low
priority. The TSR scoreboard is the one genuinely useful teaching element (shows how
you're graded) — consider elevating it.

### 13d. Round/season progression
Wire up the inactive strip gesture to actually advance rounds/seasons with carried
state. Only if it proves useful; every round is mechanically identical.

---

## 14. Build order (milestones)

**v1, in order:**
1. Project scaffold (Vite + React + Tailwind), chrome (top bar, nav, footer, round
   selector), routing between the decision tabs.
2. `fields.js`, `glossary.js`, `formulas.js`, `corpus/` populated from this spec + the
   bundled source docs.
3. Sales page — full editable fields, units-on-fields, info icons, SVG pie + legend,
   read-only readouts.
4. Operations page — editable fields (capacity ghosted), SVG stress gauge, competence
   help, personnel asymmetry surfaced.
5. Finance page — editable fields, acronym tooltips dense here.
6. Field-entry modal (bounds-with-reasons + cause-effect) wired to all editable fields.
7. Right-dock explain panel (passive mode).
8. Deterministic math + Projections lightbox modal (Income / Balance tabs).
9. Decision-loop strip (Sales→Operations→Finance, progress counter, loop; inter-round
   gesture inactive).
10. Ghosting/disable pass (international, competitors, Sarah Wall, utilities), USD pass,
    source docs in utility nav + footer.

**v2:** chatbot → results pages → home → progression.

---

## 15. Source materials bundled in repo

These exist as files for the corpus and the in-app doc links. Both are real Cesim
course documents already in hand:

- `corpus/decision-making-guide.md` — the platform's step-by-step decision guide;
  carries field language, the decision sequence, and all the ratio formulas. This is the
  spine that steps through and loops the decisions.
- `corpus/case-description.md` — Hotel le Bonheur narrative: a family hotel, **50 rooms**,
  predominantly leisure-driven with winter business travelers; most profit made in
  summer high season, winter goal is to avoid losses; owner (ex-Mrs. Charriott) expects
  a steady dividend stream; shares thinly traded OTC; competition intensifying; prior
  management team was fired. Supplies the "why" behind the levers (why winter is soft,
  why dividends matter, who's judging performance).

Where the guide doesn't define a hotel term, fill from general hotel-business knowledge
(perishable room-night inventory, fixed-cost-heavy operations, seasonal demand, flexible
labor).

---

## 16. Things to remember (judgment notes for the implementer)

- The model is **learnable**; the original's failure is **presentation**. Every design
  choice should reduce "I don't know what this field is / what it does / what unit it's
  in." If a choice doesn't serve that, it's probably out of scope.
- **Honesty over completeness:** never fabricate the demand model. Show the levers and
  directions; name the boundary.
- **Input vs. output must be visually obvious** everywhere.
- **Units on fields, definitions on jargon, reasons on bounds** — these three are the
  whole fix in miniature.
- Keep v1 shippable. A tool that fully works on the three decision pages beats a tool
  that half-works across everything.
