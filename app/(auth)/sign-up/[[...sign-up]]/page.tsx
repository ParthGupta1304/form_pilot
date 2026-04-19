import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-10 text-primary-foreground relative overflow-hidden">
        {/* CSS Geometric shapes */}
        <div className="absolute top-16 left-16 h-40 w-40 rounded-full border-[3px] border-white/10" />
        <div className="absolute top-32 left-32 h-24 w-24 rounded-full border-[3px] border-white/10" />
        <div className="absolute bottom-24 right-16 h-56 w-56 rounded-full border-[3px] border-white/10" />
        <div className="absolute bottom-40 right-32 h-20 w-20 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-20 h-px w-32 bg-white/10 rotate-45" />
        <div className="absolute top-1/2 left-20 h-px w-48 bg-white/10 -rotate-12" />
        <div className="absolute bottom-1/3 left-1/3 h-16 w-16 rotate-45 border-[3px] border-white/10" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2" aria-label="FormPilot home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <span className="text-sm font-bold">F</span>
            </div>
            <span className="text-xl font-bold">FormPilot</span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">
            Start building smarter forms today.
          </h2>
          <p className="mt-4 text-base text-primary-foreground/80">
            Join 50+ teams already using FormPilot to understand their audience better.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">50+</p>
              <p className="text-xs text-primary-foreground/60">Active teams</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-xs text-primary-foreground/60">Responses collected</p>
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

          <h1 className="text-2xl font-bold text-foreground mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-8">Get started with FormPilot in seconds.</p>

          <SignUp
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

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing up you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms</a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
          </p>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium text-primary transition-colors hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
