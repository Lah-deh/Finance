
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useApp } from '../context/AppContext'
import { groupByMonth, formatCurrency } from '../Utilities/format'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a2332] border border-white/10 rounded-xl p-3 shadow-2xl min-w-40">
      <p className="text-xs font-mono text-slate-400 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-300 capitalize">{p.dataKey}</span>
          </span>
          <span className="font-mono font-medium" style={{ color: p.color }}>
            {formatCurrency(p.value, true)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function BalanceTrend() {
  const { state } = useApp()
  const data = groupByMonth(state.transactions)

  return (
    <div className="bg-[#07090a] border border-white/5 rounded-2xl p-5 h-full">
      <h2 className="font-bold text-white mb-0.5">Balance Trend</h2>
      <p className="text-xs text-slate-500 mb-5">Monthly income vs expenses</p>

      {data.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">No data</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4fffb0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4fffb0" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ff4f7b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ff4f7b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} axisLine={false} tickLine={false}
                tickFormatter={v => `₦${v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="income"  stroke="#4fffb0" strokeWidth={2} fill="url(#gIncome)"  dot={false} activeDot={{ r: 4, fill: '#4fffb0' }} />
              <Area type="monotone" dataKey="expense" stroke="#ff4f7b" strokeWidth={2} fill="url(#gExpense)" dot={false} activeDot={{ r: 4, fill: '#ff4f7b' }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-3">
            <span className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-3 h-0.5 rounded bg-[#29558f]" /> Income
            </span>
            <span className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-3 h-0.5 rounded bg-[#ef0640]" /> Expenses
            </span>
          </div>
        </>
      )}
    </div>
  )
}