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
