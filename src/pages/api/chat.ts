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
    // const response = await fetch(
    //   'https://a2a-host-agent-695627813996.us-central1.run.app',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       method: 'tasks/send',
    //       params: {
    //         id: crypto.randomUUID(),
    //         sessionId: req.body.sessionId,
    //         message: {
    //           role: 'user',
    //           parts: [{ type: 'text', text: req.body.message }],
    //         },
    //         historyLength: null,
    //         metadata: null,
    //       },
    //     }),
    //   }
    // )

    // if (!response.ok) {
    //   throw new Error(`A2A server responded with status: ${response.status}`)
    // }
    // const data = await response.json()
    // console.log('Received response from A2A server:', data)

    // if (!data || data.result.history.length === 0) {
    //   throw new Error('Invalid response format from A2A server')
    // }

    res.status(200).json({
      agent_response:
        'The agents are currently inactive! If you are interested in how the system works, please refer to my blog post for a video demo! https://delfig.dev/writing/SecretaryAgent',
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    res.status(500).json({
      message: 'Error communicating with A2A server',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
