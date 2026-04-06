
import { useState } from 'react'
import { useApp, useSummary } from '../context/AppContext'
import { formatCurrency } from '../Utilities/format'
import { Shield, Eye, ChevronDown, TrendingUp, Menu, X, LayoutDashboard, ArrowLeftRight, Lightbulb, RotateCcw } from 'lucide-react'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight  },
  { id: 'insights',     label: 'Insights',     Icon: Lightbulb       },
]

export default function Navbar() {
  const { state, dispatch } = useApp()
  const { balance } = useSummary()
  const [menuOpen, setMenuOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-[#080c14]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 md:px-6 h-16 md:ml-60">

        
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-7 h-7 rounded-lg bg-[#29558f] flex items-center justify-center">
            <TrendingUp size={13} className="text-[#080c14]" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white">FinFlow</span>
        </div>

        
        <div className="hidden md:block">
          <h1 className="font-semibold text-white capitalize">{state.activePage}</h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Balance:{' '}
            <span className={balance >= 0 ? 'text-[#29558f]' : 'text-[#ef0640]'}>
              {formatCurrency(balance, true)}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          
          <div className="relative">
            <button
              onClick={() => setRoleOpen(o => !o)}
              className="flex items-center gap-2 bg-[#131a24] border border-white/8 hover:border-[#4fffb0]/30
                text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition-all"
            >
              {state.role === 'admin'
                ? <Shield size={13} className="text-[#29558f]" />
                : <Eye size={13} className="text-[#4fb8ff]" />}
              <span className="hidden sm:inline font-medium">
                {state.role === 'admin' ? 'Admin' : 'Viewer'}
              </span>
              <ChevronDown size={12} className={`transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
            </button>

            {roleOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-[#1a2332] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                {[
                  { id: 'admin',  label: 'Admin',  Icon: Shield, desc: 'Can add & edit' },
                  { id: 'viewer', label: 'Viewer', Icon: Eye,    desc: 'Read only'      },
                ].map(({ id, label, Icon, desc }) => (
                  <button
                    key={id}
                    onClick={() => { dispatch({ type: 'SET_ROLE', payload: id }); setRoleOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors
                      ${state.role === id ? 'bg-[#29558f]/10 text-[#29558f]' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
                  >
                    <Icon size={14} />
                    <div className="text-left">
                      <p className="font-medium">{label}</p>
                      <p className="text-[10px] opacity-60 font-mono">{desc}</p>
                    </div>
                    {state.role === id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#29558f]" />}
                  </button>
                ))}
                <div className="border-t border-white/5 p-2">
                  <button
                    onClick={() => { dispatch({ type: 'RESET_DATA' }); setRoleOpen(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-300 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <RotateCcw size={11} /> Reset sample data
                  </button>
                </div>
              </div>
            )}
          </div>

        
          <button
            className="md:hidden bg-[#131a24] border border-white/8 p-2 rounded-xl text-slate-400"
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

    
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0d1117] px-4 py-3 flex flex-col gap-1">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { dispatch({ type: 'SET_PAGE', payload: id }); setMenuOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
                ${state.activePage === id ? 'bg-[#29558f]/10 text-[#29558f]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}