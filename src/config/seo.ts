export const baseUrl =
  process.env.NODE_ENV === 'production' ? 'https://delfig.dev' : ''

export const defaultSEO = {
  title: 'Ghazaleh Delfi',
  description: 'ML Engineer, Software Engineer, in Toronto',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    site_name: 'Ghazaleh Delfi',
  },
}

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function extendSEO(options: SEOProps) {
  return {
    ...defaultSEO,
    ...options,
    url: `${baseUrl}/${options.url}`,
    openGraph: {
      ...defaultSEO.openGraph,
      url: `${baseUrl}/${options.url}`,
    },
  }
}
