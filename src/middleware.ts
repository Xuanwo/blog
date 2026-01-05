import type { MiddlewareHandler } from 'astro'

function isFilePath(pathname: string) {
  const last = pathname.split('/').pop() ?? ''
  return last.includes('.')
}

function redirect(url: URL, pathname: string) {
  const next = new URL(url.toString())
  next.pathname = pathname
  return Response.redirect(next.toString(), 308)
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url)
  const { pathname } = url

  if (pathname === '/404.html') {
    return redirect(url, '/404.html/')
  }

  if (pathname === '/en-US' || pathname.startsWith('/en-US/')) {
    return redirect(url, pathname.replace(/^\/en-US(\/|$)/, '/en-us$1'))
  }

  if (pathname === '/page' || pathname.startsWith('/page/')) {
    // Let the page router handle /page/<n>/.
  }

  const paginatedRssMatch = pathname.match(/^(.*)\/page\/\d+\/index\.xml$/)
  if (paginatedRssMatch) {
    const prefix = paginatedRssMatch[1]
    const target = prefix === '' ? '/index.xml' : `${prefix}/index.xml`
    return redirect(url, target)
  }

  if (pathname !== '/' && !pathname.endsWith('/') && !isFilePath(pathname)) {
    return redirect(url, `${pathname}/`)
  }

  return next()
}
