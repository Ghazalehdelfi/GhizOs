import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    const prompt = `Given these unique expense titles:
    ${uniqueExpenses.map((exp: any) => `Title: ${exp.title}, Amount: $${exp.amount}`).join('\n')}

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
    console.log('Raw response:', response)

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
        throw new Error('Could not parse categories from response')
      }
    }

    console.log('Categories length:', categories.length)
    console.log('Unique titles length:', uniqueExpenses.length)

    if (!Array.isArray(categories)) {
      throw new Error('Response is not an array')
    }

    // If lengths don't match, pad or truncate the categories array
    if (categories.length !== uniqueExpenses.length) {
      console.warn('Category count mismatch. Adjusting array length.')
      if (categories.length < uniqueExpenses.length) {
        // Pad with 'Other' if we have fewer categories
        categories = [
          ...categories,
          ...Array(uniqueExpenses.length - categories.length).fill('Other'),
        ]
      } else {
        // Truncate if we have more categories
        categories = categories.slice(0, uniqueExpenses.length)
      }
    }

    // Create a map of title to category
    const titleToCategory = uniqueExpenses.reduce(
      (acc: { [key: string]: string }, exp: any, index: number) => {
        acc[exp.title] = categories[index]
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
