import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Mic,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { IMAGES } from "@/lib/images";
import { getStrapiMediaUrl } from "@/lib/strapi";
import type { StrapiServicesPage, StrapiService } from "@/types/strapi";

const ICON_MAP: Record<string, React.ElementType> = {
  Users, Briefcase, GraduationCap, Heart, Mic, BookOpen,
};

const SERVICE_IMAGES: Record<string, string> = {
  "life-coaching": IMAGES.services.lifeCoaching,
  "executive-coaching": IMAGES.services.executive,
  "group-coaching": IMAGES.services.group,
  "relationship-coaching": IMAGES.services.couples,
  speaking: IMAGES.services.speaking,
  workshop: IMAGES.services.speaking,
  "online-course": IMAGES.services.courses,
};

const DEFAULT_PROCESS = [
  { step: "01", title: "Free Discovery Call", description: "We start with a complimentary 30-minute call to understand your goals, challenges, and whether we're the right fit for each other." },
  { step: "02", title: "Personalized Plan", description: "Based on our conversation, I create a customized coaching plan with clear objectives, timelines, and measurable outcomes." },
  { step: "03", title: "Coaching Sessions", description: "Regular sessions where we dive deep, challenge assumptions, build new habits, and track progress toward your goals." },
  { step: "04", title: "Ongoing Growth", description: "Between sessions, you'll have tools, exercises, and support to maintain momentum and integrate changes into daily life." },
];

const FALLBACK_SERVICES = [
  { icon: Users, title: "1-on-1 Life Coaching", image: IMAGES.services.lifeCoaching, price: "From $150/session", description: "Deep, personalized coaching sessions designed to help you gain clarity, overcome limiting beliefs, and create a roadmap for the life you want.", features: ["60-minute sessions (virtual or in-person)", "Personalized goal-setting framework", "Between-session accountability", "Access to exclusive resources", "Email support between sessions"] },
  { icon: Briefcase, title: "Executive & Leadership Coaching", image: IMAGES.services.executive, price: "From $300/session", description: "Elevate your leadership presence, strategic thinking, and team performance with coaching designed for C-suite executives and rising leaders.", features: ["90-minute deep-dive sessions", "360-degree leadership assessment", "Stakeholder interview & analysis", "Custom leadership development plan", "Priority scheduling & support"] },
  { icon: GraduationCap, title: "Group Coaching Programs", image: IMAGES.services.group, price: "From $75/person/session", description: "Small-group experiences (6-12 people) that foster accountability, shared learning, and collective breakthroughs through structured modules.", features: ["12-week structured program", "Weekly 90-minute group sessions", "Private community access", "Peer accountability partners", "Program workbook included"] },
  { icon: Heart, title: "Relationship & Couples Coaching", image: IMAGES.services.couples, price: "From $200/session", description: "Strengthen your relationships with coaching that addresses communication, conflict resolution, intimacy, and shared life vision.", features: ["75-minute couple sessions", "Communication style assessment", "Conflict resolution frameworks", "Shared vision planning", "Individual follow-up sessions"] },
  { icon: Mic, title: "Speaking & Workshops", image: IMAGES.services.speaking, price: "Custom Pricing", description: "Invite Dr. Obinna Awiaka to deliver powerful keynotes, corporate workshops, or retreat facilitation on personal growth, leadership, and transformation.", features: ["Keynote speeches (45-90 min)", "Half-day & full-day workshops", "Corporate retreat facilitation", "Virtual & in-person options", "Custom content for your audience"] },
  { icon: BookOpen, title: "Online Courses & Resources", image: IMAGES.services.courses, price: "From $29", description: "Self-paced digital courses, workbooks, and guided programs for those who want to start their transformation journey on their own schedule.", features: ["Video-based learning modules", "Downloadable workbooks & tools", "Lifetime access to content", "Community forum access", "Certificate of completion"] },
];

