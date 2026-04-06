
import { useState } from 'react'
import { useApp, useFilteredTransactions } from '../context/AppContext'
import FilterBar from '../components/Filter'
import TransactionTable from '../components/TransactionTable'
import TransactionModal from '../components/Transactions'
import { Plus, Download } from 'lucide-react'

function exportCSV(transactions) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (NGN)']
  const rows = transactions.map(t => [t.date, `"${t.description}"`, t.category, t.type, t.amount].join(','))
  const csv = [headers.join(','), ...rows].join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: 'transactions.csv',
  })
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function Transactions() {
  const { state } = useApp()
  const filtered = useFilteredTransactions()
  const isAdmin = state.role === 'admin'
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
    
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-xl text-white">Transactions</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCSV(filtered)}
            className="flex items-center gap-2 bg-white/5 text-slate-300 border border-white/8 hover:bg-white/10 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            <Download size={13} /> Export CSV
          </button>
          {isAdmin && (
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#29558f] text-[#080c14] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#2dd68a] transition-colors">
              <Plus size={14} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      <FilterBar />
      <TransactionTable />

      {showModal && <TransactionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}