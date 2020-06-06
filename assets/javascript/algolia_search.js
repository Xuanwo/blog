(function () {
  const searchClient = algoliasearch('6ETF8NL8HG', '27c0e8392eb621350efc7697346e28d5')
  const index = searchClient.initIndex('xuanwo_blog')

  autocomplete('#search-box', { hint: false }, [
    {
      source: (query, cb) => {
        index.search(query, { hitsPerPage: 5 }).then((res) => {
          cb(res.hits, res)
        })
      },
      displayKey: 'title'
    }
  ]).on('autocomplete:selected', function (event, suggestion, dataset, context) {
    window.open(suggestion.url, '_self')
  })
})()
