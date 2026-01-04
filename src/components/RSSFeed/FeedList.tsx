'use client'

import { useEffect, useState } from 'react'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { LoadingSpinner } from '~/components/LoadingSpinner'

export interface FeedItem {
  title: string
  link: string
  pubDate: string
  description: string
  source: string
  sourceUrl: string
}

export const FeedList = React.memo(() => {
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollContainerRef, setScrollContainerRef] = useState(null)
  const [hiddenSources, setHiddenSources] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchFeeds() {
      try {
        const response = await fetch('/api/rss-feed')

        if (!response.ok) {
          throw new Error('Failed to fetch feeds')
        }

        const data = await response.json()
        setItems(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load feeds. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchFeeds()
  }, [])

  // Get unique sources from items
  const uniqueSources = Array.from(
    new Set(items.map((item) => item.source))
  ).sort()

  // Filter items based on hidden sources
  const filteredItems = items.filter((item) => !hiddenSources.has(item.source))

  const toggleSourceVisibility = (source: string) => {
    setHiddenSources((prev) => {
      const newHidden = new Set(prev)
      if (newHidden.has(source)) {
        newHidden.delete(source)
      } else {
        newHidden.add(source)
      }
      return newHidden
    })
  }

  return (
    <ListContainer onRef={setScrollContainerRef}>
      <TitleBar scrollContainerRef={scrollContainerRef} title="RSS Feed" />

      <div className="lg:space-y-1 lg:p-3">
        {/* Source Filter */}
        {!loading && !error && uniqueSources.length > 0 && (
          <div className="sticky top-0 z-10 mb-4 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
            <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
              SOURCES
            </p>
            <div className="flex flex-wrap gap-2">
              {uniqueSources.map((source) => (
                <button
                  key={source}
                  onClick={() => toggleSourceVisibility(source)}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    hiddenSources.has(source)
                      ? 'bg-gray-100 text-gray-500 line-through dark:bg-gray-800 dark:text-gray-400'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
            {hiddenSources.size > 0 && (
              <button
                onClick={() => setHiddenSources(new Set())}
                className="mt-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Show all
              </button>
            )}
          </div>
        )}

        {loading && <LoadingSpinner />}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && filteredItems.length === 0 && (
          <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
            <p>
              {items.length === 0
                ? 'No recent posts found from the feeds.'
                : 'No posts match the selected sources.'}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredItems.map((item, idx) => (
            <article
              key={`${item.sourceUrl}-${item.link}-${idx}`}
              className="rounded-lg border border-gray-200 p-4 transition hover:shadow-md dark:border-gray-800 dark:hover:shadow-lg"
            >
              <h3 className="mb-2 text-lg font-semibold">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
                >
                  {item.title}
                </a>
              </h3>

              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <time dateTime={item.pubDate}>
                  {new Date(item.pubDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
                <span>•</span>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {item.source}
                </a>
              </div>

              {item.description && (
                <p className="line-clamp-3 text-sm text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>
              )}
            </article>
          ))}
      </div>
    </ListContainer>
  )
})
