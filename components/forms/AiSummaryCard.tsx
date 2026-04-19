"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, RefreshCw, ThumbsUp, AlertTriangle, MinusCircle } from "lucide-react";
import type { AiSummaryData } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

interface AiSummaryCardProps {
  summary: AiSummaryData | null;
  responseCount: number;
  formId: string;
  onGenerate?: () => void;
  onRegenerate?: () => void;
  isGenerating?: boolean;
}

const sentimentConfig = {
  positive: { label: "Positive", icon: ThumbsUp, color: "bg-success/10 text-success" },
  neutral: { label: "Neutral", icon: MinusCircle, color: "bg-warning/10 text-warning" },
  negative: { label: "Negative", icon: AlertTriangle, color: "bg-destructive/10 text-destructive" },
} as const;

export default function AiSummaryCard({
  summary,
  responseCount,
  formId,
  onGenerate,
  onRegenerate,
  isGenerating = false,
}: AiSummaryCardProps) {
  console.log(`[AiSummaryCard] Rendering for form ${formId}, summary exists: ${!!summary}, responses: ${responseCount}`);

  if (!summary) {
    const canGenerate = responseCount >= 5;
    return (
      <div className="rounded-xl border border-border/40 bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">AI Summary</h3>
        </div>
        <div className="flex flex-col items-center py-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">No summary yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {canGenerate
              ? "Generate an AI-powered summary of all responses."
              : `Need at least 5 responses to generate a summary. Currently: ${responseCount}`}
          </p>
          <button
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            className={cn(
              "mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200",
              canGenerate
                ? "bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/50"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            )}
            aria-label="Generate AI summary"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? "Generating..." : "Generate AI summary"}
          </button>
        </div>
      </div>
    );
  }

  const sentimentInfo = sentimentConfig[summary.sentiment] || sentimentConfig.neutral;
  const SentimentIcon = sentimentInfo.icon;

  return (
    <div className="rounded-xl border border-border/40 bg-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">AI Summary</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Generated {formatRelativeTime(summary.generatedAt)}
          </span>
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label="Regenerate AI summary"
          >
            <RefreshCw className={cn("h-3 w-3", isGenerating && "animate-spin")} />
            Regenerate
          </button>
        </div>
      </div>

      {/* Sentiment Badge */}
      <div className="mb-4">
        <span className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium", sentimentInfo.color)}>
          <SentimentIcon className="h-3.5 w-3.5" />
          {sentimentInfo.label} sentiment
        </span>
      </div>

      {/* Summary Text */}
      <p className="text-sm leading-relaxed text-foreground/90 mb-5">{summary.summary}</p>

      {/* Themes */}
      {summary.themes.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Themes</h4>
          <div className="flex flex-wrap gap-2">
            {summary.themes.map((theme, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      {summary.actionItems.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Action Items</h4>
          <ol className="space-y-1.5">
            {summary.actionItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {idx + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
