import type { ReactNode } from 'react'
import { useData } from 'vike-react/useData'
import type { BlogPostData } from './+data'
import { getStrapiMediaUrl } from '@/lib/strapi'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowLeft, Clock } from 'lucide-react'

export default function Page() {
  const { post, relatedPosts } = useData<BlogPostData>()

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Button asChild>
            <a href="/blog">Back to Blog</a>
          </Button>
        </div>
      </div>
    )
  }

  const imageUrl = getStrapiMediaUrl(post.featuredImage?.url)
  const authorPhotoUrl = getStrapiMediaUrl(post.authorPhoto?.url)
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <div className="min-h-screen bg-background">
      {/* Back Link */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <Button variant="ghost" asChild className="mb-6">
          <a href="/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </a>
        </Button>
      </div>

      {/* Hero Image */}
      {imageUrl && (
        <div className="max-w-5xl mx-auto px-6 mb-12">
          <div className="aspect-21/9 rounded-2xl overflow-hidden">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 pb-16">
        {/* Header */}
        <header className="mb-12">
          {post.category && (
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              {post.category.name}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">{post.title}</h1>
          <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>

          {/* Meta */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {authorPhotoUrl ? (
                <img
                  src={authorPhotoUrl}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {post.authorName.charAt(0)}
                  </span>
                </div>
              )}
              <span className="font-medium text-foreground">{post.authorName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {publishedDate}
            </div>
            {post.readingTimeMinutes && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readingTimeMinutes} min read
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:mt-8 prose-h1:text-3xl prose-h2:text-2xl prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
          {renderBlocks(post.content)}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-secondary text-muted-foreground text-sm rounded-full"
                >
                  {tag.text}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-secondary/50">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => {
                const relatedImageUrl = getStrapiMediaUrl(related.featuredImage?.url)
                return (
                  <a
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-colors block"
                  >
                    {relatedImageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedImageUrl}
                          alt={related.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2">{related.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// ─── Blocks renderer ────────────────────────────────────────────────────────

function renderInlineChildren(children: unknown[]): ReactNode[] {
  return (children ?? []).map((child: unknown, i: number) => {
    const c = child as Record<string, unknown>

    if (c['type'] === 'link') {
      const url = c['url'] as string
      const linkChildren = c['children'] as unknown[] ?? []
      return (
        <a
          key={i}
          href={url}
          target={url?.startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {renderInlineChildren(linkChildren)}
        </a>
      )
    }

    const text = c['text'] as string
    if (!text) return null

    let node: ReactNode = text
    if (c['code']) node = <code key={`c${i}`} className="bg-secondary px-1 rounded text-sm font-mono">{node}</code>
    if (c['bold']) node = <strong key={`b${i}`}>{node}</strong>
    if (c['italic']) node = <em key={`e${i}`}>{node}</em>
    if (c['underline']) node = <u key={`u${i}`}>{node}</u>
    if (c['strikethrough']) node = <s key={`s${i}`}>{node}</s>

    return <span key={i}>{node}</span>
  })
}

function renderBlocks(content: unknown): ReactNode {
  if (!content || !Array.isArray(content)) return null

  return content.map((block: unknown, index: number) => {
    const b = block as Record<string, unknown>
    const children = b['children'] as unknown[] ?? []

    switch (b['type']) {
      case 'paragraph': {
        return <p key={index}>{renderInlineChildren(children)}</p>
      }
      case 'heading': {
        const level = (b['level'] as number) ?? 2
        const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
        return <Tag key={index}>{renderInlineChildren(children)}</Tag>
      }
      case 'list': {
        const ListTag = b['format'] === 'ordered' ? 'ol' : 'ul'
        return (
          <ListTag key={index}>
            {children.map((item: unknown, i: number) => {
              const it = item as Record<string, unknown>
              const itemChildren = it['children'] as unknown[] ?? []
              return <li key={i}>{renderInlineChildren(itemChildren)}</li>
            })}
          </ListTag>
        )
      }
      case 'quote': {
        return (
          <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-6">
            {renderInlineChildren(children)}
          </blockquote>
        )
      }
      case 'code': {
        const code = children.map((c: unknown) => ((c as Record<string, unknown>)['text'] ?? '')).join('')
        return (
          <pre key={index} className="bg-secondary rounded-lg p-4 overflow-x-auto my-6 text-sm font-mono">
            <code>{code}</code>
          </pre>
        )
      }
      case 'image': {
        const img = b['image'] as Record<string, unknown> | undefined
        const src = getStrapiMediaUrl(img?.['url'] as string | undefined)
        const alt = (img?.['alternativeText'] as string) ?? ''
        if (!src) return null
        return (
          <figure key={index} className="my-8">
            <img src={src} alt={alt} className="w-full rounded-xl" />
            {typeof img?.['caption'] === 'string' && img['caption'] && (
              <figcaption className="text-center text-sm text-muted-foreground mt-2">
                {img['caption']}
              </figcaption>
            )}
          </figure>
        )
      }
      default:
        return null
    }
  })
}
