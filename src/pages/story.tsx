import * as React from 'react'

import { Intro } from '~/components/Home/Intro'
import { ListDetailView } from '~/components/Layouts'
import StoryBook from '~/components/Story'

export default function Story() {
  return <ListDetailView list={null} hasDetail detail={<StoryBook />} />
}
