import type { PageContextServer } from 'vike/types'
import { strapiClient } from '@/lib/strapi'
import type { StrapiHomepage, StrapiService, StrapiTestimonial, StrapiBlogPost } from '@/types/strapi'

export type HomeData = {
  homepage: StrapiHomepage | null
  featuredServices: StrapiService[]
  testimonials: StrapiTestimonial[]
  recentPosts: StrapiBlogPost[]
}

export async function data(_pageContext: PageContextServer): Promise<HomeData> {
  const [homepage, featuredServices, testimonials, postsResult] = await Promise.allSettled([
    strapiClient.getHomepage(),
    strapiClient.getServices({ featured: true }),
    strapiClient.getTestimonials({ featured: true, limit: 6 }),
    strapiClient.getBlogPosts({ pageSize: 3 }),
  ])

  const recentPosts = postsResult.status === 'fulfilled' 
    ? postsResult.value.data 
    : []

  return {
    homepage: homepage.status === 'fulfilled' ? homepage.value : null,
    featuredServices: featuredServices.status === 'fulfilled' ? featuredServices.value : [],
    testimonials: testimonials.status === 'fulfilled' ? testimonials.value : [],
    recentPosts,
  }
}
