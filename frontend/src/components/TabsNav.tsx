import { useDemographicsStore, type TabId } from '../stores/use-demographics-store'

const TABS: { id: TabId; label: string }[] = [
  { id: 'table', label: 'Tabla nativa' },
  { id: 'ag-grid', label: 'AG Grid' },
  { id: 'charts', label: 'Gráficas' },
]

export default function TabsNav() {
  const activeTab = useDemographicsStore((s) => s.activeTab)
  const setActiveTab = useDemographicsStore((s) => s.setActiveTab)

  return (
    <nav className="mt-6 flex gap-1 border-b border-slate-200" role="tablist">
      {TABS.map((tab) => {
        const active = tab.id === activeTab
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => setActiveTab(tab.id)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              active
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
