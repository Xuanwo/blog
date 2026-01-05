export const prerender = true

import { loadContentIndex } from '../../../lib/site-data'
import { buildFeed } from '../../../lib/rss'

export async function getStaticPaths() {
  const legacy = await loadContentIndex()
  return Object.keys(legacy.taxonomies.categories).map((slug) => ({ params: { category: slug } }))
}

export async function GET({ params }: { params: { category: string } }) {
  const legacy = await loadContentIndex()
  const slug = String(params.category)
  const entry = legacy.taxonomies.categories[slug]
  if (!entry) throw new Error(`Missing category: ${slug}`)
  const urls = entry.pages ?? []
  const items = urls.map((u) => legacy.pageByUrl.get(u)).filter(Boolean)

  return buildFeed({
    site: legacy.site,
    title: entry.name,
    urlPath: `/categories/${slug}/index.xml`,
    items
  })
}
