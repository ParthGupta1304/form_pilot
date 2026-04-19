"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { FormField } from "@/lib/types";
import FieldRenderer from "@/components/forms/FieldRenderer";
import { Check } from "lucide-react";

interface PublicFormClientProps {
  formId: string;
  title: string;
  description: string | null;
  fields: FormField[];
  orgName: string;
  orgLogoUrl: string | null;
  accentColor: string;
}

export default function PublicFormClient({
  formId,
  title,
  description,
  fields,
  orgName,
  orgLogoUrl,
  accentColor,
}: PublicFormClientProps) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const startTimeRef = useRef(Date.now());

  console.log(`[PublicFormClient] formId=${formId}, fields=${fields.length}, accent=${accentColor}`);

  const handleChange = (fieldId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error on change
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required) {
        const val = answers[field.id];
        if (val === undefined || val === null || val === "") {
          newErrors[field.id] = "This field is required";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const timeTakenSec = Math.round((Date.now() - startTimeRef.current) / 1000);
    console.log(`[PublicFormClient] Submitting response, time=${timeTakenSec}s`);

    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId,
          answers,
          timeTakenSec,
        }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setSubmitted(true);
    } catch (err) {
      console.error("[PublicFormClient] Submit error:", err);
      setErrors({ _form: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  // Progress calculation
  const filledCount = fields.filter((f) => {
    const val = answers[f.id];
    return val !== undefined && val !== null && val !== "";
  }).length;
  const progressPct = fields.length > 0 ? Math.round((filledCount / fields.length) * 100) : 0;

  // Success state
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm animate-fade-in-up">
          {/* Checkmark animation */}
          <div className="mx-auto mb-6 relative">
            <div
              className="absolute inset-0 rounded-full animate-pulse-ring"
              style={{ backgroundColor: accentColor + "20" }}
            />
            <div
              className="relative flex h-20 w-20 mx-auto items-center justify-center rounded-full animate-check-bounce"
              style={{ backgroundColor: accentColor }}
            >
              <Check className="h-10 w-10 text-white" strokeWidth={3} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Thank you!</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Your response has been recorded.
          </p>

          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{orgName}</span>
            <span className="mx-2">·</span>
            <span>
              Powered by{" "}
              <a href="/" className="font-medium text-primary hover:underline">
                FormPilot
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-10 sm:py-16">
        {/* Org branding */}
        <div className="mb-8 text-center">
          {orgLogoUrl ? (
            <img src={orgLogoUrl} alt={orgName} className="mx-auto mb-3 h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div
              className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-white text-sm font-bold"
              style={{ backgroundColor: accentColor }}
            >
              {orgName.charAt(0)}
            </div>
          )}
          <p className="text-sm text-muted-foreground">{orgName}</p>
        </div>

        {/* Form title */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground text-center mb-6">{description}</p>
        )}

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%`, backgroundColor: accentColor }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              value={answers[field.id]}
              onChange={handleChange}
              accentColor={accentColor}
              error={errors[field.id]}
            />
          ))}

          {/* Form-level error */}
          {errors._form && (
            <p className="text-sm text-destructive text-center" role="alert">
              {errors._form}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg py-3 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: accentColor,
              // @ts-ignore
              "--tw-ring-color": accentColor + "80",
            }}
            aria-label="Submit form"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-muted-foreground">
          Powered by{" "}
          <a href="/" className="font-medium text-primary hover:underline">
            FormPilot
          </a>
        </div>
      </div>
    </div>
  );
}
