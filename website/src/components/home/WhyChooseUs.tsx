import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Lightbulb, Shield } from "lucide-react";
import type { StrapiHomepage } from "@/types/strapi";

const ICON_MAP: Record<string, React.ElementType> = {
  Heart,
  Target,
  Lightbulb,
  Shield,
};

const DEFAULT_FEATURES = [
  { icon: "Heart", title: "Compassionate Approach", description: "A safe, judgment-free space where you can explore your thoughts, feelings, and aspirations with genuine support and empathy." },
  { icon: "Target", title: "Goal-Oriented Results", description: "Structured coaching frameworks that turn your vision into actionable steps, measurable milestones, and lasting transformation." },
  { icon: "Lightbulb", title: "Proven Methodologies", description: "Evidence-based techniques drawn from positive psychology, NLP, and cognitive behavioral coaching — refined over 15+ years." },
  { icon: "Shield", title: "Confidential & Private", description: "Complete confidentiality for executives, entrepreneurs, and public figures. Your journey is personal — and protected." },
];

export default function WhyChooseUs({ homepage }: { homepage: StrapiHomepage | null }) {
  const title = homepage?.whyChooseUsTitle ?? "Guided by Purpose, Driven by Results";
  const subtitle = homepage?.whyChooseUsSubtitle ?? "Discover what makes our coaching approach uniquely effective.";
  const features = homepage?.whyChooseUsFeatures?.length ? homepage.whyChooseUsFeatures : DEFAULT_FEATURES;

  return (
    <section className="py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Why Choose Dr. Obinna
          </p>
          <h2 className="text-3xl md:text-5xl font-bold">
            {title.includes("Driven by Results") ? (
              <>Guided by Purpose,{" "}<span className="text-primary">Driven by Results</span></>
            ) : title}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const IconComponent = ICON_MAP[feature.icon ?? ""] ?? Heart;
            return (
              <Card
                key={feature.title}
                className="bg-card border-border hover:border-primary/40 transition-all duration-500 group hover:-translate-y-2 animate-slide-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
