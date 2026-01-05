import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

import { chromium } from 'playwright'

function parseArgs(argv) {
  const args = {
    local: 'http://localhost:4322',
    prod: 'https://xuanwo.io',
    out: '.context/ui-compare',
    paths: ['/']
  }

  for (const raw of argv) {
    if (!raw.startsWith('--')) continue
    const [key, value = ''] = raw.slice(2).split('=')
    if (key === 'local') args.local = value
    if (key === 'prod') args.prod = value
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

async function collectSignals(page) {
  const signals = await page.evaluate(() => {
    const selectors = {
      header: 'header',
      headerTitleLink: 'header h1 a',
      headerDescription: 'header p',
      headerIcons: 'header nav ul li a',
      headerMenuNav: 'header > nav:last-of-type',
      firstPostTitleLink: 'main article ul li h3 a',
      archivesYearLink: 'main > div.mx-auto > div.flex a',
      articleHeader: 'main article header',
      articleHr: 'main article hr'
    }

    const properties = [
      'color',
      'font-size',
      'font-weight',
      'line-height',
      'letter-spacing',
      'text-decoration-line',
      'border-top-width',
      'border-top-style',
      'border-top-color',
      'border-bottom-width',
      'border-bottom-style',
      'border-bottom-color',
      'margin-top',
      'margin-bottom',
      'padding-top',
      'padding-bottom'
    ]

    function normalizeColor(value) {
      if (!value) return value
      const el = document.createElement('div')
      el.style.display = 'none'
      el.style.color = value
      document.body.appendChild(el)
      const resolved = getComputedStyle(el).color
      el.remove()
      return resolved || value
    }

    function snapshotElement(el) {
      if (!el) return null
      const styles = getComputedStyle(el)
      const picked = {}
      for (const name of properties) picked[name] = styles.getPropertyValue(name)

      if (picked.color) picked.color = normalizeColor(picked.color)

      const borderTopWidth = picked['border-top-width']
      const borderTopStyle = picked['border-top-style']
      if (borderTopWidth === '0px' || borderTopStyle === 'none') {
        delete picked['border-top-style']
        delete picked['border-top-color']
      } else if (picked['border-top-color']) {
        picked['border-top-color'] = normalizeColor(picked['border-top-color'])
      }

      const borderBottomWidth = picked['border-bottom-width']
      const borderBottomStyle = picked['border-bottom-style']
      if (borderBottomWidth === '0px' || borderBottomStyle === 'none') {
        delete picked['border-bottom-style']
        delete picked['border-bottom-color']
      } else if (picked['border-bottom-color']) {
        picked['border-bottom-color'] = normalizeColor(picked['border-bottom-color'])
      }

      const rect = el.getBoundingClientRect()
      return {
        styles: picked,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        }
      }
    }

    function snapshotAll(selector) {
      const nodes = Array.from(document.querySelectorAll(selector))
      return nodes.map((el) => snapshotElement(el))
    }

    const result = {}
    for (const [name, selector] of Object.entries(selectors)) {
      if (name === 'headerIcons') {
        result[name] = snapshotAll(selector)
        continue
      }
      result[name] = snapshotElement(document.querySelector(selector))
    }
    return result
  })

  return signals
}

function diffObjects(prefix, a, b, out) {
  if (a === b) return
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    out.push({ key: prefix, local: a, prod: b })
    return
  }

  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  for (const k of keys) {
    diffObjects(prefix ? `${prefix}.${k}` : k, a[k], b[k], out)
  }
}

async function snapshotOne(baseURL, pathname, outDir) {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1536, height: 768 } })
  const page = await context.newPage()

  const url = new URL(pathname, baseURL).toString()
  await page.goto(url, { waitUntil: 'networkidle' })

  const signals = await collectSignals(page)

  const header = page.locator('header')
  if (await header.count()) {
    await header.first().screenshot({ path: join(outDir, 'header.png') })
  }
  await page.screenshot({ path: join(outDir, 'page.png'), fullPage: false })

  writeFileSync(join(outDir, 'signals.json'), `${JSON.stringify(signals, null, 2)}\n`, 'utf8')

  await browser.close()

  return { url, signals }
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

    const localDir = join(dir, 'local')
    const prodDir = join(dir, 'prod')
    mkdirSync(localDir, { recursive: true })
    mkdirSync(prodDir, { recursive: true })

    let local = null
    let prod = null

    try {
      local = await snapshotOne(args.local, pathname, localDir)
    } catch (e) {
      writeFileSync(join(localDir, 'error.txt'), `${String(e?.stack ?? e)}\n`, 'utf8')
    }

    try {
      prod = await snapshotOne(args.prod, pathname, prodDir)
    } catch (e) {
      writeFileSync(join(prodDir, 'error.txt'), `${String(e?.stack ?? e)}\n`, 'utf8')
    }

    const diffs = []
    if (local?.signals && prod?.signals) {
      diffObjects('', local.signals, prod.signals, diffs)
      writeFileSync(join(dir, 'diff.json'), `${JSON.stringify(diffs, null, 2)}\n`, 'utf8')
    }

    summary.push({
      path: pathname,
      local: local?.url ?? null,
      prod: prod?.url ?? null,
      diffs: diffs.length
    })
  }

  writeFileSync(join(runDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`, 'utf8')

  // eslint-disable-next-line no-console
  console.log(`Saved to ${runDir}`)
  // eslint-disable-next-line no-console
  console.log('Tip: open header.png/page.png under each path to compare quickly.')
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e)
  process.exit(1)
})
