
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'
import { groupByCategory, formatCurrency } from '../Utilities/format'
import { CATEGORY_COLORS } from '../data/mockData'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-[#1a2332] border border-white/10 rounded-xl p-3 shadow-2xl">
      <p className="text-xs font-mono text-slate-400 mb-1">{d.name}</p>
      <p className="text-sm font-mono font-medium" style={{ color: d.payload.fill }}>
        {formatCurrency(d.value, true)}
      </p>
    </div>
  )
}

export default function SpendingBreakdown() {
  const { state } = useApp()
  const data = groupByCategory(state.transactions)
  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="bg-[#07090a] border border-white/5 rounded-2xl p-5 h-full">
      <h2 className="font-bold text-white mb-0.5">Spending Breakdown</h2>
      <p className="text-xs text-slate-500 mb-5">By category</p>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No expense data</div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-5">
        
          <div className="relative w-40 h-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={66} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {data.map(entry => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Total</span>
              <span className="text-sm font-bold text-white mt-0.5">{formatCurrency(total, true)}</span>
            </div>
          </div>

          
          <div className="flex flex-col gap-2 w-full">
            {data.slice(0, 6).map(item => {
              const pct = ((item.value / total) * 100).toFixed(1)
              const color = CATEGORY_COLORS[item.name] || '#64748b'
              return (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                  <span className="text-xs text-slate-300 flex-1 truncate">{item.name}</span>
                  <span className="text-xs font-mono text-slate-400">{pct}%</span>
                  <div className="w-14 h-1 bg-[#1e2a3a] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}