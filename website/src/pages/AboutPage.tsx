import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CountUp } from "@/components/ui/count-up";
import { Button } from "@/components/ui/button";
import {
  Target,
  Heart,
  HeartHandshake,
  Users,
  Clock,
  Award,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { IMAGES } from "@/lib/images";
import { getStrapiMediaUrl } from "@/lib/strapi";
import type { StrapiAboutPage } from "@/types/strapi";

const DEFAULT_STATS = [
  { value: "500+", label: "Lives Transformed", icon: Users },
  { value: "15+", label: "Years Experience", icon: Clock },
  { value: "50+", label: "Corporate Clients", icon: Award },
  { value: "3", label: "Published Books", icon: BookOpen },
];

const STAT_ICONS = [Users, Clock, Award, BookOpen];

const DEFAULT_CERTIFICATIONS = [
  "ICF Professional Certified Coach (PCC)",
  "Certified NLP Practitioner",
  "DISC Assessment Certified",
  "Mental Health First Aid Certified",
  "Positive Psychology Certification",
  "Executive Leadership Coach",
];

export default function AboutPage({
  aboutPage,
}: {
  aboutPage: StrapiAboutPage | null;
}) {
  const heroTitle =
    aboutPage?.hero?.title ??
    "Empowering People to Live With Purpose & Passion";
  const heroSubtitle =
    aboutPage?.hero?.subtitle ??
    "Dr. Obinna Awiaka is a certified life coach, international speaker, and bestselling author with over 15 years of experience helping individuals and organizations unlock their full potential. His approach blends evidence-based psychology with practical wisdom to create lasting transformation.";
  const profilePhoto =
    getStrapiMediaUrl(aboutPage?.profilePhoto?.url) || IMAGES.coach.about;

  const stats = aboutPage?.stats?.length
    ? aboutPage.stats.map((s, i) => ({
        ...s,
        icon: STAT_ICONS[i % STAT_ICONS.length],
      }))
    : DEFAULT_STATS;

  const certifications = aboutPage?.credentials?.length
    ? aboutPage.credentials.map((c) => c.text)
    : DEFAULT_CERTIFICATIONS;

  const bioParagraphs: string[] = aboutPage?.bio
    ? aboutPage.bio
        .filter((block) => block.type === "paragraph")
        .map(
          (block) =>
            (block.children as Array<{ text?: string }>)
              ?.map((child) => child.text ?? "")
              .join("") ?? "",
        )
        .filter(Boolean)
    : [
        "My journey into coaching began after a successful 10-year career in corporate leadership. Despite external success, I felt a deep calling to help others navigate the same challenges I had overcome — burnout, imposter syndrome, and the struggle to find authentic purpose.",
        "I invested years in rigorous training, earning certifications from the International Coach Federation and mastering techniques in NLP, positive psychology, and transformational leadership.",
        "Today, I serve clients across 15+ countries, helping them move from surviving to thriving. My books, workshops, and online courses have reached thousands of people worldwide.",
      ];

  return (
    <>
      {/* Hero with Portrait */}
      <section className="py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 animate-fade-in">
                About Dr. Obinna Awiaka
              </p>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-slide-in-up">
                {heroTitle.includes("Purpose & Passion") ? (
                  <>
                    Empowering People to Live{" "}
                    <span className="text-primary">With Purpose & Passion</span>
                  </>
                ) : (
                  heroTitle
                )}
              </h1>
              <p
                className="mt-6 text-lg text-muted-foreground leading-relaxed animate-slide-in-up"
                style={{ animationDelay: "0.1s" }}
              >
                {heroSubtitle}
              </p>
              <Button
                asChild
                className="mt-8 animate-slide-in-up"
                size="lg"
                style={{ animationDelay: "0.2s" }}
              >
                <a href="/booking">
                  Work With Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div
              className="relative animate-slide-in-right"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10">
                <img
                  src={profilePhoto}
                  alt="Dr. Obinna Awiaka"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-primary/10 rounded-full blur-2xl animate-glow-pulse" />
              <div
                className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-glow-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-secondary/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="animate-slide-in-left">
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">
                My Mission
              </p>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                Making Personal Growth{" "}
                <span className="text-primary">Accessible & Actionable</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                I believe that every person has the power to create an
                extraordinary life. My mission is to bridge the gap between
                where you are and where you want to be — through compassionate
                coaching, proven frameworks, and unwavering accountability. I
                serve individuals from all walks of life, from corporate
                executives to aspiring entrepreneurs, helping them find clarity,
                build confidence, and take meaningful action.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-in-right">
              {[
                {
                  icon: Target,
                  title: "Purpose-Driven",
                  description:
                    "Every coaching engagement starts with identifying your core purpose and aligning your actions with your deepest values.",
                },
                {
                  icon: Heart,
                  title: "Holistic Approach",
                  description:
                    "We address all dimensions of your life — career, relationships, health, and spirituality — for total well-being.",
                },
                {
                  icon: HeartHandshake,
                  title: "Lasting Partnerships",
                  description:
                    "Coaching is a partnership. I walk alongside you as a guide, challenger, and champion of your growth.",
                },
                {
                  icon: Award,
                  title: "Certified Excellence",
                  description:
                    "ICF-certified with extensive training in NLP, positive psychology, and executive leadership development.",
                },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="bg-card border-border hover:border-primary/40 transition-colors"
                >
                  <CardContent className="p-5">
                    <item.icon className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center animate-slide-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  <CountUp value={stat.value} />
                </p>
                <p className="text-sm text-muted-foreground mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-7xl mx-auto bg-border" />

      {/* Certifications & Journey */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 animate-fade-in">
                My Journey
              </p>
              <h2 className="text-3xl md:text-5xl font-bold animate-slide-in-up mb-6">
                From Corporate to <span className="text-primary">Coaching</span>
              </h2>
              <div className="aspect-[16/9] rounded-xl overflow-hidden border border-border mb-8 shadow-lg">
                <img
                  src={IMAGES.backgrounds.speaking}
                  alt="Dr. Obinna speaking on stage"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {bioParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <Button asChild className="mt-8" size="lg">
                <a href="/booking">
                  Work With Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 animate-fade-in">
                Credentials
              </p>
              <h2 className="text-3xl md:text-4xl font-bold animate-slide-in-up mb-6">
                {aboutPage?.credentialsTitle ? (
                  aboutPage.credentialsTitle
                ) : (
                  <>
                    Certifications &{" "}
                    <span className="text-primary">Training</span>
                  </>
                )}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((cert, i) => (
                  <Card
                    key={cert}
                    className="bg-card border-border hover:border-primary/40 transition-colors animate-slide-in-up"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Award className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm font-medium">{cert}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
