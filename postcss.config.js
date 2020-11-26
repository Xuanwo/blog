const purgeHTML = require('purgecss-from-html')


module.exports = {
  plugins: {
    "postcss-import": {},
    tailwindcss: {},
    autoprefixer: {},
    "@fullhuman/postcss-purgecss": {
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
    }
  }
}
