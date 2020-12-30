const postcssImport = require('postcss-import')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const purgeHTML = require('purgecss-from-html')
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    postcssImport,
    tailwindcss,
    autoprefixer,
    purgecss({
      content: [
        'layouts/**/*.html'
      ],
      safelist: ['.highlight', /^[a-z]+$/g],
      extractors: [
        {
          extractor: purgeHTML,
          extensions: ['html']
        }
      ]
    })
  ]
}
