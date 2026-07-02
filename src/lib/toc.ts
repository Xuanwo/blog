import { DomUtils, parseDocument } from 'htmlparser2'
import { isTag } from 'domhandler'
import type { Element } from 'domhandler'

import { urlize } from './site-data'

export type TocItem = { id: string; text: string; level: number }

// Build a table of contents from rendered article HTML. Headings without
// an id get a slug injected (so anchors work regardless of the markdown
// pipeline's default behavior); ids are de-duplicated. Returns the toc
// plus the (possibly mutated) html to render.
export function buildToc(html: string): { toc: TocItem[]; html: string } {
  const document = parseDocument(html, { decodeEntities: true })
  const toc: TocItem[] = []
  const used = new Set<string>()

  const headings = DomUtils.findAll((node): node is Element => {
    return isTag(node) && (node.name === 'h2' || node.name === 'h3')
  }, document.children)

  for (const heading of headings) {
    const text = DomUtils.textContent(heading).trim()
    if (!text) continue

    const base = heading.attribs.id || urlize(text) || 'section'
    let id = base
    let n = 1
    while (used.has(id)) id = `${base}-${n++}`
    used.add(id)
    if (heading.attribs.id !== id) heading.attribs.id = id

    toc.push({ id, text, level: heading.name === 'h3' ? 3 : 2 })
  }

  return { toc, html: DomUtils.getInnerHTML(document) || html }
}
