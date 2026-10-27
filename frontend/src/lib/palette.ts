// Color por posición dentro de la selección; las gráficas deben usar el mismo orden
export const SERIES_COLORS = ['#2563eb', '#d97706', '#0d9488', '#9333ea', '#e11d48', '#65a30d']

export function seriesColor(index: number) {
  return SERIES_COLORS[index % SERIES_COLORS.length]
}
