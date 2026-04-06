
import { createContext, useContext, useReducer } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/mockData'

const AppContext = createContext(null)
const STORAGE_KEY = 'finflow_txns'

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? JSON.parse(s) : INITIAL_TRANSACTIONS
  } catch { return INITIAL_TRANSACTIONS }
}

function save(txns) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txns))
}

const init = {
  transactions: load(),
  role: 'admin',          
  activePage: 'dashboard',
  filters: {
    search: '',
    type: 'all',       
    category: 'all',
    sortBy: 'date',   
    sortDir: 'desc',
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':    return { ...state, role: action.payload }
    case 'SET_PAGE':    return { ...state, activePage: action.payload }
    case 'SET_FILTER':  return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'RESET_FILTERS': return { ...state, filters: init.filters }

    case 'ADD_TRANSACTION': {
      const txns = [action.payload, ...state.transactions]
      save(txns)
      return { ...state, transactions: txns }
    }
    case 'EDIT_TRANSACTION': {
      const txns = state.transactions.map(t => t.id === action.payload.id ? action.payload : t)
      save(txns)
      return { ...state, transactions: txns }
    }
    case 'DELETE_TRANSACTION': {
      const txns = state.transactions.filter(t => t.id !== action.payload)
      save(txns)
      return { ...state, transactions: txns }
    }
    case 'RESET_DATA':
      localStorage.removeItem(STORAGE_KEY)
      return { ...state, transactions: INITIAL_TRANSACTIONS }

    default: return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, init)
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

export function useFilteredTransactions() {
  const { state: { transactions, filters } } = useApp()
  let r = [...transactions]
  if (filters.search) {
    const q = filters.search.toLowerCase()
    r = r.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
  }
  if (filters.type !== 'all')     r = r.filter(t => t.type === filters.type)
  if (filters.category !== 'all') r = r.filter(t => t.category === filters.category)
  r.sort((a, b) => {
    const dir = filters.sortDir === 'desc' ? -1 : 1
    if (filters.sortBy === 'date') return dir * (new Date(a.date) - new Date(b.date))
    return dir * (a.amount - b.amount)
  })
  return r
}


export function useSummary() {
  const { state: { transactions } } = useApp()
  const income  = transactions.filter(t => t.type === 'income').reduce((s, t)  => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return { totalIncome: income, totalExpense: expense, balance: income - expense }
}