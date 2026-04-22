import { render } from 'vike/abort'
import type { PageContextServer } from 'vike/types'
import { strapiClient } from '@/lib/strapi'
import type { StrapiBlogPost } from '@/types/strapi'

export type BlogPostData = {
  post: StrapiBlogPost
  relatedPosts: StrapiBlogPost[]
}

export async function data(pageContext: PageContextServer): Promise<BlogPostData> {
  const slug = pageContext.routeParams?.slug as string

  const [postResult, relatedPostsResult] = await Promise.allSettled([
    strapiClient.getBlogPostBySlug(slug),
    strapiClient.getBlogPosts({ pageSize: 3 }),
  ])

  if (postResult.status === 'rejected') {
    console.error('[blog/@slug/data] Failed to fetch post:', postResult.reason)
    throw render(404, `Blog post "${slug}" not found`)
  }

  const post = postResult.value
  if (!post) {
    throw render(404, `Blog post "${slug}" not found`)
  }

  const relatedPosts = relatedPostsResult.status === 'fulfilled'
    ? relatedPostsResult.value.data.filter(p => p.slug !== slug).slice(0, 3)
    : []

  return { post, relatedPosts }
}
