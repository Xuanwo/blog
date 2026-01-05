export const prerender = true

import { loadContentIndex } from '../../../lib/site-data'
import { buildFeed } from '../../../lib/rss'

export async function getStaticPaths() {
  const legacy = await loadContentIndex()
  return Object.keys(legacy.taxonomies.series).map((slug) => ({ params: { series: slug } }))
}

export async function GET({ params }: { params: { series: string } }) {
  const legacy = await loadContentIndex()
  const slug = String(params.series)
  const entry = legacy.taxonomies.series[slug]
  if (!entry) throw new Error(`Missing series: ${slug}`)
  const urls = entry.pages ?? []
  const items = urls.map((u) => legacy.pageByUrl.get(u)).filter(Boolean)

  const meta = legacy.site.indexMeta[`series/${slug}`] ?? {}
  const title = meta.title ?? entry.name

  return buildFeed({
    site: legacy.site,
    title,
    urlPath: `/series/${slug}/index.xml`,
    items
  })
}
