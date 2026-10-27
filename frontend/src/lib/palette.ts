// Color por posición dentro de la selección; las gráficas deben usar el mismo orden
export const SERIES_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#e11d48', '#65a30d', '#8884d8']

export function seriesColor(index: number) {
  return SERIES_COLORS[index % SERIES_COLORS.length]
}
