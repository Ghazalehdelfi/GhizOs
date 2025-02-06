import { useRouter } from 'next/router'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import bookmarks from '~/data/bookmarks'

import { BookmarksListItem } from './BookmarksListItem'

export const BookmarksList = React.memo(() => {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  return (
    <ListContainer data-cy="apps-list" onRef={setScrollContainerRef}>
      <TitleBar scrollContainerRef={scrollContainerRef} title="Bookmarks" />

      <div className="lg:space-y-1 lg:p-3">
        {bookmarks.map((summary) => {
          return <BookmarksListItem title={summary.title} url={summary.url} />
        })}
      </div>
    </ListContainer>
  )
})
