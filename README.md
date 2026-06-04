# SIMCESIM

**Live demo: [simcesim.vercel.app](https://simcesim.vercel.app/)**

A re-build of the **Cesim Service** hotel-business simulation's interface, created as an
MBA capstone artifact. It keeps the original's structure (so it's recognizable as "the
thing we used") and layers the teaching affordances the original withholds: a guided
decision loop, on-demand field explanations, decision-entry modals that show
cause-and-effect, and acronym tooltips.

**The thesis:** the underlying business model is perfectly learnable; the original's
*interface* withholds every cue — labels, units, ranges, definitions, relationships.
Re-layer the missing cues back on and the same simulation becomes teachable.

Three overlays map onto the three things the original withholds:

| Overlay | Supplies | Where |
|---|---|---|
| **Top strip** | *sequence* | the decision-loop strip below the top bar |
| **Right dock** | *meaning* | the explain panel (click any ⓘ) |
| **Field modals** | *relationships* | click any decision label |

## Honesty boundary

The real Cesim demand model (competitor-dependent) is hidden. SIMCESIM does **not** fake
it. It reproduces only the deterministic accounting (income statement, balance sheet,
occupancy, ratios) and uses **Approach A** for demand: you enter an estimate, and
everything downstream computes from it. Actual demand resolves only in the live system —
naming that boundary is part of the lesson. A few hidden relationships (advance pricing,
cost-saving curves, stress, Quality Level) use transparent, documented stand-ins marked
`SIMPLIFIED` in `src/data/formulas.js`.

## Stack

React + Vite + Tailwind CSS v3. Charts are hand-rolled inline SVG (no chart library).
All state is in-memory React state — no backend, no persistence in v1. Currency is USD.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Layout

```
src/
  components/
    chrome/     TopBar, NavTabs, SubNav, Footer, RoundSelector
    strip/      DecisionLoopStrip          (sequence overlay)
    dock/       ExplainPanel               (meaning overlay)
    modals/     FieldEntryModal, ProjectionsModal
    pages/      Sales, Operations, Finance, DecisionChecklist
    shared/     DecisionField, Readout, StatementTable, Donut, Gauge, Modal, Tooltip, …
  data/         fields.js, glossary.js, formulas.js, team.js, nav.js, docs.js
  state/        decisions.jsx (values + projection), ui.jsx (modal/dock state)
public/docs/    decision-making-guide.md, case-description.md  (source corpus)
_reference/     build spec + Cesim screenshots
```

## v1 scope (done)

Chrome · the three decision pages (Sales / Operations / Finance) with units-on-fields,
info icons, SVG widgets, live read-only statements · field-entry modals · explain dock ·
deterministic math + Projections lightbox · decision-loop strip · Decision checklist with
the team grid · ghosting pass (international, competitors, Sarah Wall, capacity, utilities).

## v2 scope (not built)

Corpus-grounded chatbot (user-supplied Anthropic key) · Results pages with ghosted
competitors · Home dashboard · round/season progression. See the build spec in
`_reference/`.
