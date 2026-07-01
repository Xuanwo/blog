import { createMarkdownProcessor } from '@astrojs/markdown-remark'
import { Parser } from 'htmlparser2'
import { visit } from 'unist-util-visit'
import YAML from 'yaml'

import { blogroll } from '../data/blogroll'
import { i18n, i18nZh } from '../data/i18n'
import { siteConfig } from '../data/site'

export type TaxonomyName = 'tags' | 'categories' | 'series'

export type PageFrontmatter = {
  title?: string
  date?: string | Date
  description?: string
  tags?: string[] | string
  categories?: string[] | string
  series?: string[] | string
  type?: string
  url?: string
  layout?: string
  lang?: string
}

export type ParsedMarkdown = {
  data: Record<string, unknown>
  content: string
}

export type PageRecord = {
  url: string
  source: string
  section: string | null
  title?: string
  date?: string
  description?: string
  excerpt: string
  plain: string
  html: string
  tags: string[]
  categories: string[]
  series: string[]
  type?: string
  lang: 'zh' | 'en'
}

export type SiteRecord = {
  baseURL: string
  title: string
  languageCode: string
  pagination: number
  params: {
    description?: string
    keywords?: string[]
    author?: string
  }
  menu: {
    footer?: Array<{ name: string; url: string; weight?: number }>
    icon?: Array<{ name: string; url: string; weight?: number }>
  }
  i18n: Record<string, string>
  i18nZh: Record<string, string>
  blogroll: Array<{ name: string; url: string; description: string }>
  indexMeta: Record<string, { title?: string; description?: string }>
}

export type SectionsRecord = Record<string, string[]>
export type SectionsMetaRecord = Record<string, { display: string }>
export type TaxonomiesRecord = Record<TaxonomyName, Record<string, { name: string; pages: string[] }>>
export type BranchesRecord = Record<string, string[]>

const markdownModules = import.meta.glob('../../content/**/*.{md,markdown}', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

function contentRelPathFromModulePath(path: string) {
  const normalized = path.replace(/\\/g, '/')
  const marker = '/content/'
  const markerIndex = normalized.indexOf(marker)
  if (markerIndex !== -1) return normalized.slice(markerIndex + marker.length)

  const relativePrefix = '../../content/'
  if (normalized.startsWith(relativePrefix)) return normalized.slice(relativePrefix.length)

  throw new Error(`Invalid content module path: ${path}`)
}

const markdownSources = Object.entries(markdownModules)
  .map(([modulePath, raw]) => ({
    rel: contentRelPathFromModulePath(modulePath),
    raw
  }))
  .sort((a, b) => a.rel.localeCompare(b.rel))

const markdownSourceByRelPath = new Map(markdownSources.map(({ rel, raw }) => [rel, raw]))

export function getMarkdownSource(source: string) {
  const raw = markdownSourceByRelPath.get(source)
  if (raw == null) throw new Error(`Missing markdown source: ${source}`)
  return raw
}

export function parseMarkdownFrontmatter(markdown: string): ParsedMarkdown {
  const match = /^(?:\uFEFF)?---[ \t]*\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)[ \t]*(?:\r?\n|$)/.exec(markdown)
  if (!match) return { data: {}, content: markdown }

  const parsed = YAML.parse(match[1] ?? '') ?? {}
  const data = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  return {
    data: data as Record<string, unknown>,
    content: markdown.slice(match[0].length)
  }
}

function normalizePagination(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (value && typeof value === 'object') {
    const pagerSize = (value as any).pagerSize
    if (typeof pagerSize === 'number' && Number.isFinite(pagerSize)) return pagerSize
  }
  return 10
}

function normalizeSegment(segment: string) {
  return segment.toLowerCase()
}

function ensureLeadingSlash(pathname: string) {
  if (pathname.startsWith('/')) return pathname
  return `/${pathname}`
}

function ensureTrailingSlash(pathname: string) {
  if (pathname === '/') return pathname
  if (pathname.endsWith('/')) return pathname
  return `${pathname}/`
}

