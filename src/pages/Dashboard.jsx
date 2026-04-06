
import SummaryCards from '../components/SummaryCards'
import BalanceTrend from '../components/Balance'
import SpendingBreakdown from '../components/Spending'
import RecentTransactions from '../components/Recent'

export default function Dashboard() {
  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3"><BalanceTrend /></div>
        <div className="lg:col-span-2"><SpendingBreakdown /></div>
      </div>
      <RecentTransactions />
    </div>
  )
}