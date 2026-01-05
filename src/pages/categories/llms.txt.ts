export const prerender = true

import type { APIRoute } from 'astro'

import { buildLlmsText, toAbsoluteUrl } from '../../lib/llms'
import { loadContentIndex } from '../../lib/site-data'

export const GET: APIRoute = async () => {
  const { site, taxonomies } = await loadContentIndex()

  const entries = Object.entries(taxonomies.categories)
    .map(([slug, entry]) => ({ slug, entry }))
    .sort((a, b) => a.entry.name.localeCompare(b.entry.name))

  const items = entries.map(({ slug, entry }) => {
    const url = toAbsoluteUrl(site.baseURL, `/categories/${slug}/llms.txt`)
    const count = entry.pages.length
    return {
      title: entry.name,
      url,
      note: `${count} post${count === 1 ? '' : 's'} (HTML: ${toAbsoluteUrl(
        site.baseURL,
        `/categories/${slug}/`
      )}).`
    }
  })

  const body = buildLlmsText({
    h1: `${site.title} / Categories`,
    summary: `Category index for ${site.baseURL}.`,
    details: [
      'Each category has its own `llms.txt` with a curated list of posts (Markdown links when available).'
    ],
    sections: [{ title: 'Categories', items }]
  })

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  })
}
