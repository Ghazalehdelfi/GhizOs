import { useRouter } from 'next/router'
import * as React from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { CSVUploader } from '~/components/PersonalFinances/CSVUploader'

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
            I struggle managing budgets and tracking my expenses. I wanted a
            tool primarily for myself to gain a quick visual insight into how
            much has been spent and where. I am able to download a csv file of
            my latest credit card expenses through my bank. This tool allows me
            to achieve this goal while all the data is on my personal computer,
            the uploaded file is not stored anywhere and therefore is private
            and secure. I use LLMs to generate automatic labels for each expense
            but I provide a way to manually edit them if they don't seem
            correct.
          </p>

          <h2>How to Use</h2>
          <p>Upload your expenses CSV file with the following format:</p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            title,amount,date
            <br />
            Groceries,50.25,2024-03-26
            <br />
            Netflix Subscription,15.99,2024-03-25
          </pre>

          <div className="my-8">
            <CSVUploader onDataProcessed={handleDataProcessed} />
          </div>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
}
