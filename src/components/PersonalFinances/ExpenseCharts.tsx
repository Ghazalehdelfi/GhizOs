import * as React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface Expense {
  title: string
  amount: number
  date: string
  group: string
}

interface ExpenseChartsProps {
  expenses: Expense[]
  selectedYear: string
  selectedMonth: string
}

export function ExpenseCharts({
  expenses,
  selectedYear,
  selectedMonth,
}: ExpenseChartsProps) {
  // Calculate monthly expenses for the bar chart
  const monthlyExpenses = React.useMemo(() => {
    const monthlyData = new Map<string, number>()
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    // Initialize all months with 0
    months.forEach((month) => {
      monthlyData.set(month, 0)
    })

    // Sum up expenses for each month
    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const monthName = date.toLocaleDateString('default', { month: 'long' })
      const currentAmount = monthlyData.get(monthName) || 0
      monthlyData.set(monthName, currentAmount + expense.amount)
    })

    return {
      labels: months,
      datasets: [
        {
          label: 'Monthly Expenses',
          data: months.map((month) => monthlyData.get(month) || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1,
        },
      ],
    }
  }, [expenses])

  // Calculate category expenses for the pie chart
  const categoryExpenses = React.useMemo(() => {
    const categoryData = new Map<string, number>()
    let total = 0

    expenses.forEach((expense) => {
      const currentAmount = categoryData.get(expense.group) || 0
      categoryData.set(expense.group, currentAmount + expense.amount)
      total += expense.amount
    })

    return {
      labels: Array.from(categoryData.keys()),
      datasets: [
        {
          data: Array.from(categoryData.values()),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 99, 255, 0.5)',
            'rgba(54, 162, 255, 0.5)',
            'rgba(255, 206, 255, 0.5)',
            'rgba(75, 192, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 255, 1)',
            'rgba(54, 162, 255, 1)',
            'rgba(255, 206, 255, 1)',
            'rgba(75, 192, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
      total,
    }
  }, [expenses])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text:
          selectedYear === 'all'
            ? 'Monthly Expenses Overview'
            : selectedMonth === 'all'
              ? `Monthly Expenses for ${selectedYear}`
              : `Expenses for ${new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1).toLocaleDateString('default', { month: 'long' })} ${selectedYear}`,
        font: {
          size: 24,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `$${value.toLocaleString()}`,
        },
      },
    },
  }

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          boxWidth: 12,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text:
          selectedYear === 'all'
            ? 'Expense Distribution by Category'
            : selectedMonth === 'all'
              ? `Category Distribution for ${selectedYear}`
              : `Category Distribution for ${new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1).toLocaleDateString('default', { month: 'long' })} ${selectedYear}`,
        font: {
          size: 24,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw
            const percentage = ((value / categoryExpenses.total) * 100).toFixed(
              1
            )
            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`
          },
        },
      },
    },
  }

  return (
    <div className="space-y-8">
      <div className="h-[500px]">
        <Bar options={chartOptions} data={monthlyExpenses} />
      </div>
      <div className="h-[500px]">
        <Pie options={pieChartOptions} data={categoryExpenses} />
      </div>
    </div>
  )
}
