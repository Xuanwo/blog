export const prerender = true

import { loadContentIndex, pluralizeTitle, titleizeSegmentPreserve } from '../../lib/site-data'
import { buildFeed } from '../../lib/rss'

export async function getStaticPaths() {
  const legacy = await loadContentIndex()
  return Object.keys(legacy.sections).map((section) => ({ params: { section } }))
}

export async function GET({ params }: { params: { section: string } }) {
  const legacy = await loadContentIndex()
  const section = String(params.section)
  const urls = legacy.sections[section] ?? []
  const items = urls.map((u) => legacy.pageByUrl.get(u)).filter(Boolean)

  const meta = legacy.site.indexMeta[section]
  const display = legacy.sectionsMeta[section]?.display ?? section
  const title = meta?.title ?? pluralizeTitle(titleizeSegmentPreserve(display))

  return buildFeed({
    site: legacy.site,
    title,
    urlPath: `/${section}/index.xml`,
    items
  })
}
