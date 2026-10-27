import { useCountries } from '../hooks/use-countries'

const headerCell = 'px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500'

function Placeholder({ className }: { className: string }) {
  return <span className={`block h-4 rounded bg-slate-200 ${className}`} />
}

// Según el crecimiento devuelve el símbolo y los colores del badge
function growthBadge(growthRate: number) {
  if (growthRate > 1.01) return { symbol: '▲', style: 'bg-emerald-100 text-emerald-800' }
  if (growthRate < 1.0) return { symbol: '▼', style: 'bg-red-100 text-red-800' }
  return { symbol: '●', style: 'bg-slate-100 text-slate-600' }
}

export default function TopCountriesTable() {
  const { countries, isLoading, error } = useCountries()

  //[...countries] hace una copia para no alterar la caché
  const top = [...(countries ?? [])]
    .sort((a, b) => b.population - a.population)
    .slice(0, 20)

  const maxPopulation = top[0]?.population ?? 1

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Top 20 países por población</h2>
          <p className="text-sm text-slate-500">
            Habitantes en 2022 · ordenado de mayor a menor
          </p>
        </div>

        <ul className="flex items-center gap-2 text-xs text-slate-500">
          <li className="flex items-center gap-2 rounded-md bg-emerald-100 px-2.5 py-1">
            <span className="text-emerald-800">▲</span> crece &gt; 1.01
          </li>
          <li className="flex items-center gap-2 rounded-md bg-slate-100 px-2.5 py-1">
            <span className="text-slate-600">●</span> estable
          </li>
          <li className="flex items-center gap-2 rounded-md bg-red-100 px-2.5 py-1">
            <span className="text-red-800">▼</span> decrece &lt; 1.00
          </li>
        </ul>
      </header>

      {error && (
        <p className="border-t border-slate-200 px-6 py-8 text-sm text-red-700">
          No se pudieron cargar los países: {error.message}
        </p>
      )}

      {!error && (
        <div className="overflow-x-auto border-t border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className={headerCell}>#</th>
                <th className={headerCell}>País</th>
                <th className={headerCell}>Continente</th>
                <th className={`${headerCell} text-right`}>Población 2022</th>
                <th className={`${headerCell} text-right`}>Crecimiento</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading
                ? Array.from({ length: 20 }, (_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 text-slate-500">{i + 1}</td>
                      <td className="px-6 py-4"><Placeholder className="w-28" /></td>
                      <td className="px-6 py-4"><Placeholder className="w-24" /></td>
                      <td className="px-6 py-4"><Placeholder className="ml-auto w-28" /></td>
                      <td className="px-6 py-4"><Placeholder className="ml-auto w-20" /></td>
                    </tr>
                  ))
                : top.map((country, i) => {
                    const badge = growthBadge(country.growthRate)

                    return (
                      <tr key={country.cca3} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-500">{i + 1}</td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                              {country.cca3}
                            </span>
                            <span className="font-medium text-slate-900">{country.name}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600">{country.continent}</td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-4">
                            {/* Barra proporcional al país más poblado */}
                            <span className="block h-1.5 w-36 rounded-full bg-slate-100">
                              <span
                                className="block h-full rounded-full bg-teal-400"
                                style={{ width: `${(country.population / maxPopulation) * 100}%` }}
                              />
                            </span>
                            <span className="w-32 text-right tabular-nums text-slate-900">
                              {country.population.toLocaleString('es-MX')}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${badge.style}`}>
                              {badge.symbol} {country.growthRate.toFixed(4)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
