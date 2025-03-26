import * as React from 'react'
import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { CSVUploader } from '~/components/PersonalFinances/CSVUploader'
import { useRouter } from 'next/router'

interface Expense {
  title: string
  amount: number
  date: string
  group: string
}

export default function PersonalFinances() {
  const router = useRouter()

  const handleDataProcessed = (expenses: Expense[]) => {
    // Store the expenses in localStorage for the next page
    localStorage.setItem('expenses', JSON.stringify(expenses))
    // Navigate to the categorization page
    router.push('/projects/personal-finances/categorize')
  }

  return (
    <Detail.Container>
      <TitleBar
        backButton
        backButtonHref="/projects"
        title="Personal Finances"
      />
      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title>Personal Finances</Detail.Title>
          <p className="text-tertiary">
            A personal finance management application that helps track expenses,
            manage budgets, and visualize financial data.
          </p>
        </Detail.Header>

        <div className="prose prose-quoteless prose-neutral dark:prose-invert">
          <p>
            This project is a personal finance management application that helps
            users track their expenses, manage budgets, and visualize their
            financial data. The application provides features such as:
          </p>
          <ul>
            <li>Expense tracking and categorization</li>
            <li>Budget planning and monitoring</li>
            <li>Financial data visualization</li>
            <li>Monthly and yearly reports</li>
            <li>Investment portfolio tracking</li>
          </ul>

          <h2>How to Use</h2>
          <p>Upload your expenses CSV file with the following format:</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            title,amount,date,group Groceries,50.25,2024-03-26,Food Netflix
            Subscription,15.99,2024-03-25,Entertainment
          </pre>

          <div className="my-8">
            <CSVUploader onDataProcessed={handleDataProcessed} />
          </div>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
