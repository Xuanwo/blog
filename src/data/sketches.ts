export type Sketch = {
  slug: string
  title: string
  date: string
  description?: string
  cover?: string
}

// Each slug maps to static/sketches/<slug>/index.html.
export const sketches: Sketch[] = [
  {
    slug: 'lance-discrete-sparse-layout',
    title: 'Lance Discrete Sparse Layout',
    date: '2026-07-04',
    description: 'A visual design note for Lance sparse structural encoding and why slot-domain mappings improve sparse nested data.',
    cover: '/sketches/lance-discrete-sparse-layout/cover.svg'
  },
  {
    slug: 'lance-blob-write-decoupling',
    title: 'Lance Blob Preparation API',
    date: '2026-07-01',
    description: 'How Lance Blob v2 separates sidecar preparation from data-file writes and existing transactions.'
  },
  {
    slug: 'sq-affine-offset',
    title: 'SQ Affine Offset',
    date: '2026-06-26',
    description: 'Why SQ Dot must use the affine offset.'
  }
]

export function sketchUrl(sketch: Sketch) {
  return `/sketches/${sketch.slug}/index.html`
}

export function getSortedSketches() {
  return [...sketches].sort((a, b) => {
    const byDate = Date.parse(b.date) - Date.parse(a.date)
    if (byDate !== 0) return byDate
    return a.slug.localeCompare(b.slug)
  })
}
