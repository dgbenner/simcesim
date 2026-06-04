import { Tooltip } from './Tooltip'
import { lookupTerm } from '../../data/glossary'

// Underline a jargon term and show its plain-language definition on hover/focus
// (spec §11). Use <Gloss term="EBITDA" /> — or <Gloss term="ROCE">return on capital</Gloss>
// to show different visible text than the lookup key.
export function Gloss({ term, children }) {
  const entry = lookupTerm(term)
  const text = children ?? (entry ? entry.term : term)
  if (!entry) return <span>{text}</span>
  return (
    <Tooltip
      width={280}
      content={
        <span>
          <span className="font-bold">{entry.term}</span>
          {' — '}
          {entry.long}
        </span>
      }
    >
      <span className="cursor-help underline decoration-dotted decoration-cesim-muted/70 underline-offset-2">
        {text}
      </span>
    </Tooltip>
  )
}
