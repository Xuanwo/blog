import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

import { chromium } from 'playwright'

function parseArgs(argv) {
  const args = {
    url: 'http://localhost:4321',
    out: '.context/layout-shift',
    paths: ['/', '/about']
  }

  for (const raw of argv) {
    if (!raw.startsWith('--')) continue
    const [key, value = ''] = raw.slice(2).split('=')
    if (key === 'url') args.url = value
    if (key === 'out') args.out = value
    if (key === 'paths') {
      args.paths = value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((p) => (p.startsWith('/') ? p : `/${p}`))
    }
  }

  return args
}

function nowStamp() {
  return new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .replace('Z', '')
}

function safeSlug(pathname) {
  if (pathname === '/') return 'root'
  return pathname.replace(/^\//, '').replace(/\/$/, '').replace(/[^\w-]+/g, '_') || 'page'
}

async function measureOne(baseURL, pathname, outDir) {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1536, height: 768 } })

  await context.addInitScript(() => {
    window.__cls = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__cls += entry.value
      }
    })
    observer.observe({ type: 'layout-shift', buffered: true })
  })

  const page = await context.newPage()
  const url = new URL(pathname, baseURL).toString()

  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(250)

  const cls = await page.evaluate(() => window.__cls)
  const headerHeight = await page
    .locator('header')
    .first()
    .evaluate((el) => el.getBoundingClientRect().height)
    .catch(() => null)

  await page.screenshot({ path: join(outDir, 'page.png'), fullPage: false })

  await browser.close()

  return { url, cls, headerHeight }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const runDir = join(args.out, nowStamp())
  mkdirSync(runDir, { recursive: true })

  const summary = []

  for (const pathname of args.paths) {
    const slug = safeSlug(pathname)
    const dir = join(runDir, slug)
    mkdirSync(dir, { recursive: true })

    try {
      const result = await measureOne(args.url, pathname, dir)
      writeFileSync(join(dir, 'result.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8')
      summary.push({ path: pathname, ...result })
    } catch (e) {
      writeFileSync(join(dir, 'error.txt'), `${String(e?.stack ?? e)}\n`, 'utf8')
      summary.push({ path: pathname, url: new URL(pathname, args.url).toString(), error: String(e) })
    }
  }

  writeFileSync(join(runDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8')

  // eslint-disable-next-line no-console
  console.log(`Saved to ${runDir}`)
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})

