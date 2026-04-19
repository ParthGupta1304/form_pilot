"use client";

import { cn, formatRelativeTime } from "@/lib/utils";
import { MessageSquare, MoreVertical, Pencil, Share2, BarChart3, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface FormCardProps {
  id: string;
  title: string;
  published: boolean;
  responseCount: number;
  updatedAt: Date | string;
  slug: string;
  onDelete?: (id: string) => void;
  onCopyLink?: (slug: string) => void;
}

export default function FormCard({
  id,
  title,
  published,
  responseCount,
  updatedAt,
  slug,
  onDelete,
  onCopyLink,
}: FormCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/f/${slug}`;
    navigator.clipboard.writeText(url).catch(() => {
      console.error("[FormCard] Failed to copy link to clipboard");
    });
    onCopyLink?.(slug);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    onDelete?.(id);
    setMenuOpen(false);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border border-border/40 bg-card p-5",
        "transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
      )}
    >
      {/* Title & Menu */}
      <div className="flex items-start justify-between">
        <Link
          href={`/dashboard/forms/${id}`}
          className="text-base font-semibold text-foreground transition-colors hover:text-primary"
          aria-label={`View form: ${title}`}
        >
          {title}
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label="Form actions menu"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border/60 bg-card py-1.5 shadow-lg animate-scale-in">
              <Link
                href={`/dashboard/forms/${id}`}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <button
                onClick={handleCopyLink}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                aria-label="Copy share link"
              >
                <Share2 className="h-3.5 w-3.5" /> Share link
              </button>
              <Link
                href={`/dashboard/forms/${id}`}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                onClick={() => setMenuOpen(false)}
              >
                <BarChart3 className="h-3.5 w-3.5" /> View responses
              </Link>
              <div className="mx-2 my-1 border-t border-border/40" />
              <button
                onClick={handleDelete}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                aria-label={`Delete form: ${title}`}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status badge & response count */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
            published
              ? "bg-success/10 text-success"
              : "bg-muted text-muted-foreground"
          )}
        >
          {published ? "Published" : "Draft"}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MessageSquare className="h-3 w-3" />
          {responseCount} {responseCount === 1 ? "response" : "responses"}
        </span>
      </div>

      {/* Updated at */}
      <p className="text-xs text-muted-foreground">
        Last updated {formatRelativeTime(updatedAt)}
      </p>
    </div>
  );
}
