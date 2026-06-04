import { Tooltip } from './Tooltip'

// The universal info icon on every label (spec §7). Hover shows the short help; clicking
// surfaces the full explanation (onOpen). A filled glyph reads more clearly than a thin
// outline, and `align-middle` keeps it centered on the label's text.
export function InfoIcon({ help, onOpen, label }) {
  const btn = (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label ? `Explain: ${label}` : 'Explain'}
      className="ml-1 inline-flex h-[15px] w-[15px] items-center justify-center rounded-full bg-cesim-muted/80 align-middle text-[10px] font-bold italic leading-none text-white transition-colors hover:bg-cesim-link"
    >
      i
    </button>
  )
  return help ? (
    <Tooltip content={help} width={240}>
      {btn}
    </Tooltip>
  ) : (
    btn
  )
}
