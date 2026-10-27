import { useState } from 'react'
import TopCountriesTable from './components/NativeTable'
import CountriesGrid from './components/CountriesGrid'
import SelectedChips from './components/SelectedChips'

const TABS = [
  { id: 'native', label: 'Tabla nativa' },
  { id: 'ag-grid', label: 'AG Grid' },
  { id: 'charts', label: 'Gráficas' },
] as const

type TabId = (typeof TABS)[number]['id']

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('ag-grid')

  return (
    <main className="mx-auto min-h-screen max-w-[1400px] bg-slate-50 px-5 py-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            World Population - Censo 2022
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Observatorio Demográfico Global
          </h1>
        </div>
        <SelectedChips />
      </header>

      <div className="mt-6 flex items-end justify-between border-b border-slate-200">
        <nav className="flex gap-1" role="tablist">
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
        <code className="pb-3 font-mono text-xs text-slate-500">activeTab: '{activeTab}'</code>
      </div>

      <div className="mt-6">
        {activeTab === 'native' && <TopCountriesTable />}
        {activeTab === 'ag-grid' && <CountriesGrid />}
        {activeTab === 'charts' && (
          <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            Las gráficas llegan en el siguiente paso.
          </p>
        )}
      </div>
    </main>
  )
}

export default App
