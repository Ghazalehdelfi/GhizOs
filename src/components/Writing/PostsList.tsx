import { useRouter } from 'next/router'
import * as React from 'react'
import fs from 'fs'
import path from 'path'
import { ListContainer } from '~/components/ListDetail/ListContainer'

import { PostListItem } from './PostListItem'
import { useEffect, useState } from 'react'
import { TitleBar } from '../ListDetail/TitleBar'

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
