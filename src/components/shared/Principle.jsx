import { useState } from 'react'
import { pickPrinciple } from '../../data/principles'

// PRINCIPLE (green) — the long-form reference card in the right rail: a general
// business/econ-101 fundamental, drawn at random from a context-scoped pool, weighted
// toward the basics, re-rollable, and tagged with the area it pertains to.
//
// NOTE: a SHORT inline variant (tied to a specific action, like the yellow <Axiom>) is
// planned separately and awaits shorter content — this card is the long-form tool.
const CATEGORY_LABEL = {
  sales: 'Sales',
  operations: 'Operations',
  finance: 'Finance',
  strategy: 'Strategy',
}

export function Principle({ contextKey = 'any' }) {
  const [card, setCard] = useState(() => pickPrinciple(contextKey))
  if (!card) return null

  const another = () =>
    setCard((cur) => pickPrinciple(contextKey, { exclude: cur?.id }) || cur)

  return (
    <aside className="card hidden self-start overflow-hidden border-green-200 lg:block">
      <div className="flex items-center gap-2 border-b border-green-200 bg-green-50 px-4 py-2.5">
        <span aria-hidden className="text-base leading-none">🏛️</span>
        <span className="text-[11px] font-bold uppercase tracking-wide text-green-800">
          Business principle
        </span>
        <button
          type="button"
          onClick={another}
          title="Show another principle"
          className="ml-auto rounded px-1.5 py-0.5 text-[12px] text-green-700 hover:bg-green-100"
        >
          ↻ another
        </button>
      </div>

      <div className="space-y-2.5 p-4">
        {/* what it pertains to */}
        <span className="inline-block rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-700">
          {CATEGORY_LABEL[card.category] ?? card.category}
        </span>
        <h3 className="text-[13px] font-bold leading-snug text-cesim-ink">{card.title}</h3>
        <p className="text-[12px] leading-relaxed text-cesim-ink">{card.body}</p>
        <div className="rounded border-l-2 border-green-400 bg-green-50/70 p-2 text-[11px] leading-relaxed text-green-900">
          <span className="font-bold">In this sim — </span>
          {card.sim}
        </div>
      </div>
    </aside>
  )
}
