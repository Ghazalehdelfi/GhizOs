import { useRouter } from 'next/router'
import * as React from 'react'

import { ListContainer } from '~/components/ListDetail/ListContainer'
import { TitleBar } from '~/components/ListDetail/TitleBar'
import stackData from '~/data/stack'

import { AppDissectionListItem } from './StackListItem'

export const StackList = React.memo(() => {
  const router = useRouter()
  let [scrollContainerRef, setScrollContainerRef] = React.useState(null)

  return (
    <ListContainer data-cy="apps-list" onRef={setScrollContainerRef}>
      <TitleBar scrollContainerRef={scrollContainerRef} title="Tech Stack" />

      <div className="lg:space-y-1 lg:p-3">
        {stackData.map((summary) => {
          return <AppDissectionListItem summary={summary} />
        })}
      </div>
    </ListContainer>
  )
})
