import { readFile, writeFile } from 'node:fs/promises'

import cloudflare from '@astrojs/cloudflare'
import { defineConfig, passthroughImageService, sessionDrivers } from 'astro/config'

const cloudflarePagesConfigFields = new Set([
  'pages_build_output_dir',
  'name',
  'compatibility_date',
  'compatibility_flags',
  'send_metrics',
  'no_bundle',
  'limits',
  'placement',
  'vars',
  'durable_objects',
  'kv_namespaces',
  'queues',
  'r2_buckets',
  'd1_databases',
  'vectorize',
  'hyperdrive',
  'services',
  'analytics_engine_datasets',
  'ai',
  'version_metadata',
  'mtls_certificates',
  'browser',
  'upload_source_maps'
])

function hasMeaningfulValue (value) {
  if (value == null) return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Object.values(value).some(hasMeaningfulValue)
  return true
}

function cloudflarePagesWranglerConfigFix () {
  let serverDir

  return {
    name: 'xuanwo:cloudflare-pages-wrangler-config',
    hooks: {
      'astro:config:done': ({ config }) => {
        serverDir = config.build.server
      },
      'astro:build:done': async ({ logger }) => {
        if (!serverDir) return

        const wranglerConfigUrl = new URL('wrangler.json', serverDir)
        let raw
        try {
          raw = await readFile(wranglerConfigUrl, 'utf8')
        } catch (err) {
          if (err && typeof err === 'object' && err.code === 'ENOENT') return
          throw err
        }

        const wranglerConfig = JSON.parse(raw)
        if (!wranglerConfig.pages_build_output_dir) return

        const pagesConfig = {
          pages_build_output_dir: '../client'
        }

        for (const [field, value] of Object.entries(wranglerConfig)) {
          if (!cloudflarePagesConfigFields.has(field)) continue
          if (field === 'pages_build_output_dir') continue
          if (!hasMeaningfulValue(value)) continue

          pagesConfig[field] = value
        }

        await writeFile(wranglerConfigUrl, JSON.stringify(pagesConfig))
        logger.info('Sanitized Cloudflare Pages Wrangler config.')
      }
    }
  }
}

export default defineConfig({
  output: 'server',
  trailingSlash: 'ignore',
  adapter: cloudflare({
    imageService: 'passthrough',
    prerenderEnvironment: 'node'
  }),
  image: {
    service: passthroughImageService()
  },
  session: {
    driver: sessionDrivers.memory()
  },
  integrations: [
    cloudflarePagesWranglerConfigFix()
  ],
  publicDir: 'static'
})
