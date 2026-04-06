
import { useApp } from '../context/AppContext'
import { formatCurrency, formatShortDate } from '../Utilities/format'
import { CATEGORY_COLORS } from '../data/mockData'
import { ArrowUpRight } from 'lucide-react'

export default function RecentTransactions() {
  const { state, dispatch } = useApp()
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  return (
    <div className="bg-[#07090a] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-white">Recent Activity</h2>
          <p className="text-xs text-slate-500 mt-0.5">Latest transactions</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'transactions' })}
          className="flex items-center gap-1 text-xs font-mono text-[#29558f] hover:opacity-75 transition-opacity"
        >
          View all <ArrowUpRight size={11} />
        </button>
      </div>

      {recent.length === 0 ? (
        <p className="text-center py-8 text-slate-500 text-sm">No transactions yet</p>
      ) : (
        <div className="flex flex-col gap-1">
          {recent.map(txn => {
            const color = CATEGORY_COLORS[txn.category] || '#64748b'
            return (
              <div key={txn.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${color}18`, color }}>
                  {txn.category.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 truncate">{txn.description}</p>
                  <p className="text-[10px] font-mono text-slate-500">{formatShortDate(txn.date)} · {txn.category}</p>
                </div>
                <span className={`text-sm font-mono font-medium shrink-0 ${txn.type === 'income' ? 'text-[#29558f]' : 'text-[#ef0640]'}`}>
                  {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, true)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}