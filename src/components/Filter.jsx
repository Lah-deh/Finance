
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/mockData'
import { Search, X } from 'lucide-react'

export default function FilterBar() {
  const { state, dispatch } = useApp()
  const { filters } = state
  const set = patch => dispatch({ type: 'SET_FILTER', payload: patch })
  const hasFilters = filters.search || filters.type !== 'all' || filters.category !== 'all'

  const inputCls = "bg-[#07090a] border border-white/8 text-slate-200 text-sm rounded-xl px-3 py-2 placeholder:text-slate-600 focus:outline-none focus:border-[#4fffb0]/40 transition-colors w-full"

  return (
    <div className="flex flex-col sm:flex-row gap-3">
    
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input
          className={`${inputCls} pl-9`}
          placeholder="Search transactions..."
          value={filters.search}
          onChange={e => set({ search: e.target.value })}
        />
        {filters.search && (
          <button onClick={() => set({ search: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
            <X size={13} />
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        
        <div className="flex bg-[#07090a] border border-white/8 rounded-xl overflow-hidden">
          {['all', 'income', 'expense'].map(t => (
            <button key={t} onClick={() => set({ type: t })}
              className={`px-3 py-2 text-xs font-mono capitalize transition-colors
                ${filters.type === t
                  ? t === 'income' ? 'bg-[#29558f]/15 text-[#29558f]'
                  : t === 'expense' ? 'bg-[#ef0640]/15 text-[#ef0640]'
                  : 'bg-white/8 text-white'
                  : 'text-slate-500 hover:text-slate-300'}`}>
              {t}
            </button>
          ))}
        </div>

        
        <select className={`${inputCls} w-auto min-w-35 text-xs font-mono`}
          value={filters.category} onChange={e => set({ category: e.target.value })}>
          <option value="all" className="bg-[#1a2332]">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a2332]">{c}</option>)}
        </select>

        
        <select className={`${inputCls} w-auto min-w-30 text-xs font-mono`}
          value={`${filters.sortBy}-${filters.sortDir}`}
          onChange={e => { const [sortBy, sortDir] = e.target.value.split('-'); set({ sortBy, sortDir }) }}>
          <option value="date-desc"   className="bg-[#1a2332]">Date ↓</option>
          <option value="date-asc"    className="bg-[#1a2332]">Date ↑</option>
          <option value="amount-desc" className="bg-[#1a2332]">Amount ↓</option>
          <option value="amount-asc"  className="bg-[#1a2332]">Amount ↑</option>
        </select>

        {hasFilters && (
          <button onClick={() => dispatch({ type: 'RESET_FILTERS' })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#ff4f7b]/10 text-[#ff4f7b] text-xs font-mono hover:bg-[#ff4f7b]/20 transition-colors">
            <X size={11} /> Clear
          </button>
        )}
      </div>
    </div>
  )
}