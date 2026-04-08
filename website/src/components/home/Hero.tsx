import { CountUp } from "@/components/ui/count-up";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { getStrapiMediaUrl } from "@/lib/strapi";
import type { StrapiHomepage } from "@/types/strapi";

const DEFAULT_STATS = [
  { value: "500+", label: "Lives Transformed" },
  { value: "15+", label: "Years Experience" },
  { value: "50+", label: "Corporate Clients" },
  { value: "10K+", label: "Community Members" },
];

export default function Hero({ homepage }: { homepage: StrapiHomepage | null }) {
  const stats = homepage?.stats?.length ? homepage.stats : DEFAULT_STATS;
  const heroTitle = homepage?.hero?.title ?? "Transform Your Life, Unlock Your Full Potential";
  const heroSubtitle = homepage?.hero?.subtitle ?? "Expert coaching, transformative workshops, and proven frameworks designed to help you break through barriers, find clarity, and create the life you truly deserve.";
  const heroImage = getStrapiMediaUrl(homepage?.hero?.image?.url) || IMAGES.coach.hero;
  const primaryBtn = homepage?.hero?.buttons?.find(b => b.variant === "primary");
  const outlineBtn = homepage?.hero?.buttons?.find(b => b.variant === "outline");

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background dark:to-[#0a1a18] to-[#e6f7f4]" />
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top_right,_rgba(56,178,172,0.08),_transparent_70%)] bg-[radial-gradient(ellipse_at_top_right,_rgba(13,148,136,0.12),_transparent_70%)]" />
      <div
        className="absolute inset-0 dark:opacity-[0.03] opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(rgba(56,178,172,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,178,172,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-[15%] left-[8%] w-20 h-20 md:w-32 md:h-32 rounded-full bg-primary/5 blur-2xl animate-float hidden md:block" />
      <div className="absolute bottom-[20%] left-[12%] w-16 h-16 md:w-28 md:h-28 rounded-full bg-primary/5 blur-2xl animate-float-slow hidden md:block" />

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 dark:bg-primary/10 bg-primary/15 border border-primary/20 dark:border-primary/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in shadow-sm dark:shadow-none">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                Certified Life Coach &bull; Speaker &bull; Author
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight animate-slide-in-up">
              {heroTitle.includes("Full Potential") ? (
                <>
                  Transform Your Life,
                  <br />
                  Unlock Your
                  <br />
                  <span className="text-primary font-serif italic">
                    Full Potential
                  </span>
                </>
              ) : (
                heroTitle
              )}
            </h1>

            <p
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl lg:max-w-lg leading-relaxed animate-slide-in-up"
              style={{ animationDelay: "0.15s" }}
            >
              {heroSubtitle}
            </p>

            <div
              className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 animate-slide-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Button size="lg" asChild className="text-base px-8">
                <a href={primaryBtn?.url ?? "/booking"}>
                  {primaryBtn?.text ?? "Book a Free Discovery Call"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="text-base px-8 border-border hover:border-primary dark:bg-transparent bg-white/80 backdrop-blur-sm"
              >
                <a href={outlineBtn?.url ?? "/services"}>
                  {outlineBtn?.text ?? "Explore Services"}
                </a>
              </Button>
            </div>
          </div>

          {/* Right: Coach Portrait */}
          <div
            className="relative hidden lg:block animate-slide-in-right"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
                <img
                  src={heroImage}
                  alt="Dr. Obinna Awiaka — Life Coach, Speaker & Author"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-glow-pulse" />
              <div
                className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-glow-pulse"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute -bottom-5 -left-5 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                <p className="text-2xl font-bold text-primary">{stats[0]?.value ?? "500+"}</p>
                <p className="text-xs text-muted-foreground">{stats[0]?.label ?? "Lives Transformed"}</p>
              </div>
              <div
                className="absolute -top-5 -right-5 bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg animate-fade-in"
                style={{ animationDelay: "0.8s" }}
              >
                <p className="text-2xl font-bold text-primary">{stats[1]?.value ?? "15+"}</p>
                <p className="text-xs text-muted-foreground">{stats[1]?.label ?? "Years Experience"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl lg:max-w-4xl mx-auto lg:mx-0 animate-fade-in dark:bg-transparent bg-white/50 dark:backdrop-blur-none backdrop-blur-sm dark:rounded-none rounded-2xl dark:border-0 border border-primary/10 dark:p-0 p-8 dark:shadow-none shadow-sm"
          style={{ animationDelay: "0.5s" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="text-3xl md:text-4xl font-bold text-primary">
                <CountUp value={stat.value} />
              </p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
