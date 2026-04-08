import { useData } from 'vike-react/useData'
import type { BlogPostData } from './+data'

export default function Head() {
  const { post } = useData<BlogPostData>()
  
  if (!post) {
    return (
      <>
        <title>Post Not Found | Dr Obinna Awiaka</title>
      </>
    )
  }

  const title = post.seo?.metaTitle ?? post.title
  const description = post.seo?.metaDescription ?? post.excerpt

  return (
    <>
      <title>{title} | Dr Obinna Awiaka</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={`https://drobinnaawiaka.com/blog/${post.slug}`} />
      {post.featuredImage?.url && (
        <meta property="og:image" content={post.featuredImage.url} />
      )}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  )
}