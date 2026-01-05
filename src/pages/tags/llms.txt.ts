export const prerender = true

import type { APIRoute } from 'astro'

import { buildLlmsText, toAbsoluteUrl } from '../../lib/llms'
import { loadContentIndex } from '../../lib/site-data'

export const GET: APIRoute = async () => {
  const { site, taxonomies } = await loadContentIndex()

  const entries = Object.entries(taxonomies.tags)
    .map(([slug, entry]) => ({ slug, entry }))
    .sort((a, b) => a.entry.name.localeCompare(b.entry.name))

  const items = entries.map(({ slug, entry }) => {
    const url = toAbsoluteUrl(site.baseURL, `/tags/${slug}/llms.txt`)
    const count = entry.pages.length
    return {
      title: entry.name,
      url,
      note: `${count} post${count === 1 ? '' : 's'} (HTML: ${toAbsoluteUrl(site.baseURL, `/tags/${slug}/`)}).`
    }
  })

  const body = buildLlmsText({
    h1: `${site.title} / Tags`,
    summary: `Tag index for ${site.baseURL}.`,
    details: ['Each tag has its own `llms.txt` with a curated list of posts (Markdown links when available).'],
    sections: [{ title: 'Tags', items }]
  })

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  })
}
