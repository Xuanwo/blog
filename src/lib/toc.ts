import { load as loadHtml } from 'cheerio'

import { urlize } from './site-data'

export type TocItem = { id: string; text: string; level: number }

// Build a table of contents from rendered article HTML. Headings without
// an id get a slug injected (so anchors work regardless of the markdown
// pipeline's default behavior); ids are de-duplicated. Returns the toc
// plus the (possibly mutated) html to render.
export function buildToc(html: string): { toc: TocItem[]; html: string } {
  const $ = loadHtml(html, null, false)
  const toc: TocItem[] = []
  const used = new Set<string>()

  $('h2, h3').each((_, el) => {
    const $el = $(el)
    const text = $el.text().trim()
    if (!text) return

    const base = $el.attr('id') || urlize(text) || 'section'
    let id = base
    let n = 1
    while (used.has(id)) id = `${base}-${n++}`
    used.add(id)
    if ($el.attr('id') !== id) $el.attr('id', id)

    toc.push({ id, text, level: $el.is('h3') ? 3 : 2 })
  })

  return { toc, html: $.html() ?? html }
}
