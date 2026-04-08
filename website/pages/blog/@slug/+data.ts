import type { PageContextServer } from 'vike/types'
import { strapiClient } from '@/lib/strapi'
import type { StrapiBlogPost } from '@/types/strapi'

export type BlogPostData = {
  post: StrapiBlogPost | null
  relatedPosts: StrapiBlogPost[]
}

export async function data(pageContext: PageContextServer): Promise<BlogPostData> {
  const slug = pageContext.routeParams?.slug as string

  const [post, relatedPostsResult] = await Promise.allSettled([
    strapiClient.getBlogPostBySlug(slug),
    strapiClient.getBlogPosts({ pageSize: 3 }),
  ])

  const relatedPosts = relatedPostsResult.status === 'fulfilled'
    ? relatedPostsResult.value.data.filter(p => p.slug !== slug).slice(0, 3)
    : []

  return {
    post: post.status === 'fulfilled' ? post.value : null,
    relatedPosts,
  }
}