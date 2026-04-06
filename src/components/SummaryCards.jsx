
import { useSummary } from '../context/AppContext'
import { formatCurrency } from '../Utilities/format'
import { Wallet, TrendingUp, TrendingDown, Percent } from 'lucide-react'

export default function SummaryCards() {
  const { totalIncome, totalExpense, balance } = useSummary()
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0

  const cards = [
    {
      label: 'Total Balance',
      value: formatCurrency(balance, true),
      Icon: Wallet,
      color: balance >= 0 ? '#4fffb0' : '#ff4f7b',
      sub: balance >= 0 ? 'Available funds' : 'In deficit',
    },
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome, true),
      Icon: TrendingUp,
      color: '#4fffb0',
      sub: 'All-time earnings',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpense, true),
      Icon: TrendingDown,
      color: '#ff4f7b',
      sub: 'All-time spending',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate}%`,
      Icon: Percent,
      color: savingsRate >= 20 ? '#4fffb0' : savingsRate >= 10 ? '#ffb84f' : '#ff4f7b',
      sub: savingsRate >= 20 ? 'Great job!' : savingsRate >= 10 ? 'Could be better' : 'Needs attention',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, Icon, color, sub }, i) => (
        <div
          key={label}
          className="bg-[#07090a] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300"
          style={{ animationDelay: `${i * 0.06}s` }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
            style={{ background: `${color}18` }}
          >
            <Icon size={16} style={{ color }} strokeWidth={2} />
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color }}>{value}</p>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">{label}</p>
          <p className="text-xs text-slate-500">{sub}</p>
        </div>
      ))}
    </div>
  )
}