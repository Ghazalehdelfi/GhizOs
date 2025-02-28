import fs from 'fs'
import { useRouter } from 'next/router'
import path from 'path'
import * as React from 'react'
import { useEffect, useState } from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'

import { TitleBar } from '../ListDetail/TitleBar'
import { PostListItem } from './PostListItem'

export const WritingContext = React.createContext({
  filter: 'published',
  setFilter: (filter: string) => {},
})

export function PostsList() {
  const router = useRouter()
  const [filter, setFilter] = React.useState('published')
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)
  const [posts, setPosts] = useState<string[]>([])

  useEffect(() => {
    // Fetch the file list from the API
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/listFiles')
        const data: any = await response.json()
        setPosts(data.files)
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }

    fetchFiles()
  }, [])

  const defaultContextValue = {
    filter,
    setFilter,
  }

  return (
    <WritingContext.Provider value={defaultContextValue}>
      <ListContainer data-cy="posts-list" onRef={setScrollContainerRef}>
        <TitleBar scrollContainerRef={scrollContainerRef} title="Blog" />
        <div className="lg:space-y-1 lg:p-3">
          {posts.map((post) => {
            const slug = post.split('.')[0]
            const active = router.query?.slug === slug

            return <PostListItem post={slug} active={active} />
          })}
        </div>
      </ListContainer>
    </WritingContext.Provider>
  )
}
