import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the 'title' query parameter
    const { title } = req.query

    if (typeof title !== 'string') {
      return res.status(400).json({ error: 'Title must be a string' })
    }

    const dirPath = path.join(process.cwd(), 'src', 'data', 'writing')
    const filePath = path.join(dirPath, `${title}.md`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `File not found: ${title}` })
    }

    const content = fs.readFileSync(filePath, 'utf-8')

    // Return the HTML content
    res.status(200).json({ title, content })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'Failed to read or convert the Markdown file' })
  }
}
