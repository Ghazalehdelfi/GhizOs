import Image from 'next/image'
import * as React from 'react'

import { ListItem } from '~/components/ListDetail/ListItem'

interface Props {
  title: string
  url: string
}

export const BookmarksListItem = React.memo<Props>(({ title, url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex space-x-3 border-b border-gray-100 py-3 px-3.5 text-sm dark:border-gray-900 lg:rounded-lg lg:border-none lg:py-2 sm:hover:bg-gray-200 sm:dark:hover:bg-gray-800`}
    >
      <div className="flex flex-col justify-center space-y-1">
        <div className={`font-medium line-clamp-3 text-gray-100`}>{title}</div>
      </div>
    </a>
  )
})