function computeUrlFromContentPath(contentRelPath: string, frontmatterUrl?: string) {
  if (frontmatterUrl) return ensureTrailingSlash(ensureLeadingSlash(frontmatterUrl))

  const segments = contentRelPath.split('/').filter(Boolean)
  const filename = segments.pop()
  if (!filename) throw new Error(`Invalid content path: ${contentRelPath}`)

  const basename = filename.replace(/\.(md|markdown)$/i, '')
  if (segments.length === 0) return ensureTrailingSlash(`/${basename}`)

  const normalizedSegments = segments.map(normalizeSegment)
  return ensureTrailingSlash(`/${[...normalizedSegments, basename].join('/')}`)
}

function computeSectionKey(contentRelPath: string) {
  const segments = contentRelPath.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const filename = segments[segments.length - 1]
  if (/\.(md|markdown)$/i.test(filename) && segments.length === 1) return null
  return normalizeSegment(segments[0])
}

function stripHtmlToText(html: string) {
  let text = ''
  const parser = new Parser(
    {
      ontext(data) {
        text += `${data} `
      }
    },
    { decodeEntities: true }
  )
  parser.write(html)
  parser.end()

  return text
    .replace(/\s+/g, ' ')
    .trim()
}

function hasUppercase(str: string) {
  return /[A-Z]/.test(str)
}

// Detect an article's language by script. CJK-dominant text → 'zh', else 'en'.
// Compares CJK ideograph count against Latin word count; front matter `lang`
// overrides this (see loadContentIndex). Mixed posts may misfire — rare, and
// fixable per-post with `lang:` in front matter.
export function detectLang(text: string): 'zh' | 'en' {
  if (!text) return 'en'
  const cjk = (text.match(/[㐀-鿿豈-﫿]/g) || []).length
  const latinWords = (text.match(/[a-zA-Z]{2,}/g) || []).length
  return cjk > latinWords ? 'zh' : 'en'
}

function titleizeHyphenated(str: string) {
  return str
    .split('-')
    .map((part) => {
      if (!part) return part
      const first = part[0]
      if (first.toLowerCase() === first.toUpperCase()) return part
      return `${first.toUpperCase()}${part.slice(1)}`
    })
    .join('-')
}

function deriveTaxonomyDisplayName(raw: string) {
  const value = String(raw).trim()
  if (!value) return value
  if (hasUppercase(value)) return value
  return titleizeHyphenated(value)
}

function normalizeFrontmatterStringArray(value: unknown) {
  if (Array.isArray(value)) return value.map(String)
  if (value == null) return []
  return [String(value)]
}

function parseDate(value: unknown): string | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value.toISOString()
  const parsed = new Date(String(value))
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed.toISOString()
}

export function preprocessHugoHighlightShortcode(markdown: string) {
  const open = /\{\{<\s*highlight\s+([^\s>]+)[^>]*>\}\}/g
  const close = /\{\{<\s*\/\s*highlight\s*>\}\}/g

  let result = ''
  let cursor = 0
  let match: RegExpExecArray | null

  // eslint-disable-next-line no-cond-assign
  while ((match = open.exec(markdown)) !== null) {
    const lang = String(match[1] ?? '').trim()
    const start = match.index + match[0].length
    close.lastIndex = start
    const end = close.exec(markdown)
    if (!end) break

    result += markdown.slice(cursor, match.index)
    const inner = markdown.slice(start, end.index).replace(/^\n+/, '').replace(/\n+$/, '')
    result += `\n\`\`\`${lang}\n${inner}\n\`\`\`\n`
    cursor = end.index + end[0].length
    open.lastIndex = cursor
  }
  result += markdown.slice(cursor)
  return result
}

