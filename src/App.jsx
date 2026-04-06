
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Insights from './pages/Insights'

function Pages() {
  const { state } = useApp()
  if (state.activePage === 'transactions') return <Transactions />
  if (state.activePage === 'insights')     return <Insights />
  return <Dashboard />
}

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <Pages />
      </Layout>
    </AppProvider>
  )
}