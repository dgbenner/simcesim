import { Tag } from '../shared/Tag'
import { cn } from '../../lib/cn'
import mouseArrow from '../../assets/mouse-arrow.png'

// Persistent legend in the right column (always visible, never changes). Its only job is
// UI recognition: teaching how to read the marks on every field. The dynamic, per-field
// teaching lives in the slide-out ExplainDrawer — a deliberately separate surface.

// The info icon (ⓘ) — its visual in the legend, reused for both the hover and click cues.
function InfoGlyph() {
  return (
    <span className="grid h-5 w-5 place-items-center rounded-full border border-cesim-link text-[12px] font-bold text-cesim-link">
      i
    </span>
  )
}

// Real arrow-cursor asset, badged on the corner to signal "this one is a click action".
function CursorBadge() {
  return (
    <img
      src={mouseArrow}
      alt=""
      aria-hidden
      className="absolute -bottom-1.5 -right-1.5 h-4 w-auto drop-shadow"
    />
  )
}

// `tone` tints only the icon container (not the whole row) so the legend hints at a
// callout's color without spreading it across the page — yellow = Axiom, green = Principle.
const TONES = {
  yellow: 'border-amber-300 bg-amber-100/60',
  green: 'border-green-300 bg-green-100/60',
}

function Cue({ sample, title, children, tone }) {
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <span
        className={cn(
          'relative grid h-9 w-9 shrink-0 place-items-center rounded-md border',
          tone ? TONES[tone] : 'border-gray-200 bg-gray-50',
        )}
      >
        {sample}
      </span>
      <div className="min-w-0">
        <div className="text-[12px] font-bold text-cesim-ink">{title}</div>
        <p className="text-[11px] leading-snug text-cesim-muted">{children}</p>
      </div>
    </li>
  )
}

export function HowToReadPanel() {
  return (
    <aside className="card hidden self-start overflow-hidden lg:block">
      <div className="border-b border-gray-200 bg-gray-50/60 px-4 py-3">
        <h2 className="text-[14px] font-bold text-cesim-ink">How to Read This App</h2>
        <p className="mt-0.5 text-[11px] text-cesim-muted">What the marks on each field mean.</p>
      </div>

      <ul className="divide-y divide-gray-100">
        <Cue title="Info icon — hover" sample={<InfoGlyph />}>
          Hover the ⓘ for a quick, one-line definition.
        </Cue>

        <Cue
          title="Info icon — click"
          sample={
            <>
              <InfoGlyph />
              <CursorBadge />
            </>
          }
        >
          Click the ⓘ to open the field's full explanation in a side panel.
        </Cue>

        <Cue
          title="Underlined term"
          sample={
            <span className="text-[11px] font-semibold text-cesim-ink underline decoration-dotted decoration-cesim-muted underline-offset-2">
              EBITDA
            </span>
          }
        >
          A dotted underline marks a defined term — hover it for the meaning.
        </Cue>

        <Cue title="Axiom — Decision guide" tone="yellow" sample={<span className="text-lg leading-none">💡</span>}>
          A yellow lightbulb is a rule from this simulation's own decision guide — how the game works.
        </Cue>

        <Cue title="Principle — Business basics" tone="green" sample={<span className="text-base leading-none">🏛️</span>}>
          A green pillar is a broader business idea — the 101 behind any company, true beyond this game.
        </Cue>

        <Cue
          title="Tags"
          sample={
            <span className="grid h-2.5 w-5 grid-cols-2 gap-0.5">
              <span className="rounded-sm bg-cesim-link/60" />
              <span className="rounded-sm bg-amber-400" />
            </span>
          }
        >
          <span className="block space-y-1.5">
            <span className="flex items-center gap-2">
              <Tag variant="decision">decision</Tag> a lever you set
            </span>
            <span className="flex items-center gap-2">
              <Tag variant="estimation">forecast</Tag> feeds the budget, not your results
            </span>
          </span>
        </Cue>
      </ul>
    </aside>
  )
}
