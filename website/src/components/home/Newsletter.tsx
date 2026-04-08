import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";
import { submitForm } from "@/lib/api";
import type { HCaptchaRef } from "@/components/ui/h-captcha";
import HCaptcha from "@/components/ui/h-captcha";
import { useTheme } from "@/components/ThemeProvider";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const captchaRef = useRef<HCaptchaRef>(null);
  const theme = useTheme();
  const themeValue = theme.theme === 'dark' ? 'dark' : 'light';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    const token = captchaRef.current?.getToken();
    if (!token) {
      setError("Please complete the captcha");
      return;
    }
    
    setSubmitting(true);
    setError("");
    try {
      await submitForm("newsletter", { email, captchaToken: token });
      captchaRef.current?.reset();
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-card border border-border rounded-2xl p-12 md:p-16 text-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Get Weekly Inspiration
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Join 10,000+ subscribers who receive weekly coaching insights,
              motivation, and exclusive resources to help you grow and thrive.
            </p>

            {submitted ? (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-primary font-medium">
                  Welcome aboard! Check your inbox for a welcome gift.
                </p>
              </div>
            ) : (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto items-center"
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-secondary border-border"
                  />
                  <Button
                    type="submit"
                    className="shrink-0"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </form>
                {error && (
                  <p className="text-destructive text-sm text-center mt-3">
                    {error}
                  </p>
                )}
                <div className="flex justify-center min-h-[78px] mt-2">
                  <HCaptcha ref={captchaRef} theme={themeValue} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
