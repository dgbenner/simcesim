import { Gloss } from './AcronymTooltip'
import { InfoIcon } from './InfoIcon'

// A single read-only label/value row (the kind of bare readout the original left
// unexplained). Optional glossary term + info help bring meaning back.
export function Readout({ label, value, gloss, help, bold }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-[3px] text-[12px]">
      <span className="flex items-center text-cesim-muted">
        {gloss ? <Gloss term={gloss}>{label}</Gloss> : label}
        {help && <InfoIcon help={help} label={label} />}
      </span>
      <span className={`tabular-nums ${bold ? 'font-bold text-cesim-ink' : 'text-cesim-ink'}`}>
        {value}
      </span>
    </div>
  )
}
