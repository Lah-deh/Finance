
export function formatCurrency(amount, compact = false) {
  if (compact && amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`
  if (compact && amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`
  return new Intl.NumberFormat('en-NG', {
    style: 'currency', currency: 'NGN',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short',
  })
}


export function groupByMonth(transactions) {
  const map = {}
  transactions.forEach(t => {
    const key = t.date.slice(0, 7)
    if (!map[key]) map[key] = { key, income: 0, expense: 0 }
    if (t.type === 'income')  map[key].income  += t.amount
    if (t.type === 'expense') map[key].expense += t.amount
  })
  return Object.values(map)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(d => ({
      ...d,
      label: new Date(d.key + '-01').toLocaleDateString('en-NG', { month: 'short', year: '2-digit' }),
      balance: d.income - d.expense,
    }))
}
export function groupByCategory(transactions) {
  const map = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount
  })
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}