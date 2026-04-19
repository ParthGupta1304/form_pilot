"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Check, Upload, ArrowLeft, ArrowRight, SkipForward } from "lucide-react";

const ACCENT_COLORS = [
  { label: "Purple", value: "#534AB7" },
  { label: "Teal", value: "#0F6E56" },
  { label: "Coral", value: "#D85A30" },
  { label: "Blue", value: "#378ADD" },
  { label: "Green", value: "#639922" },
  { label: "Amber", value: "#BA7517" },
];

const ROLE_OPTIONS = ["Student org", "Startup", "Agency", "Other"];

export default function CreateOrgPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [workspaceName, setWorkspaceName] = useState("");
  const [role, setRole] = useState("");
  const [accentColor, setAccentColor] = useState("#534AB7");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  console.log(`[CreateOrg] step=${step}, name="${workspaceName}", role="${role}", accent=${accentColor}`);

  const handleContinue = () => {
    if (!workspaceName.trim()) return;
    if (!role) return;
    setStep(2);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      console.log("[CreateOrg] Creating workspace...", { workspaceName, role, accentColor });
      // In production, this would call Clerk's createOrganization and then
      // upsert the org in our DB with the accent color and logo
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/dashboard");
    } catch (err) {
      console.error("[CreateOrg] Failed to create workspace:", err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Back to home */}
        <Link href="/" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {/* Progress indicator */}
        <div className="mb-8 flex items-center gap-3">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
            step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {step > 1 ? <Check className="h-4 w-4" /> : "1"}
          </div>
          <div className={cn("h-px flex-1", step >= 2 ? "bg-primary" : "bg-border")} />
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
            step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            2
          </div>
          <span className="ml-3 text-sm text-muted-foreground">Step {step} of 2</span>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border/40 bg-card p-6 sm:p-8">
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-foreground mb-1">Create your workspace</h2>
              <p className="text-sm text-muted-foreground mb-6">Set up your team&apos;s workspace on FormPilot.</p>

              {/* Workspace name */}
              <div className="mb-4">
                <label htmlFor="workspace-name" className="block text-sm font-medium text-foreground mb-1.5">
                  Workspace name
                </label>
                <input
                  id="workspace-name"
                  type="text"
                  placeholder="e.g. NAMESPACE BPIT"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                  aria-required="true"
                />
              </div>

              {/* Role dropdown */}
              <div className="mb-6">
                <label htmlFor="org-role" className="block text-sm font-medium text-foreground mb-1.5">
                  Your role
                </label>
                <div className="relative">
                  <button
                    id="org-role"
                    type="button"
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className={cn(
                      "w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-left text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30",
                      role ? "text-foreground" : "text-muted-foreground"
                    )}
                    aria-haspopup="listbox"
                    aria-expanded={roleDropdownOpen}
                  >
                    {role || "Select your role"}
                  </button>
                  {roleDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-border/60 bg-card py-1 shadow-lg animate-scale-in" role="listbox">
                      {ROLE_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          role="option"
                          aria-selected={role === opt}
                          onClick={() => { setRole(opt); setRoleDropdownOpen(false); }}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-muted",
                            role === opt ? "text-primary font-medium" : "text-foreground"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!workspaceName.trim() || !role}
                className={cn(
                  "w-full inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50",
                  workspaceName.trim() && role
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "cursor-not-allowed bg-muted text-muted-foreground"
                )}
                aria-label="Continue to branding step"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-foreground mb-1">Brand your workspace</h2>
              <p className="text-sm text-muted-foreground mb-6">Optional — you can always set this later.</p>

              {/* Logo Upload */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-foreground mb-1.5">Logo</label>
                <div
                  className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border/60 px-6 py-6 text-center transition-colors hover:border-border hover:bg-muted/30"
                  onClick={() => document.getElementById("org-logo-upload")?.click()}
                  role="button"
                  aria-label="Upload organization logo"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") document.getElementById("org-logo-upload")?.click(); }}
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {logoFile ? logoFile.name : "Drag & drop or click to upload"}
                  </p>
                </div>
                <input
                  id="org-logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => { if (e.target.files?.[0]) setLogoFile(e.target.files[0]); }}
                  className="hidden"
                  aria-hidden="true"
                />
              </div>

              {/* Accent Color Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Accent color</label>
                <div className="flex flex-wrap gap-3">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setAccentColor(color.value)}
                      className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150",
                        accentColor === color.value ? "ring-2 ring-offset-2 ring-offset-background" : "hover:scale-110"
                      )}
                      style={{
                        backgroundColor: color.value,
                        ...(accentColor === color.value ? { ringColor: color.value } : {}),
                      }}
                      aria-label={`Select ${color.label} accent color`}
                      title={color.label}
                    >
                      {accentColor === color.value && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">Preview</label>
                <div className="rounded-lg border border-border/40 bg-muted/20 p-4">
                  <div className="rounded-lg bg-background p-4 max-w-xs mx-auto border border-border/30">
                    <div className="text-center mb-3">
                      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: accentColor }}>
                        <span className="text-xs font-bold text-white">{workspaceName.charAt(0) || "W"}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground">{workspaceName || "Workspace"}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-24 mx-auto rounded bg-foreground/10" />
                      <div className="h-8 rounded-lg border border-border/30" />
                      <div className="h-8 rounded-lg" style={{ backgroundColor: accentColor }}>
                        <div className="flex h-full items-center justify-center">
                          <span className="text-xs text-white font-medium">Submit</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
                  aria-label="Create workspace"
                >
                  {loading ? "Creating..." : "Create workspace"}
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50"
                  aria-label="Skip branding for now"
                >
                  <SkipForward className="h-3.5 w-3.5" /> Skip
                </button>
              </div>

              {/* Back button */}
              <button
                onClick={() => setStep(1)}
                className="mt-3 w-full text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Go back to step 1"
              >
                ← Back to workspace details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
