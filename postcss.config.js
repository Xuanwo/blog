const purgeHTML = require('purgecss-from-html')

const purgeCSS = require('@fullhuman/postcss-purgecss')({
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

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    purgeCSS
  ]
}
