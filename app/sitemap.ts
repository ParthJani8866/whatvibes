import { MetadataRoute } from 'next'

import {
  getInstagramKeywordEntries,
  instagramKeywordBrowseGroups,
  instagramToolRoutes,
} from '@/lib/instagramSeo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bioforig.com'
  const now = new Date()

  const routes = new Set<string>([
    '/',
    '/link-in-my-bio',
    '/about',
    '/contact',
    '/terms-of-service',
    '/privacy-policy',
    ...instagramToolRoutes,
    ...instagramKeywordBrowseGroups.map((g) => `/instagram-keywords/browse/${g}`),
    ...getInstagramKeywordEntries().map((e) => `/instagram-keywords/${e.slug}`),
  ])

  return Array.from(routes).map((path) => ({
    url: path === '/' ? baseUrl : `${baseUrl}${path}`,
    lastModified: now,
  }))
}
