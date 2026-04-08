import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ShoppingCart,
  BookOpen,
  Video,
  FileText,
  Star,
  CheckCircle,
  ArrowRight,
  X,
  Sparkles,
} from "lucide-react";
import { IMAGES } from "@/lib/images";
import { getStrapiMediaUrl } from "@/lib/strapi";
import type { StrapiProduct, StrapiProductCategory } from "@/types/strapi";

const CATEGORY_ICONS: Record<StrapiProductCategory, React.ElementType> = {
  course: Video,
  ebook: BookOpen,
  bundle: Sparkles,
  resource: FileText,
};

const PRODUCT_IMAGES: string[] = [
  IMAGES.shop.purposeMastery,
  IMAGES.shop.leadershipBlueprint,
  IMAGES.shop.breakthroughJournal,
  IMAGES.shop.mindsetReset,
  IMAGES.shop.completeBundle,
  IMAGES.shop.meditationSeries,
];

const categories = [
  { id: "all", label: "All Products" },
  { id: "course", label: "Courses" },
  { id: "ebook", label: "Ebooks" },
  { id: "resource", label: "Resources" },
  { id: "bundle", label: "Bundles" },
];

function ProductDetailDialog({
  product,
  open,
  onOpenChange,
  imageUrl,
}: {
  product: StrapiProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
}) {
  if (!product) return null;
  const Icon = CATEGORY_ICONS[product.category] ?? BookOpen;
  const features = product.features?.map(f => f.text) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[95vw] p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">{product.title}</DialogTitle>
        <div className="aspect-[16/9] overflow-hidden relative">
          <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-card border border-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold">{product.title}</h3>
                {product.badge && <Badge className="text-[10px]">{product.badge}</Badge>}
              </div>
              <div className="flex items-center gap-3">
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                )}
                {product.studentsCount && (
                  <span className="text-sm text-muted-foreground">{product.studentsCount.toLocaleString()} students</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-muted-foreground leading-relaxed">{product.shortDescription}</p>
          {features.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">What's Included:</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>
            <Button size="lg" asChild={!!product.purchaseUrl}>
              {product.purchaseUrl ? (
                <a href={product.purchaseUrl} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="h-4 w-4 mr-2" />Buy Now
                </a>
              ) : (
                <span><ShoppingCart className="h-4 w-4 mr-2 inline" />Add to Cart</span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ShopPage({ products }: { products: StrapiProduct[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<StrapiProduct | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const getProductImage = (product: StrapiProduct, index: number): string =>
    getStrapiMediaUrl(product.image?.url) || PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const openProduct = (product: StrapiProduct, imageUrl: string) => {
    setSelectedProduct(product);
    setSelectedImageUrl(imageUrl);
    setDialogOpen(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <ShoppingCart className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Resources & Courses</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-in-up">
            Invest in Your <span className="text-primary">Growth</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            Self-paced courses, guided journals, meditation series, and toolkits — everything you need to accelerate your personal transformation journey.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border sticky top-[73px] z-40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              {products.length === 0 ? "Loading products..." : "No products in this category."}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, i) => {
                const Icon = CATEGORY_ICONS[product.category] ?? BookOpen;
                const imageUrl = getProductImage(product, i);
                return (
                  <Card
                    key={product.documentId}
                    className="bg-card border-border hover:border-primary/40 transition-all duration-500 group overflow-hidden hover:-translate-y-2 animate-slide-in-up cursor-pointer py-0 gap-0"
                    style={{ animationDelay: `${i * 0.1}s` }}
                    onClick={() => openProduct(product, imageUrl)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                        {product.badge && (
                          <div className="absolute top-3 right-3">
                            <Badge className="text-[10px]">{product.badge}</Badge>
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3">
                          <div className="w-10 h-10 rounded-lg bg-card/90 backdrop-blur-sm flex items-center justify-center border border-border">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6 pb-0">
                        <Badge variant="secondary" className="mb-3 text-xs capitalize">{product.category}</Badge>
                        <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{product.shortDescription}</p>
                      </div>
                      <div className="px-6 pb-6 pt-4 border-t border-border mt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-primary">${product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                            )}
                          </div>
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">{product.rating}</span>
                            </div>
                          )}
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          View Details <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Why Learn With <span className="text-primary">Dr. Obinna Awiaka?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Lifetime Access", description: "Purchase once, learn forever. All courses include lifetime access and free updates." },
              { title: "Money-Back Guarantee", description: "Not satisfied? Get a full refund within 30 days, no questions asked." },
              { title: "Expert Support", description: "Get answers to your questions through community forums and live Q&A sessions." },
            ].map((item, i) => (
              <div key={item.title} className="animate-slide-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductDetailDialog
        product={selectedProduct}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        imageUrl={selectedImageUrl}
      />
    </>
  );
}
