import { accessSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const REPO_ROOT = process.cwd()
const LEGACY_DIR = join(REPO_ROOT, 'legacy')
const DIST_DIR = join(REPO_ROOT, 'dist')

function ensureTrailingSlash(pathname) {
  if (pathname === '/') return pathname
  if (pathname.endsWith('/')) return pathname
  return `${pathname}/`
}

function isLegacyEnUS(pathname) {
  return pathname.startsWith('/en-US/')
}

function main() {
  const legacyUrlsPath = join(LEGACY_DIR, 'urls.txt')
  const legacyUrls = readFileSync(legacyUrlsPath, 'utf8')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  /** @type {string[]} */
  const missing = []

  for (const raw of legacyUrls) {
    const url = ensureTrailingSlash(raw)
    if (isLegacyEnUS(url)) continue

    const rel = url === '/' ? '' : url.replace(/^\//, '')
    const expected = join(DIST_DIR, rel, 'index.html')
    try {
      accessSync(expected)
    } catch {
      missing.push(url)
    }
  }

  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`Missing ${missing.length} legacy URLs in dist:`)
    for (const u of missing.slice(0, 50)) {
      // eslint-disable-next-line no-console
      console.error(`- ${u}`)
    }
    process.exit(1)
  }
}

main()
