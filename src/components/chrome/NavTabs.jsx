import { cn } from '../../lib/cn'

// Main nav row. DECISIONS is the only live section in v1; the others are present but
// inactive (their pages are v2 scope). Profile/help/logout are disabled chrome.
const TABS = [
  { id: 'home', label: 'HOME', enabled: false },
  { id: 'decisions', label: 'DECISIONS', enabled: true },
  { id: 'results', label: 'RESULTS', enabled: false },
  { id: 'schedule', label: 'SCHEDULE', enabled: false },
  { id: 'teams', label: 'TEAMS', enabled: false },
  { id: 'readings', label: 'READINGS', enabled: false },
  { id: 'forums', label: 'FORUMS', enabled: false },
]

export function NavTabs({ onNavigate }) {
  const activeSection = 'decisions' // every decision page lives under DECISIONS
  return (
    <nav className="bg-header-nav">
      <div className="mx-auto flex max-w-[1180px] items-center px-4">
        <ul className="flex">
          {TABS.map((t) => {
            const active = t.id === activeSection
            return (
              <li key={t.id}>
                <button
                  type="button"
                  disabled={!t.enabled}
                  onClick={() => t.enabled && onNavigate('sales')}
                  className={cn(
                    'px-4 py-2.5 text-[12px] font-bold tracking-wide transition-colors',
                    active && 'bg-header-active text-white',
                    !active && t.enabled && 'text-white/90 hover:bg-white/10',
                    !t.enabled && 'text-white/45 cursor-default',
                  )}
                >
                  {t.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
