import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle, CalendarIcon, Loader2, Clock, Video, MapPin, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitForm } from "@/lib/api";
import type { StrapiBookingPage } from "@/types/strapi";
import { disabledDaysToNumbers } from "@/types/strapi";
import type { HCaptchaRef } from "@/components/ui/h-captcha";
import HCaptcha from "@/components/ui/h-captcha";
import { useTheme } from "@/components/ThemeProvider";

const DEFAULT_SESSION_TYPES = [
  { id: "discovery", title: "Free Discovery Call", duration: "30 min", price: "Free", description: "Let's explore if we're the right fit and discuss your goals.", icon: Sparkles },
  { id: "life-coaching", title: "1-on-1 Life Coaching", duration: "60 min", price: "$150", description: "Deep personal coaching session tailored to your journey.", icon: Clock },
  { id: "executive", title: "Executive Coaching", duration: "90 min", price: "$300", description: "Intensive leadership and performance coaching session.", icon: Video },
  { id: "couples", title: "Couples Coaching", duration: "75 min", price: "$200", description: "Strengthen your relationship with guided partner sessions.", icon: MapPin },
];

const DEFAULT_TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

export default function BookingPage({ bookingPage }: { bookingPage: StrapiBookingPage | null }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSession, setSelectedSession] = useState("discovery");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", goals: "", notes: "" });

  const captchaRef = useRef<HCaptchaRef>(null);
  const theme = useTheme();
  const themeValue = theme.theme === 'dark' ? 'dark' : 'light';

  const heroTitle = bookingPage?.hero?.title ?? "Schedule Your Coaching Session";
  const heroSubtitle = bookingPage?.hero?.subtitle ?? "Choose your session type, pick a date and time, and take the first step toward meaningful transformation.";
  const confirmationTitle = bookingPage?.confirmationTitle ?? "Booking Request Submitted!";
  const confirmationMessage = bookingPage?.confirmationMessage ?? "Thank you for scheduling a session. You'll receive a confirmation email within 24 hours with your session details and a calendar invite.";

  const timeSlots = bookingPage?.availableTimeSlots?.length
    ? bookingPage.availableTimeSlots.map(s => s.text)
    : DEFAULT_TIME_SLOTS;

  const disabledDayNumbers = disabledDaysToNumbers(bookingPage?.disabledDays);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      await submitForm("booking", {
        name: `${form.firstName} ${form.lastName}`.trim(),
        ...form,
        sessionType: selectedSession,
        date: selectedDate?.toISOString(),
        time: selectedTime,
        captchaToken: token,
      });
      captchaRef.current?.reset();
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
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
            <CalendarIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Book a Session</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-in-up">
            {heroTitle.includes("Coaching Session") ? (
              <>Schedule Your <span className="text-primary">Coaching Session</span></>
            ) : heroTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Session Types */}
      <section className="py-16 -mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold">Choose Your Session Type</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DEFAULT_SESSION_TYPES.map((session, i) => {
              const Icon = session.icon;
              const isSelected = selectedSession === session.id;
              return (
                <button
                  key={session.id}
                  onClick={() => setSelectedSession(session.id)}
                  className={`text-left bg-card border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group animate-slide-in-up ${
                    isSelected ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border hover:border-primary/40"
                  }`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${isSelected ? "bg-primary/20" : "bg-primary/10"}`}>
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{session.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-bold text-lg">{session.price}</span>
                    <span className="text-muted-foreground text-xs">/ {session.duration}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{session.description}</p>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1.5 text-primary text-xs font-medium">
                      <CheckCircle className="h-3.5 w-3.5" />Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-16 bg-secondary/50 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-6">
          {submitted ? (
            <Card className="bg-card border-primary/30 animate-slide-in-up">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{confirmationTitle}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">{confirmationMessage}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border animate-slide-in-up">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-2">Complete Your Booking</h2>
                <p className="text-muted-foreground mb-8">Fill in your details and choose your preferred date and time.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" required value={form.firstName} onChange={handleChange} className="bg-secondary border-border" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" required value={form.lastName} onChange={handleChange} className="bg-secondary border-border" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="bg-secondary border-border" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} className="bg-secondary border-border" placeholder="(555) 123-4567" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preferred Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal bg-secondary border-border", !selectedDate && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate
                              ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const dayNum = date.getDay();
                              return date < today || (disabledDayNumbers.length > 0 ? disabledDayNumbers.includes(dayNum) : dayNum === 0);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Time *</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 px-1 rounded-lg text-xs font-medium transition-all duration-200 border ${
                              selectedTime === time
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goals">What are your main goals for coaching? *</Label>
                    <Textarea id="goals" name="goals" required value={form.goals} onChange={handleChange} className="bg-secondary border-border min-h-[100px]" placeholder="e.g., career transition, confidence building, work-life balance..." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Anything else we should know?</Label>
                    <Textarea id="notes" name="notes" value={form.notes} onChange={handleChange} className="bg-secondary border-border" placeholder="Preferred meeting platform, timezone, or any other details..." />
                  </div>

                  <HCaptcha ref={captchaRef} theme={themeValue} />

                  <Button type="submit" size="lg" className="w-full text-base" disabled={submitting || !selectedDate || !selectedTime}>
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
                    ) : (
                      <><CalendarIcon className="h-4 w-4 mr-2" />Confirm Booking</>
                    )}
                  </Button>
                  {error && <p className="text-destructive text-sm text-center mt-2">{error}</p>}
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold animate-slide-in-up">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "What happens during a discovery call?", a: "We'll spend 30 minutes discussing your current situation, goals, and challenges. This is a no-pressure conversation to see if coaching is right for you and if we're a good fit to work together." },
              { q: "Are sessions virtual or in-person?", a: "Both options are available! Most clients prefer virtual sessions via Zoom for convenience, but in-person sessions can be arranged depending on location." },
              { q: "How many sessions will I need?", a: "Every journey is unique. Most clients see meaningful results within 6-12 sessions. We'll discuss recommended frequency during your discovery call." },
              { q: "What's your cancellation policy?", a: "Sessions can be rescheduled or cancelled up to 24 hours in advance at no charge. Late cancellations may incur a fee." },
            ].map((faq, i) => (
              <Card key={faq.q} className="bg-card border-border animate-slide-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
