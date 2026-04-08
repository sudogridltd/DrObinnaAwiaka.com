import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Briefcase, GraduationCap } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { getStrapiMediaUrl } from "@/lib/strapi";
import type { StrapiHomepage, StrapiService } from "@/types/strapi";

const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  Briefcase,
  GraduationCap,
};

const SERVICE_IMAGES: Record<string, string> = {
  "life-coaching": IMAGES.services.lifeCoaching,
  "executive-coaching": IMAGES.services.executive,
  "group-coaching": IMAGES.services.group,
  "relationship-coaching": IMAGES.services.couples,
  speaking: IMAGES.services.speaking,
  "online-course": IMAGES.services.courses,
};

const FALLBACK_SERVICES = [
  { icon: Users, title: "1-on-1 Life Coaching", image: IMAGES.services.lifeCoaching, description: "Deep, personalized sessions that help you gain clarity, overcome obstacles, and design a life aligned with your values and vision." },
  { icon: Briefcase, title: "Executive & Leadership Coaching", image: IMAGES.services.executive, description: "Elevate your leadership presence, decision-making, and team performance with coaching designed for high-achievers and executives." },
  { icon: GraduationCap, title: "Group Programs & Workshops", image: IMAGES.services.group, description: "Interactive group experiences that foster community, accountability, and collective growth through structured learning modules." },
];

export default function LuxuryShowcase({
  homepage,
  services,
}: {
  homepage: StrapiHomepage | null;
  services: StrapiService[];
}) {
  const sectionTitle = homepage?.servicesShowcaseTitle ?? "Tailored Programs for Every Stage of Growth";
  const sectionSubtitle = homepage?.servicesShowcaseSubtitle ?? "Whether you're an individual seeking personal breakthroughs or an organization investing in your people — we have a program for you.";
  const displayServices = services.slice(0, 3);

  return (
    <section className="py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Coaching Services</p>
          <h2 className="text-3xl md:text-5xl font-bold max-w-3xl mx-auto">
            {sectionTitle.includes("Every Stage of Growth") ? (
              <>Tailored Programs for{" "}<span className="text-primary">Every Stage of Growth</span></>
            ) : sectionTitle}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">{sectionSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {displayServices.length > 0
            ? displayServices.map((service, i) => {
                const IconComponent = ICON_MAP[service.icon ?? ""] ?? Users;
                const serviceImage = getStrapiMediaUrl(service.image?.url) || SERVICE_IMAGES[service.category] || IMAGES.services.lifeCoaching;
                return (
                  <Card key={service.documentId} className="bg-card border-border hover:border-primary/40 transition-all duration-500 group hover:-translate-y-2 animate-slide-in-up overflow-hidden py-0 gap-0" style={{ animationDelay: `${i * 0.15}s` }}>
                    <CardContent className="p-0">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img src={serviceImage} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <div className="w-10 h-10 rounded-lg bg-card/90 backdrop-blur-sm flex items-center justify-center border border-border">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6 pt-4 text-center">
                        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.shortDescription}</p>
                        <Button variant="outline" size="sm" asChild className="rounded-full">
                          <a href="/services">Learn More</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            : FALLBACK_SERVICES.map((service, i) => {
                const Icon = service.icon;
                return (
                  <Card key={service.title} className="bg-card border-border hover:border-primary/40 transition-all duration-500 group hover:-translate-y-2 animate-slide-in-up overflow-hidden py-0 gap-0" style={{ animationDelay: `${i * 0.15}s` }}>
                    <CardContent className="p-0">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <div className="w-10 h-10 rounded-lg bg-card/90 backdrop-blur-sm flex items-center justify-center border border-border">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6 pt-4 text-center">
                        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
                        <Button variant="outline" size="sm" asChild className="rounded-full">
                          <a href="/services">Learn More</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 animate-slide-in-left">
            <div className="aspect-square rounded-2xl overflow-hidden border border-border relative">
              <img src={IMAGES.backgrounds.inspiration} alt="Dr. Obinna Awiaka — growth and transformation" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30 flex items-end justify-center">
                <div className="p-10 text-center pb-14">
                  <p className="text-5xl md:text-7xl font-bold text-primary/20 font-serif">&ldquo;</p>
                  <p className="text-lg md:text-xl text-foreground leading-relaxed italic -mt-4">
                    The greatest discovery in life is self-discovery. Until you find yourself, you will always be someone else.
                  </p>
                  <p className="mt-6 text-sm text-primary font-semibold">— Dr. Obinna Awiaka</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Live a Life That{" "}<span className="text-primary">Inspires You</span>
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              Dr. Obinna Awiaka&apos;s coaching philosophy combines ancient wisdom with modern psychology to create a holistic approach to personal transformation. Whether you&apos;re seeking career growth, better relationships, or inner peace — the journey starts with a single step.
            </p>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Join thousands who have already discovered what&apos;s possible when you invest in yourself.
            </p>
            <Button asChild className="mt-8" size="lg">
              <a href="/booking">
                Begin Your Journey Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
