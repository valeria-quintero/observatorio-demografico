import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type RowSelectionOptions,
} from 'ag-grid-community'
import { useCountries } from '../hooks/use-countries'
import { useDemographicsStore } from '../stores/use-demographics-store'
import type { Country } from '../api/types'

ModuleRegistry.registerModules([AllCommunityModule])

const theme = themeQuartz.withParams({
  accentColor: '#2563eb',
  backgroundColor: '#ffffff',
  foregroundColor: '#0f172a',
  borderColor: '#e2e8f0',
  headerBackgroundColor: '#f8fafc',
  headerTextColor: '#64748b',
  headerFontSize: 11,
  headerFontWeight: 600,
  selectedRowBackgroundColor: '#e8eefc',
  rowHoverColor: '#f8fafc',
  fontSize: 14,
  rowBorder: true,
  wrapperBorder: false,
  headerRowBorder: true,
})

const rowSelection: RowSelectionOptions = {
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
  enableClickSelection: false,
}

const fmt = (v: number) => v.toLocaleString('en-US')

function PinnedHeader({ displayName }: { displayName: string }) {
  return (
    <span className="flex w-full items-center justify-between gap-2 pr-1">
      <span className="uppercase tracking-wider">{displayName}</span>
    </span>
  )
}

const columnDefs: ColDef<Country>[] = [
  {
    field: 'name',
    headerName: 'País',
    pinned: 'left',
    width: 260,
    filter: 'agTextColumnFilter',
    floatingFilter: false,
    headerComponent: PinnedHeader,
    cellClass: 'font-medium',
  },
  {
    field: 'cca3',
    headerName: 'Cód.',
    width: 100,
    cellClass: 'font-mono text-xs text-slate-500',
    filter: 'agTextColumnFilter',
  },
  { field: 'capital', headerName: 'Capital', width: 200, filter: 'agTextColumnFilter' },
  { field: 'continent', headerName: 'Continente', width: 170, filter: 'agTextColumnFilter' },
  {
    field: 'areaKm2',
    headerName: 'Área km²',
    type: 'rightAligned',
    width: 160,
    filter: 'agNumberColumnFilter',
    valueFormatter: (p) => fmt(p.value),
    sort: 'desc',
    sortIndex: 0,
  },
  {
    field: 'density',
    headerName: 'Densidad',
    type: 'rightAligned',
    width: 150,
    filter: 'agNumberColumnFilter',
    valueFormatter: (p) => fmt(p.value),
  },
  {
    field: 'growthRate',
    headerName: 'Crecim.',
    type: 'rightAligned',
    width: 140,
    filter: 'agNumberColumnFilter',
    valueFormatter: (p) => Number(p.value).toFixed(4),
  },
  {
    field: 'population',
    headerName: 'Población',
    type: 'rightAligned',
    width: 160,
    filter: 'agNumberColumnFilter',
    valueFormatter: (p) => fmt(p.value),
  },
  {
    field: 'worldPercentage',
    headerName: '% Mundial',
    type: 'rightAligned',
    width: 140,
    filter: 'agNumberColumnFilter',
    valueFormatter: (p) => `${Number(p.value).toFixed(2)}%`,
  },
]

const defaultColDef: ColDef<Country> = {
  sortable: true,
  resizable: true,
  floatingFilter: true,
  suppressHeaderMenuButton: true,
}

export default function CountriesGrid() {
  const { countries, isLoading, error } = useCountries()
  const selected = useDemographicsStore((s) => s.selectedCountries)
  const setSelection = useDemographicsStore((s) => s.setSelection)

  const apiRef = useRef<GridApi<Country> | null>(null)
  const [search, setSearch] = useState('')
  const [visibleRows, setVisibleRows] = useState(0)

  const total = countries?.length ?? 0

  // Evita que los cambios hechos al sincronizar vuelvan a escribirse en el store
  const syncing = useRef(false)

  // Pinta en la tabla lo que dice el store (carga inicial y chips quitados desde fuera)
  const syncGridToStore = useCallback((api: GridApi<Country>, codes: string[]) => {
    syncing.current = true
    api.forEachNode((node) => {
      const shouldSelect = codes.includes(node.data?.cca3 ?? '')
      if (node.isSelected() !== shouldSelect) node.setSelected(shouldSelect)
    })
    syncing.current = false
  }, [])

  useEffect(() => {
    if (apiRef.current) syncGridToStore(apiRef.current, selected)
  }, [selected, syncGridToStore])

  const onGridReady = (e: GridReadyEvent<Country>) => {
    apiRef.current = e.api
  }

  // Conserva el orden en que el usuario fue marcando países (define el color de cada serie)
  const onSelectionChanged = () => {
    const api = apiRef.current
    if (!api || syncing.current) return
    const inGrid = new Set(api.getSelectedRows().map((c) => c.cca3))
    const next = [
      ...selected.filter((c) => inGrid.has(c)),
      ...[...inGrid].filter((c) => !selected.includes(c)),
    ]
    if (next.length !== selected.length || next.some((c, i) => c !== selected[i])) {
      setSelection(next)
    }
  }

  const updateVisible = () => setVisibleRows(apiRef.current?.getDisplayedRowCount() ?? 0)

  const getRowId = useMemo(() => (p: { data: Country }) => p.data.cca3, [])

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Explorador de países</h2>
          <p className="text-sm text-slate-500">
            {total} países · marca las casillas para compararlos en Gráficas
          </p>
        </div>

        <label className="relative block w-full sm:w-80">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            ⌕
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en toda la tabla..."
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>
      </header>

      {error ? (
        <p className="border-t border-slate-200 px-6 py-8 text-sm text-red-700">
          No se pudieron cargar los países: {error.message}
        </p>
      ) : (
        <div className="h-[560px] border-t border-slate-200">
          <AgGridReact<Country>
            theme={theme}
            loading={isLoading}
            rowData={countries}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            getRowId={getRowId}
            rowSelection={rowSelection}
            quickFilterText={search}
            rowHeight={45}
            headerHeight={44}
            floatingFiltersHeight={48}
            onGridReady={onGridReady}
            onFirstDataRendered={(e) => {
              syncGridToStore(e.api, selected)
              updateVisible()
            }}
            onSelectionChanged={onSelectionChanged}
            onFilterChanged={updateVisible}
            onModelUpdated={updateVisible}
          />
        </div>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
        <span>
          <strong className="text-slate-900">{selected.length}</strong> seleccionados ·{' '}
          {visibleRows} de {total} filas visibles
        </span>
        <code className="font-mono text-slate-600">
          selectedCountries: [{selected.map((c) => `'${c}'`).join(', ')}]
        </code>
      </footer>
    </section>
  )
}