export default function ServicesPage({
  servicesPage,
  services,
}: {
  servicesPage: StrapiServicesPage | null;
  services: StrapiService[];
}) {
  const heroTitle = servicesPage?.hero?.title ?? "Services Designed for Your Growth";
  const heroSubtitle = servicesPage?.hero?.subtitle ?? "From personal breakthroughs to organizational transformation, find the right coaching program to accelerate your journey.";
  const processTitle = servicesPage?.processTitle ?? "The Coaching Process";
  const ctaTitle = servicesPage?.ctaTitle ?? "Ready to Start Your Transformation?";
  const ctaDesc = servicesPage?.ctaDescription ?? "Book a free discovery call and let's explore how coaching can help you achieve your most important goals.";

  const processSteps = servicesPage?.processSteps?.length
    ? servicesPage.processSteps.map((s, i) => ({ step: String(i + 1).padStart(2, "0"), ...s }))
    : DEFAULT_PROCESS;

  const faqs = servicesPage?.faqs?.length
    ? servicesPage.faqs
    : [
        { question: "Is coaching right for me?", answer: "If you're feeling stuck, seeking clarity, or ready to level up in any area of life — coaching can help." },
        { question: "How do virtual sessions work?", answer: "Sessions are conducted via Zoom. You'll receive a private link before each session." },
        { question: "What's the investment?", answer: "Visit our Services page for detailed pricing. A free discovery call is always the best place to start." },
      ];

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Coaching Services</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-in-up">
            {heroTitle.includes("Your Growth") ? (
              <>Services Designed for{" "}<span className="text-primary">Your Growth</span></>
            ) : heroTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.length > 0
              ? services.map((service, i) => {
                  const Icon = ICON_MAP[service.icon ?? ""] ?? Users;
                  const serviceImage = getStrapiMediaUrl(service.image?.url) || SERVICE_IMAGES[service.category] || IMAGES.services.lifeCoaching;
                  const features = service.features?.map(f => f.text) ?? [];
                  return (
                    <Card key={service.documentId} className="bg-card border-border hover:border-primary/40 transition-all duration-500 group hover:-translate-y-2 animate-slide-in-up flex flex-col overflow-hidden py-0 gap-0" style={{ animationDelay: `${i * 0.1}s` }}>
                      <CardContent className="p-0 flex flex-col flex-1">
                        <div className="aspect-[16/10] overflow-hidden relative">
                          <img src={serviceImage} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <div className="w-10 h-10 rounded-lg bg-card/90 backdrop-blur-sm flex items-center justify-center border border-border">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                        </div>
                        <div className="p-8 pt-4 flex flex-col flex-1">
                          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                          <p className="text-primary font-semibold text-sm mb-4">{service.priceLabel}</p>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.shortDescription}</p>
                          <ul className="space-y-2.5 mb-8 flex-1">
                            {features.map((feature) => (
                              <li key={feature} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button asChild className="w-full mt-auto"><a href="/booking">Get Started</a></Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              : FALLBACK_SERVICES.map((service, i) => {
                  const Icon = service.icon;
                  return (
                    <Card key={service.title} className="bg-card border-border hover:border-primary/40 transition-all duration-500 group hover:-translate-y-2 animate-slide-in-up flex flex-col overflow-hidden py-0 gap-0" style={{ animationDelay: `${i * 0.1}s` }}>
                      <CardContent className="p-0 flex flex-col flex-1">
                        <div className="aspect-[16/10] overflow-hidden relative">
                          <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3">
                            <div className="w-10 h-10 rounded-lg bg-card/90 backdrop-blur-sm flex items-center justify-center border border-border">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                          </div>
                        </div>
                        <div className="p-8 pt-4 flex flex-col flex-1">
                          <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                          <p className="text-primary font-semibold text-sm mb-4">{service.price}</p>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
                          <ul className="space-y-2.5 mb-8 flex-1">
                            {service.features.map((feature) => (
                              <li key={feature} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <span className="text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Button asChild className="w-full mt-auto"><a href="/booking">Get Started</a></Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-secondary/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 animate-fade-in">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold animate-slide-in-up">
              {processTitle.includes("Coaching Process") ? (
                <>The Coaching <span className="text-primary">Process</span></>
              ) : processTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <Card key={step.title} className="bg-card border-border hover:border-primary/40 transition-colors relative overflow-hidden animate-slide-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardContent className="p-6">
                  <span className="text-5xl font-bold text-primary/10 absolute top-2 right-4">{step.step}</span>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 overflow-hidden">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold animate-slide-in-up">
                {servicesPage?.faqTitle ?? "Frequently Asked"}{" "}
                <span className="text-primary">Questions</span>
              </h2>
            </div>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <Card key={faq.question} className="bg-card border-border animate-slide-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-slide-in-up">
            {ctaTitle.includes("Transformation") ? (
              <>Ready to Start Your{" "}<span className="text-primary">Transformation?</span></>
            ) : ctaTitle}
          </h2>
          <p className="text-muted-foreground text-lg mb-10 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            {ctaDesc}
          </p>
          <Button size="lg" asChild className="text-base px-10 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
            <a href="/booking">
              Book Your Free Discovery Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
