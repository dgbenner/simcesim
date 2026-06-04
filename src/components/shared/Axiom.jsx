// AXIOM (yellow) — a short, durable rule from this simulation's own decision guide,
// pinned inline to the decision it governs. The broader green "business basics" live in
// the separate <Principle> card (right rail). Keeping these one-tier avoids two ways to
// render green.
export function Axiom({ children, lead }) {
  return (
    <div className="mt-3 flex gap-2 rounded border-l-2 border-amber-400 bg-amber-50 p-2.5 text-[11px] leading-snug text-amber-900">
      <span aria-hidden className="select-none">💡</span>
      <p>
        {lead && <span className="font-bold">{lead} </span>}
        {children}
      </p>
    </div>
  )
}
