export const prerender = true

import { loadContentIndex } from '../../../lib/site-data'
import { buildFeed } from '../../../lib/rss'

export async function GET() {
  const legacy = await loadContentIndex()
  const branchKey = 'en-us/reports'
  const urls = legacy.branches[branchKey] ?? []
  const items = urls.map((u) => legacy.pageByUrl.get(u)).filter(Boolean)

  const meta = legacy.site.indexMeta[branchKey] ?? {}
  const title = meta.title ?? 'Reports'

  return buildFeed({
    site: legacy.site,
    title,
    urlPath: '/en-us/reports/index.xml',
    items
  })
}
