import { useRouter } from 'next/router'
import * as React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { ExpenseCharts } from '~/components/PersonalFinances/ExpenseCharts'
import { ExpenseTable } from '~/components/PersonalFinances/ExpenseTable'

interface Expense {
  title: string
  amount: number
  date: string
  group: string
}

export default function PersonalFinancesVisualization() {
  const router = useRouter()
  const [expenses, setExpenses] = React.useState<Expense[]>([])
  const [selectedYear, setSelectedYear] = React.useState<string>('all')
  const [selectedMonth, setSelectedMonth] = React.useState<string>('all')

  // Load expenses from localStorage on component mount
  React.useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses')
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses))
    } else {
      // If no expenses are found, redirect back to upload page
      router.push('/projects/personal-finances')
    }
  }, [router])

  // Get unique years and months for the dropdowns
  const { years, monthsByYear } = React.useMemo(() => {
    const yearSet = new Set<string>()
    const monthMap = new Map<string, Set<string>>()

    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString()

      yearSet.add(year)

      if (!monthMap.has(year)) {
        monthMap.set(year, new Set())
      }
      monthMap.get(year)?.add(month)
    })

    // Sort years in descending order
    const sortedYears = Array.from(yearSet).sort(
      (a, b) => parseInt(b) - parseInt(a)
    )

    // Sort months for each year
    const sortedMonthsByYear = new Map<string, string[]>()
    monthMap.forEach((months, year) => {
      sortedMonthsByYear.set(
        year,
        Array.from(months).sort((a, b) => parseInt(a) - parseInt(b))
      )
    })

    return {
      years: sortedYears,
      monthsByYear: sortedMonthsByYear,
    }
  }, [expenses])

  // Filter expenses based on selected year and month
  const filteredExpenses = React.useMemo(() => {
    if (selectedYear === 'all') return expenses

    return expenses.filter((expense) => {
      const date = new Date(expense.date)
      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString()

      if (year !== selectedYear) return false
      if (selectedMonth !== 'all' && month !== selectedMonth) return false

      return true
    })
  }, [expenses, selectedYear, selectedMonth])

  // Reset month selection when year changes
  React.useEffect(() => {
    setSelectedMonth('all')
  }, [selectedYear])

  const handleBack = () => {
    // Clear the stored expenses when going back
    localStorage.removeItem('expenses')
    router.push('/projects/personal-finances')
  }

  return (
    <Detail.Container>
      <TitleBar
        backButton
        backButtonHref="/projects/personal-finances"
        title="Personal Finances Visualization"
      />
      <Detail.ContentContainer>
        <Detail.Header>
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back
          </button>
          <Detail.Title>Financial Overview</Detail.Title>
          <p className="text-tertiary">
            Analyze your expenses through interactive charts and detailed
            tables.
          </p>
        </Detail.Header>

        <div className="prose prose-quoteless prose-neutral dark:prose-invert">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm min-w-[120px]"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                disabled={selectedYear === 'all'}
                className={`px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm min-w-[140px] ${
                  selectedYear === 'all' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <option value="all">All Months</option>
                {selectedYear !== 'all' &&
                  monthsByYear.get(selectedYear)?.map((month) => (
                    <option key={month} value={month}>
                      {new Date(
                        parseInt(selectedYear),
                        parseInt(month) - 1
                      ).toLocaleDateString('default', { month: 'long' })}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <ExpenseCharts
              expenses={filteredExpenses}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </div>
          <ExpenseTable
            expenses={filteredExpenses}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
          />
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
