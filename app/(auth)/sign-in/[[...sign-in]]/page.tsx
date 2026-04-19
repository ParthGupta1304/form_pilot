import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-10 text-primary-foreground relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute bottom-20 left-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2" aria-label="FormPilot home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <span className="text-sm font-bold">F</span>
            </div>
            <span className="text-xl font-bold">FormPilot</span>
          </Link>
        </div>

        {/* Tagline */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            Forms that actually tell you something.
          </h2>
          <p className="mt-4 text-base text-primary-foreground/80">
            Build forms, collect feedback, and let AI do the analysis.
          </p>

          {/* Testimonial */}
          <div className="mt-10 rounded-xl bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm italic text-primary-foreground/90">
              &ldquo;FormPilot saved us hours of manual feedback analysis. The AI summaries are spot-on.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
                AK
              </div>
              <div>
                <p className="text-sm font-medium">Arjun Kumar</p>
                <p className="text-xs text-primary-foreground/60">President, BPIT Tech Club</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} FormPilot
        </div>
      </div>

      {/* Right Panel — Auth */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile back link */}
        <div className="lg:hidden w-full max-w-sm mb-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>

        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">F</span>
            </div>
            <span className="text-lg font-bold text-foreground">
              Form<span className="text-primary">Pilot</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">Sign in to your account to continue.</p>

          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "shadow-none w-full",
                card: "shadow-none p-0 w-full",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-border/60 text-foreground hover:bg-muted transition-colors",
                formFieldInput:
                  "rounded-lg border-border/60 bg-background text-foreground focus:border-primary focus:ring-ring/30",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg",
                footerActionLink: "text-primary hover:text-primary/80",
                footer: "hidden",
              },
            }}
            forceRedirectUrl="/dashboard"
          />

          <div className="mt-6 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-medium text-primary transition-colors hover:text-primary/80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
