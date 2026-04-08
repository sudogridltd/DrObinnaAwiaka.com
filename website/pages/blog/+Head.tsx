import { useData } from 'vike-react/useData'
import type { BlogData } from './+data'

export default function Head() {
  const { blogPage } = useData<BlogData>()
  const title = blogPage?.seo?.metaTitle ?? 'Blog | Articles & Insights — Dr Obinna Awiaka'
  const description = blogPage?.seo?.metaDescription ?? 'Discover practical wisdom, coaching tips, and transformative stories to help you grow. Read the latest articles from Dr Obinna Awiaka.'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content="https://drobinnaawiaka.com/blog" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  )
}