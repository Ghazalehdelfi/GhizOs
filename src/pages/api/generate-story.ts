import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

interface StoryRequest extends NextApiRequest {
  body: {
    prompt: string
  }
}

export default async function handler(req: StoryRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { prompt } = req.body

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are a children's book writer. Your task is to write a 500-word, 5-paragraph children's story based on the given prompt.
            
            **FORMAT RULES (STRICTLY FOLLOW):**
            - Each paragraph must be followed by a summary, prefixed exactly as: **(Summary: [summary text])**
            - No extra spaces, no blank lines before or after the summary.
            - After the summary of one paragrah and the start of next paragrah there must be exactly **two new lines (\n\n)**
            - Example format:
            
              "Once upon a time, a little cat named Whiskers wanted to fly. (Summary: A cat named Whiskers wants to fly)\n\n
              Whiskers tried different ways to fly, but he couldn't. (Summary: a cat tries to fly and fails)"
            
            Now, generate the story with these exact rules.`,
        },
        {
          role: 'user',
          content: `Write the story of ${prompt}`,
        },
      ],
    })

    const story = response.choices[0]?.message?.content

    if (!story) {
      return res.status(500).json({ error: 'Failed to generate story' })
    }

    res.status(200).json({ story })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to generate story' })
  }
}
