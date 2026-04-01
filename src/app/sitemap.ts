import type { MetadataRoute } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const payload = await getPayload({ config: configPromise })

  type FindArgs = Parameters<typeof payload.find>[0]
  type CollectionSlug = FindArgs['collection']

  const [pagesResult, postsResult] = await Promise.all([
    payload.find({
      collection: 'pages' as unknown as CollectionSlug,
      limit: 1000,
      depth: 0,
    }),
    payload.find({
      collection: 'posts' as unknown as CollectionSlug,
      limit: 1000,
      depth: 0,
      sort: '-publishedAt',
    }),
  ])

  const pages = (pagesResult.docs || []) as { slug?: string; updatedAt?: string }[]
  const posts = (postsResult.docs || []) as { slug?: string; updatedAt?: string; publishedAt?: string }[]

  const entries: MetadataRoute.Sitemap = []

  for (const page of pages) {
    if (!page.slug) continue
    const url = page.slug === 'home' ? `${siteUrl}/` : `${siteUrl}/${page.slug}`
    entries.push({
      url,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
    })
  }

  for (const post of posts) {
    if (!post.slug) continue
    entries.push({
      url: `${siteUrl}/actualites/${post.slug}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt)
        : post.publishedAt
          ? new Date(post.publishedAt)
          : undefined,
    })
  }

  return entries
}
