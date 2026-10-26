import TopCountriesTable from './components/NativeTable'

function App() {
  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-bold text-slate-900">
        Observatorio Demográfico Global
      </h1>
      <div className="mt-6">
        <TopCountriesTable />
      </div>
    </main>
  )
}

export default App
