import {
  Legend,
  Pie,
  PieChart,
  type PieLabelRenderProps,
  type PieSectorShapeProps,
  ResponsiveContainer,
  Sector,
  Tooltip,
  useActiveTooltipDataPoints,
  useIsTooltipActive,
} from 'recharts'
import { useContinentSummary } from '../hooks/use-continent-summary'
import { seriesColor } from '../lib/palette'

const RADIAN = Math.PI / 180

// Pone el porcentaje en el centro de cada porción
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null
  }
  // Las porciones muy pequeñas no llevan etiqueta porque no cabe
  if ((percent ?? 0) < 0.03) {
    return null
  }
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5
  const x = Number(cx) + radius * Math.cos(-(midAngle ?? 0) * RADIAN)
  const y = Number(cy) + radius * Math.sin(-(midAngle ?? 0) * RADIAN)

  return (
    <text x={x} y={y} fill="white" fontSize={13} fontWeight={600} textAnchor="middle" dominantBaseline="central">
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  )
}

const HighlightSector = (props: PieSectorShapeProps) => {
  const activePoints = useActiveTooltipDataPoints()
  const isAnyActive = useIsTooltipActive()
  const isThisActive = isAnyActive && props.payload === activePoints?.[0]

  return (
    <Sector
      {...props}
      stroke="none"
      fillOpacity={isAnyActive && !isThisActive ? 0.5 : 1}
      style={{ transition: 'fill-opacity 0.3s ease' }}
    />
  )
}

export default function ContinentPieChart() {
  const { continentSummary, isLoading, error } = useContinentSummary()
  const data = continentSummary?.map((item, i) => ({ ...item, fill: seriesColor(i) }))

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Población por continente</h2>
      <p className="mb-4 text-sm text-slate-500">Porcentaje de la población mundial en 2022</p>

      {error ? (
        <p className="py-16 text-center text-sm text-red-700">
          No se pudieron cargar los continentes: {error.message}
        </p>
      ) : isLoading ? (
        <p className="py-16 text-center text-sm text-slate-500">Cargando...</p>
      ) : (
        <ResponsiveContainer width="100%" height={360}>
          <PieChart>
            <Pie
              data={data}
              dataKey="population"
              nameKey="continent"
              outerRadius="90%"
              labelLine={false}
              label={renderCustomizedLabel}
              shape={HighlightSector}
            />
            <Tooltip formatter={(v) => Number(v).toLocaleString('es-MX')} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </section>
  )
}
