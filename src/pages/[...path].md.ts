import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { APIRoute } from 'astro'
import matter from 'gray-matter'

import { loadContentIndex, loadSite, preprocessHugoHighlightShortcode } from '../lib/site-data'

export const prerender = true

function rewriteMarkdownImagesToAbsolute(markdown: string, basePath: string, siteBaseUrl: string) {
  const siteBase = new URL(siteBaseUrl)
  const base = new URL(basePath.endsWith('/') ? basePath : `${basePath}/`, 'https://example.invalid')

  return markdown.replace(/(!\[[^\]]*\]\()([^)]*)(\))/g, (full, prefix, inner, suffix) => {
    const raw = String(inner).trim()
    if (!raw) return full

    let destination = ''
    let rest = ''
    let wrappedInAngles = false

    if (raw.startsWith('<')) {
      const end = raw.indexOf('>')
      if (end === -1) return full
      wrappedInAngles = true
      destination = raw.slice(1, end).trim()
      rest = raw.slice(end + 1)
    } else {
      const match = /^(\S+)([\s\S]*)$/.exec(raw)
      if (!match) return full
      destination = match[1] ?? ''
      rest = match[2] ?? ''
    }

    const isExternal =
      destination.startsWith('#') ||
      destination.startsWith('data:') ||
      destination.startsWith('mailto:') ||
      destination.includes('://') ||
      destination.startsWith('//')
    if (isExternal) return full

    const resolvedPath = destination.startsWith('/')
      ? destination
      : (() => {
          const cleaned = destination.replace(/^\.\//, '')
          const next = new URL(cleaned, base)
          return `${next.pathname}${next.search}${next.hash}`
        })()

    const absolute = new URL(resolvedPath, siteBase).toString()
    const nextDestination = wrappedInAngles ? `<${absolute}>` : absolute
    return `${prefix}${nextDestination}${rest}${suffix}`
  })
}

export async function getStaticPaths() {
  const { pages } = await loadContentIndex()
  return pages
    .filter((p) => p.type !== 'page')
    .map((p) => ({ params: { path: p.url.replace(/^\//, '').replace(/\/$/, '') } }))
}

export const GET: APIRoute = async ({ params }) => {
  const rawPath = String(params.path ?? '').replace(/^\//, '').replace(/\/$/, '')
  const urlPath = `/${rawPath}/`

  const { pageByUrl } = await loadContentIndex()
  const page = pageByUrl.get(urlPath)
  if (!page) return new Response('Not Found', { status: 404 })

  const site = loadSite()
  const absPath = join(process.cwd(), 'content', page.source)
  const raw = readFileSync(absPath, 'utf8')
  const parsed = matter(raw)

  const title = page.title ?? (typeof parsed.data?.title === 'string' ? parsed.data.title : undefined)
  const markdownBody = preprocessHugoHighlightShortcode(parsed.content)
  const rewritten = rewriteMarkdownImagesToAbsolute(markdownBody, urlPath, site.baseURL)

  const output = `${title ? `# ${title}\n\n` : ''}${rewritten.trimStart()}`
  return new Response(output, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  })
}
