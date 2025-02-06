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
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a children’s book writer. Write an approximately 300-word story with the prompt provided by the user. At the end of each paragraph, summarize the paragraph in a sentence that can be used as a prompt for an image generator. Format each paragraph and summary like so: paragraph (summary: insert summary)',
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
