
import { useApp, useSummary } from '../context/AppContext'
import { groupByMonth, groupByCategory, formatCurrency } from '../Utilities/format'
import { CATEGORY_COLORS } from '../data/mockData'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { Flame, Target, Award, AlertTriangle, Calendar, TrendingUp, TrendingDown } from 'lucide-react'

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#07090a] border border-white/10 rounded-xl p-3 shadow-2xl">
      <p className="text-xs font-mono text-slate-400 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className="font-mono" style={{ color: p.fill }}>{formatCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Insights() {
  const { state } = useApp()
  const { totalIncome, totalExpense, balance } = useSummary()
  const monthly = groupByMonth(state.transactions)
  const byCat   = groupByCategory(state.transactions)

  const topCat = byCat[0]
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0
  const avgSpend = monthly.length ? monthly.reduce((s, m) => s + m.expense, 0) / monthly.length : 0
  const bestMonth = [...monthly].sort((a, b) => a.expense - b.expense)[0]

  const lastTwo = monthly.slice(-2)
  const expChangePct = lastTwo.length === 2 && lastTwo[0].expense > 0
    ? ((lastTwo[1].expense - lastTwo[0].expense) / lastTwo[0].expense) * 100
    : null

  const cards = [
    { label: 'Top Spending Category', value: topCat?.name || '—', sub: topCat ? formatCurrency(topCat.value) + ' total' : 'No data', Icon: Flame,    color: '#ff4f7b' },
    { label: 'Avg Monthly Spend',     value: formatCurrency(avgSpend, true),       sub: 'Across all months',              Icon: Target,   color: '#ffb84f' },
    { label: 'Savings Rate',          value: `${savingsRate.toFixed(1)}%`,         sub: savingsRate >= 20 ? 'Great job!' : savingsRate >= 10 ? 'Could improve' : 'Needs attention', Icon: savingsRate >= 20 ? Award : AlertTriangle, color: savingsRate >= 20 ? '#4fffb0' : savingsRate >= 10 ? '#ffb84f' : '#ff4f7b' },
    { label: 'Best Month',            value: bestMonth?.label || '—',              sub: bestMonth ? formatCurrency(bestMonth.expense, true) + ' expenses' : 'No data',  Icon: Calendar, color: '#4fb8ff' },
  ]

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div>
        <h1 className="font-bold text-xl text-white">Insights</h1>
        <p className="text-sm text-slate-500 mt-0.5">Patterns and observations from your data</p>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, Icon, color }) => (
          <div key={label} className="bg-[#07090a] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}18` }}>
              <Icon size={16} style={{ color }} strokeWidth={2} />
            </div>
            <p className="text-xl font-bold mb-1" style={{ color }}>{value}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">{label}</p>
            <p className="text-xs text-slate-500">{sub}</p>
          </div>
        ))}
      </div>

      
      {expChangePct !== null && (
        <div className={`bg-[#07090a] border rounded-2xl p-5 flex items-start gap-4
          ${expChangePct > 0 ? 'border-[#ff4f7b]/20' : 'border-[#4fffb0]/20'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            ${expChangePct > 0 ? 'bg-[#ff4f7b]/10' : 'bg-[#4fffb0]/10'}`}>
            {expChangePct > 0
              ? <TrendingUp size={18} className="text-[#ff4f7b]" />
              : <TrendingDown size={18} className="text-[#4fffb0]" />}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm mb-1">Month-over-Month</h3>
            <p className="text-sm text-slate-400">
              Your spending in <span className="text-white font-medium">{lastTwo[1]?.label}</span> was{' '}
              <span className={`font-semibold ${expChangePct > 0 ? 'text-[#ff4f7b]' : 'text-[#4fffb0]'}`}>
                {expChangePct > 0 ? '+' : ''}{expChangePct.toFixed(1)}%
              </span>{' '}
              compared to <span className="text-white font-medium">{lastTwo[0]?.label}</span>.{' '}
              {expChangePct > 10 ? 'Consider reviewing your recent spending habits.'
                : expChangePct < -5 ? 'Great work reducing your expenses!'
                : 'Your spending is relatively stable.'}
            </p>
          </div>
        </div>
      )}

    
      <div className="bg-[#07090a] border border-white/5 rounded-2xl p-5">
        <h2 className="font-bold text-white mb-0.5">Monthly Breakdown</h2>
        <p className="text-xs text-slate-500 mb-5">Income vs Expenses per month</p>
        {monthly.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} barGap={4} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₦${v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}`} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="income"  fill="#4fffb0" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="expense" fill="#ff4f7b" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="flex gap-5 mt-3">
          <span className="flex items-center gap-2 text-xs font-mono text-slate-400"><span className="w-3 h-2 rounded bg-[#2783d8]" /> Income</span>
          <span className="flex items-center gap-2 text-xs font-mono text-slate-400"><span className="w-3 h-2 rounded bg-[#ff4f7b]" /> Expenses</span>
        </div>
      </div>

      
      <div className="bg-[#07090a] border border-white/5 rounded-2xl p-5">
        <h2 className="font-bold text-white mb-0.5">Category Analysis</h2>
        <p className="text-xs text-slate-500 mb-5">All-time spending per category</p>
        {byCat.length === 0 ? (
          <p className="text-slate-500 text-sm">No expense data</p>
        ) : (
          <div className="space-y-3">
            {byCat.map(({ name, value }) => {
              const total = byCat.reduce((s, d) => s + d.value, 0)
              const pct = ((value / total) * 100).toFixed(1)
              const color = CATEGORY_COLORS[name] || '#07090a'
              return (
                <div key={name} className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-sm text-slate-300 w-36 truncate">{name}</span>
                  <div className="flex-1 h-1.5 bg-[#07090a] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 w-10 text-right">{pct}%</span>
                  <span className="text-xs font-mono text-slate-300 w-20 text-right">{formatCurrency(value, true)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}