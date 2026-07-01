import cloudflare from '@astrojs/cloudflare'
import { defineConfig, passthroughImageService, sessionDrivers } from 'astro/config'

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
  publicDir: 'static'
})
