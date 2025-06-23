import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    console.log('Sending request to A2A server:', req.body)
    const response = await fetch('http://localhost:10000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'tasks/send',
        params: {
            id: crypto.randomUUID(),
            sessionId: req.body.sessionId,
            message: {
            role: 'user',
            parts: [{ type: 'text', text: req.body.message }]
            },
            historyLength: null,
            metadata: null
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`A2A server responded with status: ${response.status}`)
    }
    const data = await response.json()
    console.log('Received response from A2A server:', data)

    if (!data || data.result.history.length === 0) {
      throw new Error('Invalid response format from A2A server')
    }

    res.status(200).json({agent_response: data.result.history[data.result.history.length - 1].parts[0].text})
  } catch (error) {
    console.error('Error in chat API:', error)
    res.status(500).json({ 
      message: 'Error communicating with A2A server',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 