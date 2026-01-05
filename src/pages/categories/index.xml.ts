export const prerender = true

import { loadContentIndex } from '../../lib/site-data'
import { buildFeed } from '../../lib/rss'

export async function GET() {
  const legacy = await loadContentIndex()
  const urls = new Set<string>()
  for (const entry of Object.values(legacy.taxonomies.categories)) {
    for (const u of entry.pages) urls.add(u)
  }
  const items = Array.from(urls)
    .map((u) => legacy.pageByUrl.get(u))
    .filter(Boolean)

  return buildFeed({
    site: legacy.site,
    title: legacy.site.i18n.categories ?? 'Categories',
    urlPath: '/categories/index.xml',
    items
  })
}
