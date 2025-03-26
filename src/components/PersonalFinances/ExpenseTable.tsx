import * as React from 'react'

interface Expense {
  title: string
  amount: number
  date: string
  group: string
}

interface ExpenseTableProps {
  expenses: Expense[]
  selectedYear: string
  selectedMonth: string
}

type SortField = 'date' | 'title' | 'group' | 'amount'
type SortOrder = 'asc' | 'desc'

export function ExpenseTable({
  expenses,
  selectedYear,
  selectedMonth,
}: ExpenseTableProps) {
  const [sortField, setSortField] = React.useState<SortField>('date')
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc')

  // Calculate total for filtered expenses
  const total = React.useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  // Sort expenses based on selected field and order
  const sortedExpenses = React.useMemo(() => {
    return [...expenses].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'group':
          comparison = a.group.localeCompare(b.group)
          break
        case 'amount':
          comparison = a.amount - b.amount
          break
        default:
          comparison = 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })
  }, [expenses, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="ml-1">↕</span>
    return sortOrder === 'asc' ? (
      <span className="ml-1">↑</span>
    ) : (
      <span className="ml-1">↓</span>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {selectedYear === 'all'
            ? 'List of All Expenses'
            : selectedMonth === 'all'
              ? `Detailed Expenses for ${selectedYear}`
              : `Detailed Expenses for ${new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1).toLocaleDateString('default', { month: 'long' })} ${selectedYear}`}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('date')}
              >
                Date <SortIcon field="date" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('title')}
              >
                Title <SortIcon field="title" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('group')}
              >
                Category <SortIcon field="group" />
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSort('amount')}
              >
                Amount <SortIcon field="amount" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedExpenses.map((expense, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {expense.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {expense.group}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                  ${expense.amount.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 dark:bg-gray-800 font-semibold">
              <td
                colSpan={3}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
              >
                Total
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                ${total.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
