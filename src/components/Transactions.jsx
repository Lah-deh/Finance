
import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/mockData'
import { X, Plus, Save } from 'lucide-react'

const EMPTY = { description: '', amount: '', category: 'Food & Dining', type: 'expense', date: new Date().toISOString().slice(0, 10) }

export default function TransactionModal({ transaction, onClose }) {
  const { dispatch } = useApp()
  const isEdit = !!transaction
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (transaction) setForm({ ...transaction, amount: String(transaction.amount) })
  }, [transaction])

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.description.trim()) e.description = 'Required'
    if (!form.amount || isNaN(+form.amount) || +form.amount <= 0) e.amount = 'Enter a valid amount'
    if (!form.date) e.date = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  function submit() {
    if (!validate()) return
    dispatch({
      type: isEdit ? 'EDIT_TRANSACTION' : 'ADD_TRANSACTION',
      payload: { id: isEdit ? transaction.id : Date.now(), ...form, amount: Math.round(+form.amount) },
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#07090a] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-semibold text-white">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>

        
        <div className="px-6 py-5 space-y-4">
          
          <div className="flex gap-2">
            {['expense', 'income'].map(t => (
              <button key={t} onClick={() => set('type', t)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all
                  ${form.type === t
                    ? t === 'income' ? 'bg-[#07090a]/15 text-[#29558f] border border-[#29558f]/30' : 'bg-[#ef0640]/15 text-[#ef0640] border border-[#ef0640]/30'
                    : 'bg-[#07090a] text-slate-400 border border-white/5 hover:border-white/15'}`}>
                {t}
              </button>
            ))}
          </div>

          
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1.5">Description</label>
            <input
              className={`w-full bg-[#07090a] border rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#4fffb0]/40 transition-colors ${errors.description ? 'border-[#ff4f7b]/50' : 'border-white/8'}`}
              placeholder="e.g. Monthly Salary"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
            {errors.description && <p className="text-xs text-[#ff4f7b] mt-1 font-mono">{errors.description}</p>}
          </div>

        
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1.5">Amount (₦)</label>
              <input
                type="number"
                className={`w-full bg-[#1a2332] border rounded-xl px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#4fffb0]/40 transition-colors ${errors.amount ? 'border-[#ff4f7b]/50' : 'border-white/8'}`}
                placeholder="0"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
              />
              {errors.amount && <p className="text-xs text-[#ff4f7b] mt-1 font-mono">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1.5">Date</label>
              <input
                type="date"
                className={`w-full bg-[#07090a] border rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#4fffb0]/40 transition-colors ${errors.date ? 'border-[#ff4f7b]/50' : 'border-white/8'}`}
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
              {errors.date && <p className="text-xs text-[#eb1349] mt-1 font-mono">{errors.date}</p>}
            </div>
          </div>

        
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1.5">Category</label>
            <select
              className="w-full bg-[#07090a] border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-[#4fffb0]/40 transition-colors"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#07090a]">{c}</option>)}
            </select>
          </div>
        </div>

        
        <div className="flex gap-3 px-6 py-4 border-t border-white/5">
          <button onClick={onClose} className="flex-1 bg-white/5 text-slate-300 border border-white/8 hover:bg-white/10 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={submit} className="flex-1 bg-[#29558f] text-[#080c14] text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1a3a5f] transition-colors flex items-center justify-center gap-2">
            {isEdit ? <><Save size={14} /> Save</> : <><Plus size={14} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  )
}