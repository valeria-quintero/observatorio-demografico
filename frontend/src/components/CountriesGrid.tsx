import { useCallback, useEffect, useRef, useState } from 'react'
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

//"enciende" las piezas empleadas de AG Grid
ModuleRegistry.registerModules([AllCommunityModule])

//colores y tamaños de la tabla
const theme = themeQuartz.withParams({
  accentColor: '#e77db7',
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

//pone comas en los miles
const formatNumber = (v: number) => v.toLocaleString('es-MX')

//identificación de cada fila
const getRowId = (params: { data: Country }) => params.data.cca3

const numberColumn: ColDef<Country> = {
  filter: 'agNumberColumnFilter',
  cellClass: 'text-right',
}

const columnDefs: ColDef<Country>[] = [
  {
    field: 'name',
    headerName: 'País',
    pinned: 'left',
    width: 260,
    floatingFilter: false,
    cellClass: 'font-medium',
    sort: 'asc',
  },
  {
    field: 'cca3',
    headerName: 'Código',
    width: 130,
    cellClass: 'font-mono text-xs text-slate-500',
  },
  { 
    field: 'capital', 
    headerName: 'Capital', 
    width: 200 
  },
  { 
    field: 'continent', 
    headerName: 'Continente', 
    width: 180 
  },
  {
    field: 'areaKm2',
    headerName: 'Área km²',
    ...numberColumn,
    width: 160,
    valueFormatter: (params) => formatNumber(params.value),
  },
  {
    field: 'density',
    headerName: 'Densidad',
    ...numberColumn,
    width: 160,
    valueFormatter: (params) => formatNumber(params.value),
  },
  {
    field: 'growthRate',
    headerName: 'Crecimiento',
    ...numberColumn,
    width: 190,
    valueFormatter: (params) => Number(params.value).toFixed(4),
  },
  {
    field: 'worldPercentage',
    headerName: '% Mundial',
    ...numberColumn,
    width: 160,
    valueFormatter: (params) => `${Number(params.value).toFixed(2)}%`,
  },
]

const defaultColDef: ColDef<Country> = {
  filter: 'agTextColumnFilter',
  headerClass: 'uppercase tracking-wider',
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

  const totalCountries = countries?.length ?? 0

  const syncing = useRef(false)

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

  const onSelectionChanged = () => {
    const api = apiRef.current
    if (!api || syncing.current) return
    const inGrid = new Set(api.getSelectedRows().map((c) => c.cca3))
    const newSelection = [
      ...selected.filter((c) => inGrid.has(c)),
      ...[...inGrid].filter((c) => !selected.includes(c)),
    ]
    if (newSelection.length !== selected.length || newSelection.some((c, i) => c !== selected[i])) {
      setSelection(newSelection)
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Explorador de países</h2>
          <p className="text-sm text-slate-500">
            {totalCountries} países · marca las casillas para compararlos en Gráficas
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
            onFirstDataRendered={(e) => syncGridToStore(e.api, selected)}
            onSelectionChanged={onSelectionChanged}
          />
        </div>
      )}

      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500">
        <strong className="text-slate-900">{selected.length}</strong> seleccionados
      </footer>
    </section>
  )
}
