import Image from 'next/image'
import * as React from 'react'

import { ListItem } from '~/components/ListDetail/ListItem'

interface Props {
  title: string
  url: string
}

export const BookmarksListItem = React.memo<Props>(({ title, url }) => {
  return (
    <ListItem
      key={title}
      href={url}
      title={title}
      description={null}
      active={false}
    />
  )
})
