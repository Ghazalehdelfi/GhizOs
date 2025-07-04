import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Process expenses in batches to avoid API limits
async function categorizeBatch(expenses: any[], batchSize: number = 10) {
  const results: string[] = []
  
  for (let i = 0; i < expenses.length; i += batchSize) {
    const batch = expenses.slice(i, i + batchSize)
    
    const prompt = `Given these unique expense titles:
    ${batch.map((exp: any) => `Title: ${exp.title}, Amount: $${exp.amount}`).join('\n')}

    Please categorize each expense into one of these categories:
    - Food
    - Transportation
    - Housing
    - Utilities
    - Entertainment
    - Shopping
    - Healthcare
    - Education
    - Travel
    - Other

    IMPORTANT: Respond with ONLY a JSON array of categories in the exact same order as the expenses, with no additional text or explanation. For example:
    ["Food","Transportation","Other"]`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a financial categorization assistant. Your task is to categorize expenses into predefined categories. Respond with ONLY a JSON array of categories, with no additional text or explanation.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    })

    const response = completion.choices[0].message.content?.trim() || '[]'
    console.log(`Batch ${Math.floor(i / batchSize) + 1} raw response:`, response)

    // Clean up the response to ensure it's valid JSON
    const cleanResponse = response
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    let categories: string[]
    try {
      categories = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      // If parsing fails, try to extract array-like content
      const arrayMatch = cleanResponse.match(/\[(.*?)\]/)
      if (arrayMatch) {
        categories = arrayMatch[1]
          .split(',')
          .map((cat) => cat.trim().replace(/"/g, ''))
      } else {
        // If all else fails, assign 'Other' to all items in this batch
        categories = Array(batch.length).fill('Other')
      }
    }

    // Ensure we have the right number of categories for this batch
    if (categories.length !== batch.length) {
      console.warn(`Batch ${Math.floor(i / batchSize) + 1} category count mismatch. Adjusting array length.`)
      if (categories.length < batch.length) {
        // Pad with 'Other' if we have fewer categories
        categories = [
          ...categories,
          ...Array(batch.length - categories.length).fill('Other'),
        ]
      } else {
        // Truncate if we have more categories
        categories = categories.slice(0, batch.length)
      }
    }

    results.push(...categories)
    
    // Add a small delay between batches to avoid rate limiting
    if (i + batchSize < expenses.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  return results
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { expenses } = req.body

    // Get unique titles with their first occurrence
    const uniqueTitles = expenses.reduce(
      (acc: { [key: string]: { title: string; amount: number } }, exp: any) => {
        if (!acc[exp.title]) {
          acc[exp.title] = exp
        }
        return acc
      },
      {}
    )

    const uniqueExpenses = Object.values(uniqueTitles)
    console.log('Total unique expenses to categorize:', uniqueExpenses.length)

    // Process in batches of 10 (adjust this number based on your needs)
    const batchSize = 10
    const categories = await categorizeBatch(uniqueExpenses, batchSize)

    console.log('Categories length:', categories.length)
    console.log('Unique titles length:', uniqueExpenses.length)

    if (!Array.isArray(categories)) {
      throw new Error('Response is not an array')
    }

    // Create a map of title to category
    const titleToCategory = uniqueExpenses.reduce(
      (acc: { [key: string]: string }, exp: any, index: number) => {
        acc[exp.title] = categories[index] || 'Other'
        return acc
      },
      {}
    )

    // Apply categories to all expenses based on their titles
    const allCategories = expenses.map(
      (exp: any) => titleToCategory[exp.title] || 'Other'
    )

    return res.status(200).json({ categories: allCategories })
  } catch (error) {
    console.error('Error categorizing expenses:', error)
    return res.status(500).json({ message: 'Failed to categorize expenses' })
  }
}
