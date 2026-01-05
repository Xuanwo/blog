export const prerender = true

import type { APIRoute } from 'astro'

import {
  buildLlmsText,
  formatIsoDay,
  sanitizeLlmsTitle,
  toAbsoluteUrl,
  toMarkdownRoutePath
} from '../../../lib/llms'
import { loadContentIndex } from '../../../lib/site-data'

const PRIMARY_ITEMS = 50

export async function getStaticPaths() {
  const legacy = await loadContentIndex()
  return Object.keys(legacy.taxonomies.series).map((slug) => ({ params: { series: slug } }))
}

export const GET: APIRoute = async ({ params }) => {
  const slug = String(params.series ?? '')
  const { site, pageByUrl, taxonomies } = await loadContentIndex()

  const entry = taxonomies.series[slug]
  if (!entry) return new Response('Not Found', { status: 404 })

  const urls = entry.pages ?? []
  const pages = urls.map((u) => pageByUrl.get(u)).filter(Boolean)
  const primary = pages.slice(0, PRIMARY_ITEMS)
  const rest = pages.slice(PRIMARY_ITEMS)

  const items = primary.map((p) => {
    const mdPath = toMarkdownRoutePath(p.url)
    const url = toAbsoluteUrl(site.baseURL, mdPath ?? p.url)
    const day = formatIsoDay(p.date) ?? 'unknown date'
    const title = sanitizeLlmsTitle(p.title, p.url)
    return { title, url, note: day }
  })

  const optionalItems = rest.map((p) => {
    const mdPath = toMarkdownRoutePath(p.url)
    const url = toAbsoluteUrl(site.baseURL, mdPath ?? p.url)
    const day = formatIsoDay(p.date) ?? 'unknown date'
    const title = sanitizeLlmsTitle(p.title, p.url)
    return { title, url, note: day }
  })

  const body = buildLlmsText({
    h1: `${site.title} / Series: ${entry.name}`,
    summary: `Posts in the "${entry.name}" series on ${site.baseURL}.`,
    details: [
      `HTML: ${toAbsoluteUrl(site.baseURL, `/series/${slug}/`)}`,
      '- For individual posts, prefer the Markdown version by replacing the trailing slash with `.md` (e.g. `/foo/` -> `/foo.md`).'
    ],
    sections: [
      { title: 'Posts', items },
      ...(optionalItems.length > 0 ? [{ title: 'Optional', items: optionalItems }] : [])
    ]
  })

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  })
}
