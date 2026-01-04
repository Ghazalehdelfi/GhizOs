export interface RSSFeed {
  id: string
  title: string
  url: string
}

export const RSS_FEEDS: RSSFeed[] = [
  {
    id: 'sebastianraschka',
    title: 'Sebastian Raschka',
    url: 'https://sebastianraschka.com/rss_feed.xml',
  },
  {
    id: 'andrejkarpathy',
    title: 'Andrej Karpathy',
    url: 'https://karpathy.bearblog.dev/feed/?type=rss',
  },
  {
    id: 'philschmid',
    title: 'Phil Schmid',
    url: 'https://www.philschmid.de/rss',
  },
  {
    id: 'huyenchip',
    title: 'Chip Huyen',
    url: 'https://huyenchip.com/feed.xml',
  },
  {
    id: 'mlmastery',
    title: 'Jason Brownlee',
    url: 'https://machinelearningmastery.com/feed/',
  },
  {
    id: 'eugeneyan',
    title: 'Eugene Yan',
    url: 'https://eugeneyan.com/rss/',
  },
  {
    id: 'hamelhussain',
    title: 'Hamel Hussain',
    url: 'https://medium.com/feed/@hamelhusain',
  },
]
