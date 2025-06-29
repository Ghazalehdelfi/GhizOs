import * as React from 'react'
import { useEffect } from 'react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import { MarkdownRenderer } from '~/components/MarkdownRenderer'

interface Post {
  title: string
  content: string
}

export function PostDetail({ slug }) {
  const scrollContainerRef = React.useRef(null)
  const titleRef = React.useRef(null)
  const [post, getPost] = React.useState<Post>({ title: '', content: '' })

  useEffect(() => {
    // Fetch the file list from the API
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/getMarkdown?title=${slug}`)
        const data: any = await response.json()
        getPost(data)
        console.log(data)
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }

    fetchFiles()
  }, [slug])

  return (
    <>
      <Detail.Container data-cy="post-detail" ref={scrollContainerRef}>
        <Detail.ContentContainer>
          <MarkdownRenderer children={post.content} className="prose mt-8" />
          {/* bottom padding to give space between post content and comments */}
          <div className="py-6" />
        </Detail.ContentContainer>
      </Detail.Container>
    </>
  )
}
