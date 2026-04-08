import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { strapiClient } from "@/lib/strapi";
import type { StrapiGlobal } from "@/types/strapi";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  website: Globe,
};

const DEFAULT_FOOTER_LINKS = [
  { label: "Home", url: "/" },
  { label: "About", url: "/about" },
  { label: "Services", url: "/services" },
  { label: "Blog", url: "/blog" },
  { label: "Shop", url: "/shop" },
  { label: "Book a Session", url: "/booking" },
  { label: "Contact", url: "/contact" },
];

const DEFAULT_SOCIALS = [
  { platform: "instagram", url: "https://instagram.com/drobinna" },
  { platform: "facebook", url: "https://facebook.com/drobinna" },
  { platform: "twitter", url: "https://x.com/drobinna" },
  { platform: "linkedin", url: "https://linkedin.com/in/drobinna" },
  { platform: "youtube", url: "https://youtube.com/@drobinna" },
];

export default function Footer() {
  const [global, setGlobal] = useState<StrapiGlobal | null>(null);

  useEffect(() => {
    strapiClient.getGlobal().then(setGlobal).catch(() => null);
  }, []);

  const siteName = global?.siteName ?? "Dr Obinna Awiaka";
  const siteTagline = global?.siteTagline ?? "Life Coach";
  const footerTagline = global?.footerTagline ?? "Certified Life Coach, Speaker & Author dedicated to helping individuals and organizations unlock their full potential and live with purpose.";
  const copyrightText = global?.copyrightText ?? `© ${new Date().getFullYear()} Dr Obinna Awiaka Coaching. All rights reserved.`;
  const phone = global?.phone ?? "(123) 456-7890";
  const email = global?.email ?? "hello@drobinnaawiaka.com";
  const address = global?.address ?? "Available Worldwide (Virtual & In-Person)";
  const footerLinks = global?.footerNavigation?.length ? global.footerNavigation : DEFAULT_FOOTER_LINKS;
  const socialLinks = global?.socialLinks?.length ? global.socialLinks : DEFAULT_SOCIALS;

  return (
    <footer className="bg-[#060a09] border-t border-border text-[#f0fdf4]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/">
              <img src="/logo.svg" alt={siteName} className="h-10 w-auto" />
            </a>
            <p className="mt-4 text-[#94a3b8] text-sm leading-relaxed">
              {footerTagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#f0fdf4] uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.url}>
                  {link.isExternal ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#94a3b8] hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.url}
                      className="text-sm text-[#94a3b8] hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-[#f0fdf4] uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#94a3b8]">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                {address}
              </li>
              <li className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href={`tel:${phone.replace(/\D/g, "")}`} className="hover:text-primary transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#94a3b8]">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-[#f0fdf4] uppercase tracking-wider mb-4">
              Connect
            </h4>
            <p className="text-sm text-[#94a3b8] mb-6">
              Follow for daily inspiration, coaching tips, and behind-the-scenes content.
            </p>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform] ?? Globe;
                const label = social.platform.charAt(0).toUpperCase() + social.platform.slice(1);
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-[#1e3a38] flex items-center justify-center text-[#94a3b8] hover:text-primary hover:border-primary transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <Separator className="my-10 bg-[#1e3a38]" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#94a3b8]">{copyrightText}</p>
          <p className="text-xs text-[#94a3b8]">
            Certified Life Coach &bull; Speaker &bull; Author
          </p>
        </div>
      </div>
    </footer>
  );
}
