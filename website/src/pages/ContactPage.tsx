import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone, Mail, Clock, Send, CheckCircle,
  Instagram, Facebook, Twitter, Linkedin, Youtube, Loader2, Globe,
} from "lucide-react";
import { submitForm } from "@/lib/api";
import type { StrapiContactPage, StrapiGlobal } from "@/types/strapi";
import type { HCaptchaRef } from "@/components/ui/h-captcha";
import HCaptcha from "@/components/ui/h-captcha";
import { useTheme } from "@/components/ThemeProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

const DEFAULT_TOPICS = [
  "1-on-1 Coaching Inquiry",
  "Executive Coaching",
  "Group Program / Workshop",
  "Speaking Engagement",
  "Course / Resource Question",
  "Partnership / Collaboration",
  "Media / Press Inquiry",
  "General Question",
];

export default function ContactPage({
  contactPage,
  global,
}: {
  contactPage: StrapiContactPage | null;
  global: StrapiGlobal | null;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [topic, setTopic] = useState("");
  const captchaRef = useRef<HCaptchaRef>(null);
  const theme = useTheme();
  const themeValue = theme.theme === 'dark' ? 'dark' : 'light';

  const heroTitle = contactPage?.hero?.title ?? "Let's Start Your Journey";
  const heroSubtitle = contactPage?.hero?.subtitle ?? "Whether you're ready to begin coaching, have questions about programs, or want to explore a partnership — I'd love to hear from you.";
  const formTitle = contactPage?.formTitle ?? "Send a Message";
  const formSubtitle = contactPage?.formSubtitle ?? "Fill out the form below and I'll personally get back to you within 24 hours.";
  const phone = contactPage?.officePhone ?? global?.phone ?? "(123) 456-7890";
  const email = contactPage?.officeEmail ?? global?.email ?? "hello@drobinnaawiaka.com";
  const officeHours = contactPage?.officeHours ?? "Mon–Fri: 9AM – 6PM\nSat: By appointment";
  const address = contactPage?.officeAddress ?? global?.address ?? "Worldwide — Virtual & In-Person";
  const inquiryTopics = contactPage?.inquiryTopics?.length
    ? contactPage.inquiryTopics.map(t => t.text)
    : DEFAULT_TOPICS;
  const socialLinks = global?.socialLinks ?? [];

  const contactInfo = [
    { icon: Globe, label: "Location", value: address.split("\n")[0], detail: address.split("\n")[1] ?? "Sessions available globally", href: undefined },
    { icon: Phone, label: "Call Us", value: phone, detail: "Mon–Fri, 9AM–5PM EST", href: `tel:${phone.replace(/\D/g, "")}` },
    { icon: Mail, label: "Email", value: email, detail: "Typically responds within 24 hours", href: `mailto:${email}` },
    { icon: Clock, label: "Session Hours", value: officeHours.split("\n")[0], detail: officeHours.split("\n")[1] ?? "", href: undefined },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = captchaRef.current?.getToken();
    if (!token) {
      setError("Please complete the captcha");
      return;
    }
    
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data: Record<string, string> = {};
      formData.forEach((value, key) => { data[key] = value.toString(); });
      data.captchaToken = token;
      data.topic = topic;
      await submitForm("contact", data);
      captchaRef.current?.reset();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3 animate-fade-in">Get In Touch</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-in-up">
            {heroTitle.includes("Journey") ? (
              <>Let's Start Your{" "}<span className="text-primary font-serif italic">Journey</span></>
            ) : heroTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              const Wrapper = item.href ? "a" : "div";
              const wrapperProps = item.href
                ? { href: item.href, target: item.href.startsWith("http") ? "_blank" : undefined, rel: item.href.startsWith("http") ? "noopener noreferrer" : undefined }
                : {};
              return (
                // @ts-expect-error - Wrapper can be either 'a' or 'div'
                <Wrapper
                  key={item.label}
                  {...(wrapperProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                  className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 group animate-slide-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                  <p className="font-semibold text-foreground">{item.value}</p>
                  {item.detail && <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>}
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form + Side */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Form */}
            <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-8 animate-slide-in-left">
              <h2 className="text-2xl font-bold mb-2">{formTitle}</h2>
              <p className="text-muted-foreground mb-8">{formSubtitle}</p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Thank you for reaching out. I'll get back to you within 24 hours. In the meantime, feel free to book a free discovery call.
                  </p>
                  <Button asChild variant="outline" className="mt-4 rounded-xl">
                    <a href="/booking">Book a Discovery Call</a>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" placeholder="John" required className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Doe" required className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic">What Can I Help With?</Label>
                    <Select name="topic" value={topic} onValueChange={setTopic} required>
                      <SelectTrigger id="topic" className="h-12 rounded-xl border-input bg-transparent">
                        <SelectValue placeholder="Select a topic..." />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTopics.map((topic) => (
                          <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" name="message" placeholder="Tell me a bit about what you're looking for..." required className="min-h-[140px] rounded-xl resize-none" />
                  </div>
                  <div className="flex justify-center min-h-[78px]">
                    <HCaptcha ref={captchaRef} theme={themeValue} />
                  </div>
                  <Button type="submit" className="h-12 px-8 rounded-xl" disabled={submitting}>
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>
                    ) : (
                      <><Send className="h-4 w-4 mr-2" />Send Message</>
                    )}
                  </Button>
                  {error && <p className="text-destructive text-sm text-center">{error}</p>}
                </form>
              )}
            </div>

            {/* Side Info */}
            <div className="lg:col-span-2 space-y-6 animate-slide-in-right">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Connect With Me</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Follow along for daily inspiration, coaching tips, and behind-the-scenes content.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(socialLinks.length > 0 ? socialLinks : [
                    { platform: "instagram", url: "https://www.instagram.com/drobinna/", label: "Instagram" },
                    { platform: "facebook", url: "https://www.facebook.com/drobinna/", label: "Facebook" },
                    { platform: "twitter", url: "https://x.com/drobinna", label: "Twitter" },
                    { platform: "linkedin", url: "https://www.linkedin.com/in/drobinna/", label: "LinkedIn" },
                    { platform: "youtube", url: "https://www.youtube.com/@drobinna", label: "YouTube" },
                  ]).map((social) => {
                    const Icon = SOCIAL_ICONS[social.platform] ?? Globe;
                    const label = "label" in social ? social.label : social.platform.charAt(0).toUpperCase() + social.platform.slice(1);
                    return (
                      <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all duration-200 text-sm font-medium"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <h3 className="font-semibold mb-2">Prefer to Talk Live?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Skip the form and book a free 30-minute discovery call. We'll discuss your goals, challenges, and how coaching can help you move forward.
                </p>
                <Button asChild className="rounded-xl w-full">
                  <a href="/booking">Book a Free Discovery Call</a>
                </Button>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold mb-3">Common Questions</h3>
                <div className="space-y-4">
                  {[
                    { q: "Is coaching right for me?", a: "If you're feeling stuck, seeking clarity, or ready to level up in any area of life — coaching can help." },
                    { q: "How do virtual sessions work?", a: "Sessions are conducted via Zoom. You'll receive a private link before each session." },
                    { q: "What's the investment?", a: "Visit our Services page for detailed pricing. A free discovery call is always the best place to start." },
                  ].map((faq) => (
                    <div key={faq.q}>
                      <p className="text-sm font-medium">{faq.q}</p>
                      <p className="text-xs text-muted-foreground mt-1">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
