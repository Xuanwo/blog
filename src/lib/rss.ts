import rss from '@astrojs/rss'

import type { PageRecord, SiteRecord } from './site-data'

export function buildFeed(params: {
  site: SiteRecord
  title: string
  description?: string
  urlPath: string
  items: PageRecord[]
}) {
  const { site, title, description, urlPath, items } = params
  return rss({
    title,
    description: description ?? site.params.description ?? '',
    site: site.baseURL,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<atom:link href="${new URL(urlPath.replace(/^\//, ''), site.baseURL).toString()}" rel="self" type="application/rss+xml" />`,
    items: items
      .filter((p) => p.date)
      .map((p) => ({
        title: p.title ?? '',
        pubDate: new Date(p.date as string),
        description: p.description ?? p.excerpt,
        link: p.url
      }))
  })
}
