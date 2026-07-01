import { readFile, writeFile } from 'node:fs/promises'

import cloudflare from '@astrojs/cloudflare'
import { defineConfig, passthroughImageService, sessionDrivers } from 'astro/config'

const cloudflarePagesUnsupportedGeneratedFields = new Map([
  ['definedEnvironments', []],
  ['ai_search_namespaces', []],
  ['ai_search', []],
  ['agent_memory', []],
  ['secrets_store_secrets', []],
  ['artifacts', []],
  ['unsafe_hello_world', []],
  ['flagship', []],
  ['worker_loaders', []],
  ['ratelimits', []],
  ['vpc_services', []],
  ['vpc_networks', []],
  ['python_modules', { exclude: ['**/*.pyc'] }],
  ['previews', {}]
])

const cloudflarePagesUnsupportedGeneratedDevFields = new Map([
  ['enable_containers', true],
  ['generate_types', false]
])

function isSameJsonValue (actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected)
}

function removeGeneratedField (config, field, expectedValue) {
  if (!(field in config)) return false
  if (!isSameJsonValue(config[field], expectedValue)) return false

  delete config[field]
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

        let changed = false

        // Cloudflare Pages reserves env.ASSETS implicitly. The adapter emits the
        // same binding explicitly, which newer Pages config validation rejects.
        if (wranglerConfig.assets?.binding === 'ASSETS') {
          delete wranglerConfig.assets.binding
          changed = true
        }

        for (const [field, expectedValue] of cloudflarePagesUnsupportedGeneratedFields) {
          changed = removeGeneratedField(wranglerConfig, field, expectedValue) || changed
        }

        if (wranglerConfig.dev && typeof wranglerConfig.dev === 'object') {
          for (const [field, expectedValue] of cloudflarePagesUnsupportedGeneratedDevFields) {
            changed = removeGeneratedField(wranglerConfig.dev, field, expectedValue) || changed
          }
        }

        if (!changed) return

        await writeFile(wranglerConfigUrl, JSON.stringify(wranglerConfig))
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
