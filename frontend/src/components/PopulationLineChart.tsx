import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useHistory } from '../hooks/use-history'
import { useDemographicsStore } from '../stores/use-demographics-store'
import { seriesColor } from '../lib/palette'

export default function PopulationLineChart() {
  const selected = useDemographicsStore((s) => s.selectedCountries)
  const { history, isLoading, error } = useHistory()

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Población a lo largo del tiempo</h2>
      <p className="mb-4 text-sm text-slate-500">Una línea por cada país seleccionado</p>

      {selected.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">
          Selecciona al menos un país en AG Grid para ver su historial.
        </p>
      ) : error ? (
        <p className="py-16 text-center text-sm text-red-700">
          No se pudo cargar el historial: {error.message}
        </p>
      ) : isLoading ? (
        <p className="py-16 text-center text-sm text-slate-500">Cargando...</p>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(v: number) => `${(v / 1_000_000).toFixed(0)} M`} width={70} />
            <Tooltip formatter={(v) => Number(v).toLocaleString('es-MX')} />
            <Legend />
            {selected.map((code, i) => (
              <Line key={code} dataKey={code} stroke={seriesColor(i)} strokeWidth={2} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
