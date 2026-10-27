import PopulationLineChart from './PopulationLineChart'
import CountriesBarChart from './CountriesBarChart'
import ContinentPieChart from './ContinentPieChart'

export default function ChartsView() {
  return (
    <div className="flex flex-col gap-6">
      <PopulationLineChart />

      <div className="grid gap-6 lg:grid-cols-2">
        <CountriesBarChart />
        <ContinentPieChart />
      </div>
    </div>
  )
}
