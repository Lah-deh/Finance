# Finance Dashboard UI

A clean, dark-themed finance dashboard built with React, Vite, and Tailwind CSS.

## Live Demo
https://finance-lake-kappa.vercel.app/

## Repository
https://github.com/Lah-deh/Finance

## Setup Instructions
npm install
npm run dev

## Approach
I used React with useReducer and Context API for global state management,
keeping all transactions, filters, and role selection in a single store.
Data persists across sessions via localStorage.

## Features
- **Dashboard** :Summary cards (balance, income, expenses, savings rate),
  area chart for balance trend, donut chart for spending breakdown,
  recent transactions list
- **Transactions** :Full table with search, filter by type/category,
  sort by date or amount, CSV export
- **Insights** : Top spending category, average monthly spend, savings rate,
  best month, month-over-month comparison, bar chart, category analysis
- **Role-Based UI** :Toggle between Admin (add/edit/delete transactions)
  and Viewer (read-only) from the navbar dropdown
- **Data Persistence** : Transactions saved to localStorage
- **Responsive** :Works on mobile, tablet, and desktop

## Tech Stack
- React
- Vite
- Tailwind CSS
- Recharts (charts)
- Lucide React (icons)

## State Management
Global state is managed with React's useReducer + Context API.
State includes: transactions array, active role, active page, and filter settings.
All transaction mutations (add/edit/delete) also sync to localStorage.
