import TopCountriesTable from './components/NativeTable'
import CountriesGrid from './components/CountriesGrid'
import SelectedChips from './components/SelectedChips'
import TabsNav from './components/TabsNav'
import { useDemographicsStore } from './stores/use-demographics-store'

function App() {
  const activeTab = useDemographicsStore((s) => s.activeTab)

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
        {/* La tabla nativa no usa la selección, por eso no se muestran los chips ahí */}
        {activeTab !== 'table' && <SelectedChips />}
      </header>

      <TabsNav />

      <div className="mt-6">
        {activeTab === 'table' && <TopCountriesTable />}
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
