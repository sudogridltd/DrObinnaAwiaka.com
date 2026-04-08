import type { StrapiBlogPost } from '@/types/strapi'
import { getStrapiMediaUrl } from '@/lib/strapi'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight } from 'lucide-react'

interface BlogSectionProps {
  posts: StrapiBlogPost[]
  title?: string
  subtitle?: string
}

export default function BlogSection({ posts, title, subtitle }: BlogSectionProps) {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title || 'Latest Articles'}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">New articles coming soon. Stay tuned!</p>
          </div>
        )}

        {posts.length > 0 && (
          <>
            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {posts.map((post) => {
                const imageUrl = getStrapiMediaUrl(post.featuredImage?.url)
                const date = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : ''

                return (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 block"
                  >
                    {imageUrl && (
                      <div className="aspect-16/10 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {post.category && (
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="text-lg font-bold mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {date}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                        >
                          Read <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Button asChild size="lg">
                <a href="/blog">
                  View All Articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}