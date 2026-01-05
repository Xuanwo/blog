export const prerender = true

import { loadContentIndex } from '../lib/site-data'
import { paginate } from '../lib/pagination'

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function joinUrl(base: string, path: string) {
  return new URL(path.replace(/^\//, ''), base).toString()
}

export async function GET() {
  const legacy = await loadContentIndex()
  const { site, pages } = legacy
  const pageSize = site.pagination ?? 10

  const urls = new Set<string>()

  urls.add('/')
  urls.add('/index.xml')

  const regularPages = pages.filter((p) => p.type !== 'page')
  const homePages = paginate(regularPages, pageSize).totalPages
  for (let i = 2; i <= homePages; i++) urls.add(`/page/${i}/`)

  for (const p of pages) urls.add(p.url)

  for (const section of Object.keys(legacy.sections)) {
    urls.add(`/${section}/`)
    urls.add(`/${section}/index.xml`)
    const sectionPages = (legacy.sections[section] ?? []).length
    const sectionTotal = paginate(new Array(sectionPages), pageSize).totalPages
    for (let i = 2; i <= sectionTotal; i++) urls.add(`/${section}/page/${i}/`)
  }

  const branchKey = 'en-us/reports'
  if (legacy.branches[branchKey]) {
    urls.add('/en-us/reports/')
    urls.add('/en-us/reports/index.xml')
    const branchTotal = paginate(new Array(legacy.branches[branchKey].length), pageSize).totalPages
    for (let i = 2; i <= branchTotal; i++) urls.add(`/en-us/reports/page/${i}/`)
  }

  urls.add('/tags/')
  urls.add('/tags/index.xml')
  for (const slug of Object.keys(legacy.taxonomies.tags)) {
    urls.add(`/tags/${slug}/`)
    urls.add(`/tags/${slug}/index.xml`)
  }

  urls.add('/categories/')
  urls.add('/categories/index.xml')
  for (const slug of Object.keys(legacy.taxonomies.categories)) {
    urls.add(`/categories/${slug}/`)
    urls.add(`/categories/${slug}/index.xml`)
  }

  urls.add('/series/')
  urls.add('/series/index.xml')
  for (const slug of Object.keys(legacy.taxonomies.series)) {
    urls.add(`/series/${slug}/`)
    urls.add(`/series/${slug}/index.xml`)
  }

  urls.add('/sitemap.xml')

  const now = new Date().toISOString()
  const entries = Array.from(urls)
    .filter((p) => p.startsWith('/'))
    .sort()
    .map((path) => {
      const loc = xmlEscape(joinUrl(site.baseURL, path))
      return `<url><loc>${loc}</loc><lastmod>${now}</lastmod></url>`
    })
    .join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`
  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8'
    }
  })
}
