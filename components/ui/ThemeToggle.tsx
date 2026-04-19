"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

type Theme = "light" | "dark" | "system";

const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System", icon: <Monitor className="h-4 w-4" /> },
];

interface ThemeToggleProps {
  /** Show as a compact icon-only button (no dropdown text labels) */
  compact?: boolean;
  className?: string;
}

export default function ThemeToggle({ compact = false, className }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const currentIcon = resolvedTheme === "dark"
    ? <Moon className="h-4 w-4" />
    : <Sun className="h-4 w-4" />;

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center rounded-lg transition-colors",
          "text-muted-foreground hover:bg-muted hover:text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring/50",
          compact ? "h-8 w-8" : "h-9 gap-2 px-3"
        )}
        aria-label="Toggle theme"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {currentIcon}
        {!compact && (
          <span className="text-sm font-medium capitalize">
            {theme === "system" ? "System" : theme}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-36 rounded-lg border border-border/60 bg-card py-1 shadow-lg animate-scale-in">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setTheme(opt.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted",
                theme === opt.value
                  ? "text-primary font-medium"
                  : "text-foreground"
              )}
              aria-label={`Set theme to ${opt.label}`}
            >
              {opt.icon}
              {opt.label}
              {theme === opt.value && (
                <span className="ml-auto text-primary">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
