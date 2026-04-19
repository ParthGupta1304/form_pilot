"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  Menu,
  X,
  GripVertical,
  Sparkles,
  Users,
  Check,
  ArrowRight,
  GitFork,
  Star,
} from "lucide-react";

/* ──────────────────────────────────────────────
   PAGE 1 — Landing Page
   ────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SocialProofTicker />
      <PricingSection />
      <Footer />
    </div>
  );
}

/* ─── NAVBAR ─── */
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="FormPilot home">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">F</span>
          </div>
          <span className="text-lg font-bold text-foreground">
            Form<span className="text-primary">Pilot</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Marketing navigation">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">GitHub</a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle compact />
          <Link
            href="/sign-in"
            className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label="Sign in"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label="Get started free"
          >
            Get started free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background animate-fade-in">
          <div className="flex flex-col gap-1 px-4 py-4">
            <a href="#features" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted">Features</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted">Pricing</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted">GitHub</a>
            <div className="mt-3 border-t border-border/40 pt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-lg px-3 py-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle compact />
              </div>
              <Link href="/sign-in" className="rounded-lg border border-border/60 px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted">Sign in</Link>
              <Link href="/sign-up" className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Get started free</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── HERO ─── */
function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle purple gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-1.5 text-sm font-medium text-primary animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          AI-powered form analytics
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in-up">
          Forms that actually
          <br />
          <span className="text-primary">tell you something.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-5 mx-auto max-w-2xl text-lg text-muted-foreground animate-fade-in-up stagger-1 opacity-0">
          Build beautiful forms, collect responses, and let AI summarise what your
          respondents are really saying.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up stagger-2 opacity-0">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label="Start for free"
          >
            Start for free <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label="See a demo"
          >
            See a demo
          </a>
        </div>

        {/* Social proof */}
        <p className="mt-8 text-sm text-muted-foreground animate-fade-in-up stagger-3 opacity-0">
          Trusted by <span className="font-semibold text-foreground">50+</span> student orgs and startups
        </p>

        {/* Dashboard mockup */}
        <div className="mt-12 animate-fade-in-up stagger-4 opacity-0">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

/* ─── Dashboard Mockup (div-based) ─── */
function DashboardMockup() {
  return (
    <div className="mx-auto max-w-3xl rounded-xl border border-border/60 bg-card shadow-xl overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border/40 bg-muted/50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-400/60" />
          <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
          <div className="h-3 w-3 rounded-full bg-green-400/60" />
        </div>
        <div className="mx-auto rounded-md bg-muted px-12 py-1 text-xs text-muted-foreground">
          app.formpilot.io/dashboard
        </div>
      </div>

      {/* Mock dashboard content */}
      <div className="flex min-h-[280px] sm:min-h-[340px]">
        {/* Mock sidebar */}
        <div className="hidden sm:flex w-[180px] flex-col border-r border-border/30 bg-muted/20 p-3 gap-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-6 rounded bg-primary/80" />
            <div className="h-3 w-16 rounded bg-foreground/10" />
          </div>
          <div className="h-8 rounded-lg bg-primary/10 px-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-primary/40" />
            <div className="h-2.5 w-14 rounded bg-primary/40" />
          </div>
          <div className="h-8 rounded-lg px-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-foreground/10" />
            <div className="h-2.5 w-10 rounded bg-foreground/10" />
          </div>
          <div className="h-8 rounded-lg px-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-foreground/10" />
            <div className="h-2.5 w-12 rounded bg-foreground/10" />
          </div>
        </div>

        {/* Mock main content */}
        <div className="flex-1 p-4 sm:p-5">
          {/* Mock top bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="h-4 w-36 rounded bg-foreground/10" />
            <div className="h-8 w-24 rounded-lg bg-primary/80" />
          </div>

          {/* Mock stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[42, 186, 12, 8].map((val, i) => (
              <div key={i} className="rounded-lg border border-border/30 p-3">
                <div className="h-2 w-12 rounded bg-foreground/10 mb-2" />
                <div className="text-lg font-bold text-foreground/60">{val}</div>
              </div>
            ))}
          </div>

          {/* Mock form list */}
          <div className="space-y-2">
            {["Customer Feedback ✦", "Team Standup", "Event Registration"].map((name, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/20 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-foreground/10" />
                  <span className="text-xs text-foreground/50">{name}</span>
                </div>
                <div className={cn("h-5 w-16 rounded-md text-[10px] flex items-center justify-center font-medium",
                  i === 0 ? "bg-green-500/10 text-green-600/60" : "bg-foreground/5 text-foreground/30"
                )}>
                  {i === 0 ? "Published" : "Draft"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── FEATURES ─── */
function FeaturesSection() {
  const features = [
    {
      icon: <GripVertical className="h-6 w-6" />,
      title: "Drag & drop builder",
      description: "Build any form in minutes with our visual editor. No coding needed.",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "AI response summaries",
      description: "AI reads every response and surfaces themes, sentiment, and action items instantly.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team workspaces",
      description: "Invite your team, share forms, and manage everything from one place.",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to collect and understand feedback
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Powerful tools in a beautifully simple package.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group rounded-xl border border-border/40 bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SOCIAL PROOF TICKER ─── */
function SocialProofTicker() {
  const orgs = [
    "BPIT Tech Club",
    "Delhi Startup Weekend",
    "HackIndia",
    "CodeForIndia",
    "NSUT Developers",
    "IIT-D Entrepreneurship Cell",
    "DTU Coding Club",
    "TechFest Mumbai",
    "Startup Grind Delhi",
    "Google DSC BPIT",
    "MLH Local Hack Day",
    "ACM Chapter IGDTUW",
  ];

  return (
    <section className="border-y border-border/40 bg-muted/30 py-6 overflow-hidden">
      <div className="flex animate-ticker whitespace-nowrap">
        {[...orgs, ...orgs].map((org, idx) => (
          <span
            key={idx}
            className="mx-6 flex items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <Star className="h-3.5 w-3.5 text-primary/40" />
            {org}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ─── PRICING ─── */
function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      popular: false,
      features: [
        "Up to 3 forms",
        "50 responses / form",
        "Basic analytics",
        "1 team member",
        "Community support",
      ],
    },
    {
      name: "Pro",
      price: "₹999",
      period: "/mo",
      popular: true,
      features: [
        "Unlimited forms",
        "Unlimited responses",
        "AI-powered summaries",
        "5 team members",
        "Priority support",
      ],
    },
    {
      name: "Team",
      price: "₹2,499",
      period: "/mo",
      popular: false,
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Custom branding",
        "API access",
        "Dedicated support",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={cn(
                "relative flex flex-col rounded-xl border p-6 transition-all duration-200",
                plan.popular
                  ? "border-primary shadow-md scale-[1.02]"
                  : "border-border/40 bg-card hover:border-border/80"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Most popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2.5 text-sm text-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className={cn(
                  "mt-6 block rounded-lg py-2.5 text-center text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50",
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border/60 text-foreground hover:bg-muted"
                )}
                aria-label={`Get started with ${plan.name} plan`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <span className="text-xs font-bold text-primary-foreground">F</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              Form<span className="text-primary">Pilot</span>
            </span>
            <span className="ml-2 text-xs text-muted-foreground">
              Forms that tell you something.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
            <a href="#" className="transition-colors hover:text-foreground">Terms</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
              <GitFork className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FormPilot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}