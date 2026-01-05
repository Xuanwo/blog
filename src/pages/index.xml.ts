export const prerender = true

import { loadContentIndex } from '../lib/site-data'
import { buildFeed } from '../lib/rss'

export async function GET() {
  const { site, pages } = await loadContentIndex()
  const items = pages.filter((p) => p.type !== 'page')
  return buildFeed({
    site,
    title: site.title,
    urlPath: '/index.xml',
    items
  })
}
