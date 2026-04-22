import { strapiClient } from '@/lib/strapi'
import type { StrapiBlogPage, StrapiBlogPost } from '@/types/strapi'

export type BlogData = {
  blogPage: StrapiBlogPage | null
  posts: StrapiBlogPost[]
  categories: { id: number; name: string; slug: string }[]
}

export async function data(): Promise<BlogData> {
  const [blogPage, postsResult, categories] = await Promise.allSettled([
    strapiClient.getBlogPage(),
    strapiClient.getBlogPosts({ pageSize: 12 }),
    strapiClient.getBlogCategories(),
  ])

  if (postsResult.status === 'rejected') {
    console.error('[blog/data] Failed to fetch blog posts:', postsResult.reason)
  }
  if (categories.status === 'rejected') {
    console.error('[blog/data] Failed to fetch categories:', categories.reason)
  }

  const posts = postsResult.status === 'fulfilled' ? postsResult.value.data : []

  return {
    blogPage: blogPage.status === 'fulfilled' ? blogPage.value : null,
    posts,
    categories: categories.status === 'fulfilled'
      ? categories.value.map(c => ({ id: c.id, name: c.name, slug: c.slug }))
      : [],
  }
}