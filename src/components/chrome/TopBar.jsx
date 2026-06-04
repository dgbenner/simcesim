import { COURSE, HOTEL_RED } from '../../data/team'
import { NavTabs } from './NavTabs'

// Faithful reproduction of the native Cesim top bar: brand + meta strip + avatars
// on the gradient band, then the main nav row. Countdown is static chrome.
function MetaItem({ label, value }) {
  return (
    <div className="px-3 leading-tight">
      <div className="text-[11px] text-white/70 underline underline-offset-2">{label}</div>
      <div className="text-[12px] text-white whitespace-nowrap">{value}</div>
    </div>
  )
}

function Avatar({ initials, color, name }) {
  return (
    <div
      className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold text-white ring-2 ring-white/40"
      style={{ backgroundColor: color }}
      title={name || initials}
    >
      {initials}
    </div>
  )
}

export function TopBar() {
  return (
    <header className="bg-header-grad text-white shadow">
      {/* Row 1: brand · meta strip · avatars */}
      <div className="mx-auto flex max-w-[1180px] items-center gap-2 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded bg-white/15">
            <span className="text-lg">▲▲</span>
          </div>
          <div className="leading-none">
            <span className="text-[18px] font-bold tracking-wide text-white/80">SIM</span>
            <span className="text-[18px] font-bold tracking-wide">Cesim</span>
          </div>
        </div>

        <div className="mx-auto flex items-center divide-x divide-white/20">
          <MetaItem label="Decisions area" value="Dan Benner" />
          <MetaItem label="Latest changes" value="No changes" />
          <MetaItem label={COURSE.roundLabel} value={COURSE.countdown} />
          <div className="flex items-center gap-2 px-3 leading-tight">
            <div className="text-[11px] text-white/70 underline underline-offset-2">Team</div>
            <div className="flex items-center gap-1 text-[12px] text-white">
              <span className="text-brand-red">🔥</span> {HOTEL_RED.name}
            </div>
          </div>
        </div>

        <div className="flex items-center -space-x-1">
          {HOTEL_RED.members.map((m) => (
            <Avatar key={m.name} initials={m.initials} color={m.color} name={m.name} />
          ))}
        </div>
      </div>

      {/* Row 2: main nav */}
      <NavTabs />
    </header>
  )
}
