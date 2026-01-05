import cloudflare from '@astrojs/cloudflare'
import { defineConfig, passthroughImageService } from 'astro/config'

export default defineConfig({
  output: 'server',
  trailingSlash: 'ignore',
  adapter: cloudflare({ imageService: 'passthrough' }),
  image: {
    service: passthroughImageService()
  },
  session: {
    driver: 'memory'
  },
  publicDir: 'static'
})
