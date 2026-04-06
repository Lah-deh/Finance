
import { useState } from 'react'
import { useApp, useFilteredTransactions } from '../context/AppContext'
import { formatCurrency, formatDate } from '../Utilities/format'
import { CATEGORY_COLORS } from '../data/mockData'
import { Pencil, Trash2, AlertCircle } from 'lucide-react'
import TransactionModal from './Transactions'

export default function TransactionTable() {
  const { state, dispatch } = useApp()
  const transactions = useFilteredTransactions()
  const isAdmin = state.role === 'admin'
  const [editTxn, setEditTxn] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  if (transactions.length === 0) {
    return (
      <div className="bg-[#07090a] border border-white/5 rounded-2xl flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle size={32} className="text-slate-600 mb-3" />
        <p className="text-slate-400 text-sm">No transactions found</p>
        <p className="text-slate-600 font-mono text-xs mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <>
      
      <div className="hidden md:block bg-[#07090a] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Date', 'Description', 'Category', 'Type', 'Amount', ...(isAdmin ? [''] : [])].map(h => (
                <th key={h} className={`px-5 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-mono ${h === 'Amount' || h === '' ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => {
              const color = CATEGORY_COLORS[txn.category] || '#64748b'
              return (
                <tr key={txn.id} className="border-b border-white/3 hover:bg-white/2 transition-colors group">
                  <td className="px-5 py-3.5 text-xs font-mono text-slate-400 whitespace-nowrap">{formatDate(txn.date)}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-200 max-w-50 truncate">{txn.description}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono"
                      style={{ background: `${color}18`, color }}>
                      {txn.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium
                      ${txn.type === 'income' ? 'bg-[#29558f]/10 text-[#29558f]' : 'bg-[#ef0640]/10 text-[#ef0640]'}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className={`px-5 py-3.5 text-right text-sm font-mono font-medium ${txn.type === 'income' ? 'text-[#29558f]' : 'text-[#ef0640]'}`}>
                    {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditTxn(txn)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#29558f]/10 hover:text-[#29558f] flex items-center justify-center text-slate-400 transition-colors">
                          <Pencil size={12} />
                        </button>
                        <button onClick={() => setDeleteId(txn.id)} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#ef0640]/10 hover:text-[#ef0640] flex items-center justify-center text-slate-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      
      <div className="md:hidden flex flex-col gap-3">
        {transactions.map(txn => {
          const color = CATEGORY_COLORS[txn.category] || '#64748b'
          return (
            <div key={txn.id} className="bg-[#131a24] border border-white/5 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                style={{ background: `${color}18`, color }}>
                {txn.category.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 truncate">{txn.description}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">{formatDate(txn.date)} · {txn.category}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-mono font-medium ${txn.type === 'income' ? 'text-[#29558f]' : 'text-[#ef0640]'}`}>
                  {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, true)}
                </p>
                {isAdmin && (
                  <div className="flex gap-1 mt-1 justify-end">
                    <button onClick={() => setEditTxn(txn)} className="text-slate-500 hover:text-[#29558f] p-1 transition-colors"><Pencil size={11} /></button>
                    <button onClick={() => setDeleteId(txn.id)} className="text-slate-500 hover:text-[#ef0640] p-1 transition-colors"><Trash2 size={11} /></button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

    
      {editTxn && <TransactionModal transaction={editTxn} onClose={() => setEditTxn(null)} />}

      
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="bg-[#131a24] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-[#ff4f7b]/10 flex items-center justify-center mb-4">
              <Trash2 size={20} className="text-[#ff4f7b]" />
            </div>
            <h3 className="font-semibold text-white mb-1">Delete Transaction?</h3>
            <p className="text-sm text-slate-400 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-white/5 border border-white/8 text-slate-300 text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button onClick={() => { dispatch({ type: 'DELETE_TRANSACTION', payload: deleteId }); setDeleteId(null) }}
                className="flex-1 bg-[#ff4f7b]/15 text-[#ff4f7b] border border-[#ff4f7b]/30 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#ff4f7b]/25 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}