"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, ExternalLink, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface FormDetailClientProps {
  formId: string;
  slug: string;
  published: boolean;
  publicUrl: string;
}

export default function FormDetailClient({
  formId,
  slug,
  published,
  publicUrl,
}: FormDetailClientProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isPublished, setIsPublished] = useState(published);
  const [toggling, setToggling] = useState(false);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${publicUrl}` : publicUrl;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast("Link copied!", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("[FormDetailClient] Failed to copy");
      toast("Failed to copy link", "error");
    }
  };

  const handleTogglePublish = async () => {
    setToggling(true);
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !isPublished }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setIsPublished(!isPublished);
      toast(isPublished ? "Form unpublished" : "Form published!", "success");
    } catch (err) {
      console.error("[FormDetailClient] Toggle publish error:", err);
      toast("Failed to update form status", "error");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* URL + Copy */}
      <div className="flex-1">
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-4 py-2.5">
          <code className="flex-1 text-sm text-foreground truncate">{fullUrl}</code>
          <button
            onClick={handleCopy}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label="Copy link to clipboard"
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
          </button>
          {isPublished && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50"
              aria-label="Open form in new tab"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          )}
        </div>
      </div>

      {/* QR Code Placeholder + Publish toggle */}
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={cn("h-1.5 w-1.5 rounded-sm", i % 3 === 0 ? "bg-primary" : "bg-primary/40")} />
            ))}
          </div>
        </div>
        <button
          onClick={handleTogglePublish}
          disabled={toggling}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50",
            isPublished
              ? "border border-border/60 text-foreground hover:bg-muted"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          aria-label={isPublished ? "Unpublish form" : "Publish form"}
        >
          {toggling ? "..." : isPublished ? "Unpublish" : "Publish"}
        </button>
      </div>
    </div>
  );
}
