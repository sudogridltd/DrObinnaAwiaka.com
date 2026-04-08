import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { IMAGES } from "@/lib/images";
import { getStrapiMediaUrl } from "@/lib/strapi";
import type { StrapiHomepage } from "@/types/strapi";

const DEFAULT_FEATURES = [
  "Personalized 1-on-1 coaching sessions",
  "Actionable strategies tailored to your goals",
  "Ongoing accountability & support",
  "Access to exclusive resources & community",
];

export default function DriveWithAssurance({ homepage }: { homepage: StrapiHomepage | null }) {
  const title = homepage?.assuranceTitle ?? "Stop Settling for Less. Start Living With Purpose";
  const subtitle = homepage?.assuranceSubtitle ?? "Your Transformation Starts Here";
  const description = homepage?.assuranceDescription ?? "Whether you're navigating a career transition, seeking personal growth, or building stronger relationships — Dr. Obinna Awiaka's coaching gives you the clarity, confidence, and accountability to make lasting change.";
  const assuranceImage = getStrapiMediaUrl(homepage?.assuranceImage?.url) || IMAGES.coach.session;
  const features = homepage?.assuranceFeatures?.length
    ? homepage.assuranceFeatures.map(f => f.title)
    : DEFAULT_FEATURES;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-in-left">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">{subtitle}</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              {title.includes("Living With Purpose") ? (
                <>Stop Settling for Less.{" "}<span className="text-primary">Start Living With Purpose</span></>
              ) : title}
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">{description}</p>

            <ul className="mt-8 space-y-4">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Button asChild className="mt-8" size="lg">
              <a href="/booking">
                Start Your Transformation
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="relative animate-slide-in-right">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-xl">
              <img src={assuranceImage} alt="Dr. Obinna Awiaka in a coaching session" className="w-full h-full object-cover" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
                  <img src={IMAGES.coach.hero} alt="Dr. Obinna Awiaka" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Dr. Obinna Awiaka</h3>
                  <p className="text-xs text-muted-foreground">Life Coach, Speaker & Author</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["ICF Certified", "15+ Years", "Speaker", "Author"].map((tag) => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-glow-pulse" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
