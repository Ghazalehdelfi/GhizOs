import { NextSeo } from 'next-seo'
import * as React from 'react'

import { ListDetailView, SiteLayout } from '~/components/Layouts'
import { withProviders } from '~/components/Providers/withProviders'
import { FeedList } from '~/components/RSSFeed/FeedList'
import routes from '~/config/routes'

function RSSPage() {
  return (
    <NextSeo
      title={routes.rss.seo.title}
      description={routes.rss.seo.description}
      openGraph={routes.rss.seo.openGraph}
    />
  )
}

RSSPage.getLayout = withProviders(function getLayout(page) {
  return (
    <SiteLayout>
      <ListDetailView list={<FeedList />} hasDetail={false} detail={page} />
    </SiteLayout>
  )
})

export default RSSPage
