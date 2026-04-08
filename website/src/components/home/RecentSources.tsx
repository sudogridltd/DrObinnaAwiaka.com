import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { getStrapiMediaUrl } from "@/lib/strapi";
import type { StrapiTestimonial } from "@/types/strapi";

const FALLBACK_TESTIMONIALS = [
  { name: "Sarah M.", role: "Marketing Director", text: "Dr. Obinna Awiaka helped me gain the clarity I desperately needed during a major career transition. His coaching style is both challenging and deeply supportive. I landed my dream role within 3 months." },
  { name: "James K.", role: "Entrepreneur", text: "The executive coaching program completely transformed how I lead my team. Revenue grew 40% and my stress levels dropped significantly. Dr. Obinna Awiaka's frameworks are practical and powerful." },
  { name: "Dr. Amara O.", role: "Physician", text: "I was burned out and questioning everything. Through coaching with Dr. Obinna Awiaka, I rediscovered my purpose and created boundaries that protect my well-being. Life-changing experience." },
  { name: "Michael T.", role: "Software Engineer", text: "The group coaching program introduced me to an incredible community. The accountability, the insights, and the personal breakthroughs have been extraordinary. Highly recommend." },
  { name: "Grace L.", role: "Non-Profit Leader", text: "Dr. Obinna Awiaka's approach is holistic and deeply thoughtful. He helped me align my personal values with my professional mission. Our organization's impact has grown 3x since I started coaching." },
  { name: "David R.", role: "Finance Executive", text: "I was skeptical about life coaching, but Dr. Obinna Awiaka's evidence-based approach won me over. The results speak for themselves — better relationships, clearer thinking, and genuine fulfillment." },
];

export default function RecentSources({ testimonials }: { testimonials: StrapiTestimonial[] }) {
  const useFallback = testimonials.length === 0;

  return (
    <section className="py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Success Stories</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            What Our <span className="text-primary">Clients Say</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Real stories from real people who chose to invest in themselves and experienced transformational results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useFallback
            ? FALLBACK_TESTIMONIALS.map((t, i) => (
                <Card key={t.name} className="bg-card border-border hover:border-primary/40 transition-all duration-500 group overflow-hidden hover:-translate-y-2 animate-slide-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <CardContent className="p-6">
                    <Quote className="h-8 w-8 text-primary/30 mb-4" />
                    <p className="text-muted-foreground leading-relaxed mb-6 italic text-sm">&ldquo;{t.text}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
                        <span className="text-primary font-bold text-sm">{t.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : testimonials.map((t, i) => {
                const avatarUrl = getStrapiMediaUrl(t.avatar?.url);
                return (
                  <Card key={t.documentId} className="bg-card border-border hover:border-primary/40 transition-all duration-500 group overflow-hidden hover:-translate-y-2 animate-slide-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <CardContent className="p-6">
                      <Quote className="h-8 w-8 text-primary/30 mb-4" />
                      <p className="text-muted-foreground leading-relaxed mb-6 italic text-sm">&ldquo;{t.quote}&rdquo;</p>
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                            <img src={avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
                            <span className="text-primary font-bold text-sm">{t.clientName.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm">{t.clientName}</p>
                          <p className="text-xs text-muted-foreground">{t.clientTitle ?? t.clientCompany ?? ""}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </div>
    </section>
  );
}
