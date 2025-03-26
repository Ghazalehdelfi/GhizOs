import * as React from 'react'
import { Upload } from 'react-feather'

interface Expense {
  title: string
  amount: number
  date: string
  group: string
}

interface CSVUploaderProps {
  onDataProcessed: (data: Expense[]) => void
}

export function CSVUploader({ onDataProcessed }: CSVUploaderProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const rows = text.split('\n')

      const expenses: Expense[] = rows
        .slice(1)
        .filter((row) => row.trim())
        .map((row) => {
          const values = row.split(',').map((value) => value.trim())
          return {
            title: values[0],
            amount: parseFloat(values[1]),
            date: values[2],
            group: values[3],
          }
        })
        .filter((expense) => !isNaN(expense.amount))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      onDataProcessed(expenses)
    }

    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg dark:border-gray-700">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
        id="csv-upload"
      />
      <label
        htmlFor="csv-upload"
        className="flex flex-col items-center cursor-pointer"
      >
        <Upload className="w-8 h-8 mb-2 text-gray-500" />
        <span className="text-sm text-gray-500">
          Upload your expenses CSV file
        </span>
        <span className="text-xs text-gray-400 mt-1">
          Format: title,amount,date,group
        </span>
      </label>
    </div>
  )
}
