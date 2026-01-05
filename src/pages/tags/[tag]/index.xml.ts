export const prerender = true

import { loadContentIndex } from '../../../lib/site-data'
import { buildFeed } from '../../../lib/rss'

export async function getStaticPaths() {
  const legacy = await loadContentIndex()
  return Object.keys(legacy.taxonomies.tags).map((slug) => ({ params: { tag: slug } }))
}

export async function GET({ params }: { params: { tag: string } }) {
  const legacy = await loadContentIndex()
  const slug = String(params.tag)
  const entry = legacy.taxonomies.tags[slug]
  if (!entry) throw new Error(`Missing tag: ${slug}`)
  const urls = entry.pages ?? []
  const items = urls.map((u) => legacy.pageByUrl.get(u)).filter(Boolean)

  return buildFeed({
    site: legacy.site,
    title: entry.name,
    urlPath: `/tags/${slug}/index.xml`,
    items
  })
}