function remarkRewriteRelativeImages() {
  return (tree: any, file: any) => {
    const frontmatter = file?.data?.astro?.frontmatter ?? {}
    const fmUrl = typeof frontmatter.url === 'string' ? frontmatter.url : '/'
    const basePath = ensureTrailingSlash(ensureLeadingSlash(fmUrl))
    const base = new URL(basePath, 'https://example.invalid')

    visit(tree, 'image', (node: any) => {
      if (!node || typeof node.url !== 'string') return

      const value = node.url
      const isExternal =
        value.startsWith('/') ||
        value.startsWith('#') ||
        value.startsWith('data:') ||
        value.startsWith('mailto:') ||
        value.includes('://') ||
        value.startsWith('//')
      if (isExternal) return

      const cleaned = value.replace(/^\.\//, '')
      const next = new URL(cleaned, base)
      node.url = `${next.pathname}${next.search}${next.hash}`
    })
  }
}

let cachedSite: SiteRecord | null = null

export function loadSite() {
  if (cachedSite) return cachedSite

  const config = siteConfig

  cachedSite = {
    baseURL: config.baseURL,
    title: config.title,
    languageCode: config.languageCode,
    pagination: normalizePagination(config.pagination),
    params: config.params ?? {},
    menu: config.menu ?? {},
    i18n,
    i18nZh,
    blogroll,
    indexMeta: {}
  }
  return cachedSite
}

export function getTranslation(key: string) {
  const site = loadSite()
  return site.i18n[key] ?? key
}

let markdownProcessorPromise: ReturnType<typeof createMarkdownProcessor> | null = null

async function getMarkdownProcessor() {
  if (!markdownProcessorPromise) {
    markdownProcessorPromise = createMarkdownProcessor({
      gfm: true,
      smartypants: false,
      remarkPlugins: [remarkRewriteRelativeImages],
      shikiConfig: {
        themes: { light: 'github-light', dark: 'github-dark' },
        wrap: true,
        langAlias: {
          golang: 'go',
          nodejs: 'javascript',
          PowerShell: 'powershell',
          XML: 'xml',
          ejs: 'html',
          'go-html-template': 'html',
          ssh: 'bash',
          gpg: 'bash',
          caddyfile: 'ini',
          conf: 'ini',
          env: 'ini',
          hosts: 'ini',
          dns: 'ini',
          ssh_config: 'ini',
          openai: 'markdown',
          claude: 'markdown',
          swig: 'twig'
        }
      }
    })
  }
  return markdownProcessorPromise
}

let cachedIndex:
  | null
  | {
      site: SiteRecord
      pages: PageRecord[]
      pageByUrl: Map<string, PageRecord>
      sections: SectionsRecord
      sectionsMeta: SectionsMetaRecord
      taxonomies: TaxonomiesRecord
      branches: BranchesRecord
    } = null

export async function loadContentIndex() {
  if (cachedIndex) return cachedIndex

  const site = loadSite()

  const indexMeta: Record<string, { title?: string; description?: string }> = {}
  for (const { rel, raw } of markdownSources) {
    const segments = rel.split('/').filter(Boolean).map(normalizeSegment)
    const name = segments[segments.length - 1]?.toLowerCase()
    if (name !== '_index.md' && name !== '_index.markdown') continue

    const parsed = parseMarkdownFrontmatter(raw)
    const key = segments.slice(0, -1).join('/')
    indexMeta[key] = {
      title: parsed.data?.title,
      description: parsed.data?.description
    }
  }
  site.indexMeta = indexMeta

  const processor = await getMarkdownProcessor()

  const pages: PageRecord[] = []
  const sections: SectionsRecord = {}
  const sectionsMeta: SectionsMetaRecord = {}
  const taxonomies: TaxonomiesRecord = {
    tags: {},
    categories: {},
    series: {}
  }

  for (const { rel, raw } of markdownSources) {
    const filename = rel.split('/').pop()?.toLowerCase()
    if (filename === '_index.md' || filename === '_index.markdown') continue

    const parsed = parseMarkdownFrontmatter(raw)
    const fm = (parsed.data ?? {}) as PageFrontmatter

    const urlPath = computeUrlFromContentPath(rel, fm.url)
    const markdown = preprocessHugoHighlightShortcode(parsed.content)
    const renderResult = await processor.render(markdown, {
      frontmatter: { ...fm, url: urlPath, layout: undefined }
    })
    const html = renderResult.code
    const plain = stripHtmlToText(html)

    const description = typeof fm.description === 'string' ? fm.description : undefined
    const excerpt = description ?? (plain.length > 120 ? `${plain.slice(0, 70)}...` : plain)

    const title = typeof fm.title === 'string' ? fm.title : undefined
    const date = parseDate(fm.date)

    const rawTags = normalizeFrontmatterStringArray(fm.tags)
    const rawCategories = normalizeFrontmatterStringArray(fm.categories)
    const rawSeries = normalizeFrontmatterStringArray(fm.series)

    const tags = Array.from(new Set(rawTags.map((t) => urlize(t))))
    const categories = Array.from(new Set(rawCategories.map((c) => urlize(c))))
    const series = Array.from(new Set(rawSeries.map((s) => urlize(s))))

    const sectionKey = computeSectionKey(rel)
    if (sectionKey) {
      sections[sectionKey] ??= []
      sections[sectionKey].push(urlPath)
      sectionsMeta[sectionKey] ??= { display: rel.split('/').filter(Boolean)[0] }
    }

    for (const rawTag of rawTags) {
      const slug = urlize(rawTag)
      taxonomies.tags[slug] ??= { name: deriveTaxonomyDisplayName(rawTag), pages: [] }
      const existing = taxonomies.tags[slug]
      if (hasUppercase(rawTag) && !hasUppercase(existing.name)) existing.name = String(rawTag).trim()
      existing.pages.push(urlPath)
    }
    for (const rawCat of rawCategories) {
      const slug = urlize(rawCat)
      taxonomies.categories[slug] ??= { name: deriveTaxonomyDisplayName(rawCat), pages: [] }
      const existing = taxonomies.categories[slug]
      if (hasUppercase(rawCat) && !hasUppercase(existing.name)) existing.name = String(rawCat).trim()
      existing.pages.push(urlPath)
    }
    for (const rawSer of rawSeries) {
      const slug = urlize(rawSer)
      taxonomies.series[slug] ??= { name: deriveTaxonomyDisplayName(rawSer), pages: [] }
      const existing = taxonomies.series[slug]
      if (hasUppercase(rawSer) && !hasUppercase(existing.name)) existing.name = String(rawSer).trim()
      existing.pages.push(urlPath)
    }

    pages.push({
      source: rel,
      url: urlPath,
      section: sectionKey,
      title,
      date,
      description,
      excerpt,
      plain,
      html,
      tags,
      categories,
      series,
      type: typeof fm.type === 'string' ? fm.type : undefined,
      lang: fm.lang === 'zh' || fm.lang === 'en' ? fm.lang : detectLang(plain)
    })
  }

  pages.sort((a, b) => {
    const ad = a.date ? Date.parse(a.date) : 0
    const bd = b.date ? Date.parse(b.date) : 0
    if (bd !== ad) return bd - ad
    return a.url.localeCompare(b.url)
  })

  const pageByUrl = new Map<string, PageRecord>()
  for (const p of pages) pageByUrl.set(p.url, p)

  for (const [key, list] of Object.entries(sections)) {
    list.sort((aUrl, bUrl) => {
      const a = pageByUrl.get(aUrl)
      const b = pageByUrl.get(bUrl)
      const ad = a?.date ? Date.parse(a.date) : 0
      const bd = b?.date ? Date.parse(b.date) : 0
      if (bd !== ad) return bd - ad
      return aUrl.localeCompare(bUrl)
    })
  }
  for (const group of Object.values(taxonomies)) {
    for (const entry of Object.values(group)) {
      entry.pages.sort((aUrl, bUrl) => {
        const a = pageByUrl.get(aUrl)
        const b = pageByUrl.get(bUrl)
        const ad = a?.date ? Date.parse(a.date) : 0
        const bd = b?.date ? Date.parse(b.date) : 0
        if (bd !== ad) return bd - ad
        return aUrl.localeCompare(bUrl)
      })
    }
  }

  for (const [key, meta] of Object.entries(indexMeta)) {
    if (!key.startsWith('series/')) continue
    const slug = key.slice('series/'.length)
    taxonomies.series[slug] ??= { name: meta.title ?? titleizeHyphenated(slug), pages: [] }
  }

  const branches: BranchesRecord = {}
  for (const key of Object.keys(indexMeta)) {
    if (key.startsWith('series/')) continue
    const prefix = `${key}/`
    branches[key] = pages
      .filter((p) => String(p.source).toLowerCase().replace(/\\\\/g, '/').startsWith(prefix))
      .map((p) => p.url)
  }

  cachedIndex = { site, pages, pageByUrl, sections, sectionsMeta, taxonomies, branches }
  return cachedIndex
}

export function urlize(term: string) {
  return String(term)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDay(dateIso: string) {
  const date = new Date(dateIso)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const monthYear = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date)
  return { day, monthYear }
}

export function pluralizeTitle(base: string) {
  if (!base) return base
  if (/[sS]$/.test(base)) return `${base}es`
  return `${base}s`
}

export function titleizeSegmentPreserve(segment: string) {
  if (!segment) return segment
  const first = segment[0]
  if (first.toLowerCase() === first.toUpperCase()) return segment
  return `${first.toUpperCase()}${segment.slice(1)}`
}
