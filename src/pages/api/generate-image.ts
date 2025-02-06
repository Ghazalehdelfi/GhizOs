import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env.local
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  try {
    const imageResponse = await openai.images.generate({
      prompt: `In children's book illustration style, ${prompt}`,
      n: 1,
      size: '512x512',
    })

    const imageUrl = imageResponse.data[0]?.url

    if (!imageUrl) {
      return res.status(500).json({ error: 'Failed to generate image' })
    }

    res.status(200).json({ imageUrl })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate image' })
  }
}
