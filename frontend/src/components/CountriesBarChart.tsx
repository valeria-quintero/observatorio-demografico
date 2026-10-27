import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useCountries } from '../hooks/use-countries'
import { seriesColor } from '../lib/palette'

export default function CountriesBarChart() {
  const { countries, isLoading, error } = useCountries()

  // Los 10 países con mayor % de la población mundial
  const top10 = [...(countries ?? [])]
    .sort((a, b) => b.worldPercentage - a.worldPercentage)
    .slice(0, 10)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Top 10 por % de la población mundial</h2>
      <p className="mb-4 text-sm text-slate-500">Qué parte del mundo vive en cada país</p>

      {error ? (
        <p className="py-16 text-center text-sm text-red-700">
          No se pudieron cargar los países: {error.message}
        </p>
      ) : isLoading ? (
        <p className="py-16 text-center text-sm text-slate-500">Cargando...</p>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <BarChart layout="vertical" data={top10} margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0e2e5" horizontal={false} />
            <XAxis type="number" tickFormatter={(v: number) => `${v}%`} />
            <YAxis type="category" dataKey="name" width={110} />
            <Tooltip formatter={(v) => `${Number(v).toFixed(2)}%`} />
            <Bar dataKey="worldPercentage" name="% mundial" fill={seriesColor(6)} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
