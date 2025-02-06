import * as React from 'react'

import { ListItem } from '~/components/ListDetail/ListItem'

interface Props {
  post: string
  active: boolean
}

function splitCamelCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1 $2')
}

export const PostListItem = React.memo<Props>(({ post, active }) => {
  const title = splitCamelCase(post)
  return (
    <ListItem
      key={post}
      href="/writing/[slug]"
      as={`/writing/${post}`}
      title={title}
      description={null}
      active={active}
    />
  )
})
