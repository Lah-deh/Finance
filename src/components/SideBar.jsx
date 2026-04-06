
import { useApp } from '../context/AppContext'
import { LayoutDashboard, ArrowLeftRight, Lightbulb, TrendingUp, ChevronRight } from 'lucide-react'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     Icon: Lightbulb       },
]

export default function Sidebar() {
  const { state, dispatch } = useApp()

  return (
    <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-60 bg-[#07090a] border-r border-white/5 px-4 py-6 z-20">
      
      <div className="flex items-center gap-2.5 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-[#29558f] flex items-center justify-center">
          <TrendingUp size={15} className="text-[#080c14]" strokeWidth={2.5} />
        </div>
        <span className="font-bold text-lg text-white tracking-tight">Finance</span>
      </div>

      
      <nav className="flex flex-col gap-1 flex-1">
        {NAV.map(({ id, label, Icon }) => {
          const active = state.activePage === id
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: 'SET_PAGE', payload: id })}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${active
                  ? 'bg-[#4fffb0]/10 text-[#29558f]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
              {active && <ChevronRight size={13} className="ml-auto opacity-50" />}
            </button>
          )
        })}
      </nav>

      
      <div className="px-2">
        <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-2 font-mono">Role</p>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium
          ${state.role === 'admin' ? 'bg-[#4fffb0]/10 text-[#29558f]' : 'bg-[#4fb8ff]/10 text-[#29558f]'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${state.role === 'admin' ? 'bg-[#29558f]' : 'bg-[#4fb8ff]'}`} />
          {state.role === 'admin' ? 'Admin' : 'Viewer'}
        </span>
      </div>
    </aside>
  )
}