export const prerender = true

import type { APIRoute } from 'astro'

import {
  buildLlmsText,
  formatIsoDay,
  sanitizeLlmsTitle,
  toAbsoluteUrl,
  toMarkdownRoutePath
} from '../../lib/llms'
import { loadContentIndex } from '../../lib/site-data'

const PRIMARY_ITEMS = 50

export const GET: APIRoute = async () => {
  const { site, pages } = await loadContentIndex()

  const posts = pages.filter((p) => p.type !== 'page')
  const primary = posts.slice(0, PRIMARY_ITEMS)
  const rest = posts.slice(PRIMARY_ITEMS)

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
    h1: `${site.title} / Archives`,
    summary: `An archive index for ${site.baseURL}.`,
    details: [
      'Preferred format:',
      '- For individual posts, prefer the Markdown version by replacing the trailing slash with `.md` (e.g. `/foo/` -> `/foo.md`).'
    ],
    sections: [
      { title: 'Latest posts', items },
      ...(optionalItems.length > 0 ? [{ title: 'Optional', items: optionalItems }] : [])
    ]
  })

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  })
}
