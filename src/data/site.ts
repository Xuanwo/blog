export type MenuItem = {
  name: string
  url: string
  weight?: number
}

export type SiteConfig = {
  baseURL: string
  languageCode: string
  title: string
  pagination: number
  params: {
    smartToc: boolean
    author: string
    keywords: string[]
    description: string
  }
  menu: {
    footer: MenuItem[]
    icon: MenuItem[]
  }
}

export const siteConfig: SiteConfig = {
  baseURL: 'https://xuanwo.io',
  languageCode: 'en-US',
  title: "Xuanwo's Blog",
  pagination: 10,
  params: {
    smartToc: true,
    author: 'Xuanwo',
    keywords: [
      'Technology',
      'Code',
      'Program',
      'Linux'
    ],
    description: 'Achieving Data Freedom Through Open Source and Rust'
  },
  menu: {
    footer: [
      { name: 'about', url: '/about', weight: 1 },
      { name: 'archives', url: '/archives/', weight: 2 },
      { name: 'categories', url: '/categories/', weight: 3 },
      { name: 'tags', url: '/tags/', weight: 4 },
      { name: 'series', url: '/series/', weight: 5 },
      { name: 'sketches', url: '/sketches/', weight: 6 },
      { name: 'links', url: '/links/', weight: 7 },
      { name: 'blogroll', url: '/blogroll/', weight: 8 }
    ],
    icon: [
      { name: 'rss', url: '/index.xml', weight: 1 },
      { name: 'github', url: 'https://github.com/Xuanwo', weight: 2 },
      { name: 'send', url: 'https://t.me/xuanwo_tweets', weight: 3 },
      { name: 'twitter', url: 'https://x.com/xuanwo', weight: 4 }
    ]
  }
}
