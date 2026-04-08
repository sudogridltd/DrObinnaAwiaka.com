import { useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import {
  Menu,
  X,
  Sun,
  Moon,
  Home,
  Info,
  Briefcase,
  CalendarCheck,
  ShoppingBag,
  MessageSquare,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTheme } from "@/components/ThemeProvider";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: Info },
  { label: "Services", href: "/services", icon: Briefcase },
  { label: "Book a Session", href: "/booking", icon: CalendarCheck },
  { label: "Shop", href: "/shop", icon: ShoppingBag },
  { label: "Contact", href: "/contact", icon: MessageSquare },
];

export default function Navbar() {
  const { urlPathname } = usePageContext();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          {/* Full logo on sm+ — theme-aware */}
          <img
            src={theme === 'dark' ? '/logo.svg' : '/logo-light.svg'}
            alt="Dr Obinna Awiaka"
            className="hidden sm:block h-10 w-auto"
          />
          {/* Icon only on mobile */}
          <img src="/favicon.svg" alt="Dr Obinna Awiaka" className="sm:hidden w-10 h-10" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                urlPathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button asChild>
            <a href="/booking">Book Now</a>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-background border-border w-80 p-0 flex flex-col [&>button]:hidden"
          >
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <a href="/" onClick={() => setOpen(false)}>
                <img
                  src={theme === 'dark' ? '/logo.svg' : '/logo-light.svg'}
                  alt="Dr Obinna Awiaka"
                  className="h-9 w-auto"
                />
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <Separator />

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = urlPathname === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                    )}
                  </a>
                );
              })}

              <Separator className="my-3" />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 w-full text-left"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 shrink-0" />
                ) : (
                  <Moon className="h-5 w-5 shrink-0" />
                )}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                <span className="ml-auto text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                  {theme === "dark" ? "Dark" : "Light"}
                </span>
              </button>
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto px-5 pb-6 space-y-4">
              <Button asChild className="w-full h-12 text-[15px] rounded-xl">
                <a href="/booking" onClick={() => setOpen(false)}>
                  Book a Free Discovery Call
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>

              <div className="bg-secondary/60 rounded-xl p-4 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Contact
                </p>
                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  (123) 456-7890
                </a>
                <a
                  href="mailto:hello@drobinnaawiaka.com"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  hello@drobinnaawiaka.com
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
