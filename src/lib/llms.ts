export type LlmsListItem = {
  title: string
  url: string
  note?: string
}

export type LlmsSection = {
  title: string
  items: LlmsListItem[]
}

export function toAbsoluteUrl(siteBaseUrl: string, pathname: string) {
  return new URL(pathname, siteBaseUrl).toString()
}

export function toMarkdownRoutePath(urlPath: string) {
  if (urlPath === '/') return null
  const trimmed = urlPath.endsWith('/') ? urlPath.slice(0, -1) : urlPath
  if (!trimmed) return null
  return `${trimmed}.md`
}

export function formatIsoDay(dateIso?: string) {
  if (!dateIso) return null
  const day = dateIso.slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null
  return day
}

export function sanitizeLlmsTitle(title: string | undefined, fallback: string) {
  const value = String(title ?? '').trim()
  if (!value) return fallback
  if (/[^\x20-\x7E]/.test(value)) return fallback
  return value
}

export function buildLlmsText(args: {
  h1: string
  summary?: string
  details?: string[]
  sections?: LlmsSection[]
}) {
  const lines: string[] = []
  lines.push(`# ${args.h1}`)

  const summary = args.summary?.trim()
  if (summary) {
    lines.push('')
    lines.push(`> ${summary.replace(/^>\s*/, '')}`)
  }

  const details = args.details?.filter(Boolean) ?? []
  if (details.length > 0) {
    lines.push('')
    lines.push(...details)
  }

  const sections = args.sections ?? []
  for (const section of sections) {
    lines.push('')
    lines.push(`## ${section.title}`)
    lines.push('')
    for (const item of section.items) {
      const note = item.note?.trim()
      lines.push(`- [${item.title}](${item.url})${note ? `: ${note}` : ''}`)
    }
  }

  lines.push('')
  return lines.join('\n')
}
