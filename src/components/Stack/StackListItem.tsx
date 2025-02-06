import Image from 'next/image'
import * as React from 'react'

import { ListItem } from '~/components/ListDetail/ListItem'
import { StackItem } from '~/data/stack'

interface Props {
  summary: StackItem
}

export const AppDissectionListItem = React.memo<Props>(({ summary }) => {
  return (
    <ListItem
      key={summary.title}
      title={summary.title}
      description={null}
      leadingAccessory={summary.Icon}
      active={false}
    />
  )
})
