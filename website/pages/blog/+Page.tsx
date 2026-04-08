import { useData } from "vike-react/useData";
import { useState } from "react";
import type { BlogData } from "./+data";
import { getStrapiMediaUrl } from "@/lib/strapi";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

export default function Page() {
  const { blogPage, posts, categories } = useData<BlogData>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const title = blogPage?.hero?.title ?? "Latest Articles & Insights";
  const subtitle =
    blogPage?.hero?.subtitle ??
    "Discover practical wisdom, coaching tips, and transformative stories to help you grow.";

  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category?.slug === selectedCategory)
    : posts;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No blog posts found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                const imageUrl = getStrapiMediaUrl(post.featuredImage?.url);
                const date = post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "";

                return (
                  <a
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 block"
                  >
                    {imageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.category && (
                        <span className="text-xs font-medium text-primary uppercase tracking-wider">
                          {post.category.name}
                        </span>
                      )}
                      <h2 className="text-xl font-bold mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {date}
                          {post.readingTimeMinutes && (
                            <> • {post.readingTimeMinutes} min read</>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:translate-x-1 transition-transform"
                        >
                          Read <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Get the latest articles delivered to your inbox.
          </p>
          {/* Newsletter component can be added here */}
        </div>
      </section>
    </div>
  );
}
