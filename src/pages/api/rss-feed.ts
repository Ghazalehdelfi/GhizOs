import { NextApiRequest, NextApiResponse } from 'next'

import { RSS_FEEDS } from '~/config/rss'

export interface FeedItem {
  title: string
  link: string
  pubDate: string
  description: string
  source: string
  sourceUrl: string
}

function parseRSSFeed(xml: string, title: string, url: string): FeedItem[] {
  const items: FeedItem[] = []

  try {
    // Parse items from RSS
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1]

      // Extract fields using regex
      const titleMatch = itemXml.match(/<title>([^<]+)<\/title>/)
      const linkMatch = itemXml.match(/<link>([^<]+)<\/link>/)
      const pubDateMatch = itemXml.match(/<pubDate>([^<]+)<\/pubDate>/)
      const descriptionMatch = itemXml.match(
        /<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\/description>/
      )

      if (titleMatch && linkMatch && pubDateMatch) {
        // Clean up CDATA or plain text description
        let description = ''
        if (descriptionMatch) {
          description = (descriptionMatch[1] || descriptionMatch[2] || '')
            .replace(/<[^>]+>/g, '') // Remove HTML tags
            .substring(0, 200) // Limit length
        }

        items.push({
          title: titleMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>'),
          link: linkMatch[1],
          pubDate: pubDateMatch[1],
          description,
          source: title,
          sourceUrl: url,
        })
      }
    }
  } catch (error) {
    console.error(`Error parsing feed from ${title}:`, error)
  }

  return items
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const feedItems: FeedItem[] = []

    // Fetch all feeds in parallel
    const promises = RSS_FEEDS.map(async (feed) => {
      try {
        const response = await fetch(feed.url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; RSS Reader; +https://example.com)',
          },
        })

        if (!response.ok) {
          console.error(`Failed to fetch ${feed.title}: ${response.status}`)
          return []
        }

        const xml = await response.text()
        return parseRSSFeed(xml, feed.title, feed.url)
      } catch (error) {
        console.error(`Error fetching feed from ${feed.title}:`, error)
        return []
      }
    })

    const results = await Promise.all(promises)
    feedItems.push(...results.flat())

    // Filter posts from last year and sort by date
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const recentItems = feedItems
      .filter((item) => {
        try {
          return new Date(item.pubDate) >= oneYearAgo
        } catch {
          return false
        }
      })
      .sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      )

    res.status(200).json(recentItems)
  } catch (error) {
    console.error('Error in RSS feed handler:', error)
    res.status(500).json({ error: 'Failed to fetch feeds' })
  }
}
