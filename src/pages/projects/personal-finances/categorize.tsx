import * as React from 'react'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { useRouter } from 'next/router'

interface Expense {
  title: string
  amount: number
  date: string
  group?: string
}

interface CategorizedExpense extends Expense {
  suggestedGroup: string
  isConfirmed: boolean
}

export default function PersonalFinancesCategorize() {
  const router = useRouter()
  const [expenses, setExpenses] = React.useState<CategorizedExpense[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Load expenses and get category suggestions on component mount
  React.useEffect(() => {
    const loadAndCategorizeExpenses = async () => {
      const storedExpenses = localStorage.getItem('expenses')
      if (!storedExpenses) {
        router.push('/projects/personal-finances')
        return
      }

      try {
        const parsedExpenses = JSON.parse(storedExpenses)

        // Get category suggestions for all expenses in one call
        const response = await fetch('/api/categorize-expense', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            expenses: parsedExpenses,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to get category suggestions')
        }

        const { categories } = await response.json()

        // Map the categories to the expenses
        const categorizedExpenses = parsedExpenses.map(
          (expense: Expense, index: number) => ({
            ...expense,
            suggestedGroup: categories[index] || 'Uncategorized',
            isConfirmed: false,
          })
        )

        setExpenses(categorizedExpenses)
      } catch (error) {
        console.error('Error loading expenses:', error)
        setError('Failed to load expenses')
      } finally {
        setIsLoading(false)
      }
    }

    loadAndCategorizeExpenses()
  }, [router])

  const handleCategoryChange = (index: number, newCategory: string) => {
    setExpenses((prev) =>
      prev.map((expense, i) =>
        i === index
          ? { ...expense, suggestedGroup: newCategory, isConfirmed: true }
          : expense
      )
    )
  }

  const handleContinue = () => {
    // Store the categorized expenses and navigate to visualization
    const processedExpenses = expenses.map(
      ({ title, amount, date, suggestedGroup }) => ({
        title,
        amount,
        date,
        group: suggestedGroup,
      })
    )
    localStorage.setItem('expenses', JSON.stringify(processedExpenses))
    router.push('/projects/personal-finances/visualization')
  }

  const handleBack = () => {
    localStorage.removeItem('expenses')
    router.push('/projects/personal-finances')
  }

  if (isLoading) {
    return (
      <Detail.Container>
        <TitleBar
          backButton
          backButtonHref="/projects/personal-finances"
          title="Categorizing Expenses"
        />
        <Detail.ContentContainer>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Analyzing your expenses and suggesting categories...
              </p>
            </div>
          </div>
        </Detail.ContentContainer>
      </Detail.Container>
    )
  }

  if (error) {
    return (
      <Detail.Container>
        <TitleBar
          backButton
          backButtonHref="/projects/personal-finances"
          title="Error"
        />
        <Detail.ContentContainer>
          <div className="text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        </Detail.ContentContainer>
      </Detail.Container>
    )
  }

  return (
    <Detail.Container>
      <TitleBar
        backButton
        backButtonHref="/projects/personal-finances"
        title="Categorize Expenses"
      />
      <Detail.ContentContainer>
        <Detail.Header>
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back
          </button>
          <Detail.Title>Categorize Your Expenses</Detail.Title>
          <p className="text-tertiary">
            Review and adjust the suggested categories for your expenses.
          </p>
        </Detail.Header>

        <div className="prose prose-quoteless prose-neutral dark:prose-invert">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {expenses.map((expense, index) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={expense.suggestedGroup}
                        onChange={(e) =>
                          handleCategoryChange(index, e.target.value)
                        }
                        className={`px-2 py-1 border rounded-md text-sm ${
                          expense.isConfirmed
                            ? 'border-green-500 dark:border-green-400'
                            : 'border-gray-300 dark:border-gray-700'
                        } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                      >
                        <option value="Food">Food</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Housing">Housing</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Travel">Travel</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleContinue}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Continue to Visualization
            </button>
          </div>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
