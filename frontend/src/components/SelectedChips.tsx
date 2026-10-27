import { seriesColor } from '../lib/palette'
import { useDemographicsStore } from '../stores/use-demographics-store'

export default function SelectedChips() {
  const selected = useDemographicsStore((s) => s.selectedCountries)
  const setSelection = useDemographicsStore((s) => s.setSelection)

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <span className="mr-1">Seleccionados</span>
      {selected.map((code, i) => (
        <span
          key={code}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-3 pr-1.5 text-xs font-semibold text-slate-900 shadow-sm"
        >
          <span className="size-2 rounded-full" style={{ background: seriesColor(i) }} />
          {code}
          <button
            type="button"
            aria-label={`Quitar ${code}`}
            onClick={() => setSelection(selected.filter((c) => c !== code))}
            className="flex size-5 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )
}
