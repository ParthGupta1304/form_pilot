"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Star, Upload, X, FileText, ImageIcon } from "lucide-react";
import type { FormField } from "@/lib/types";

interface FieldRendererProps {
  field: FormField;
  value: unknown;
  onChange: (fieldId: string, value: unknown) => void;
  accentColor?: string;
  error?: string;
}

export default function FieldRenderer({
  field,
  value,
  onChange,
  accentColor = "#534AB7",
  error,
}: FieldRendererProps) {
  const inputId = `field-${field.id}`;

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
        {field.label}
        {field.required && <span className="ml-1 text-destructive">*</span>}
      </label>

      {field.type === "short_text" && (
        <input
          id={inputId}
          type="text"
          placeholder={field.placeholder || "Type your answer..."}
          value={(value as string) || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={cn(
            "w-full rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30",
            error && "border-destructive focus:border-destructive focus:ring-destructive/30"
          )}
          aria-label={field.label}
          aria-required={field.required}
        />
      )}

      {field.type === "long_text" && (
        <textarea
          id={inputId}
          placeholder={field.placeholder || "Type your answer..."}
          value={(value as string) || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          rows={4}
          className={cn(
            "w-full resize-y rounded-lg border border-border/60 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30",
            error && "border-destructive focus:border-destructive focus:ring-destructive/30"
          )}
          aria-label={field.label}
          aria-required={field.required}
        />
      )}

      {field.type === "mcq" && (
        <McqField
          field={field}
          value={value as string}
          onChange={onChange}
          accentColor={accentColor}
          inputId={inputId}
        />
      )}

      {field.type === "rating" && (
        <RatingField
          field={field}
          value={value as number}
          onChange={onChange}
          accentColor={accentColor}
          inputId={inputId}
        />
      )}

      {field.type === "file_upload" && (
        <FileUploadField
          field={field}
          value={value as File | null}
          onChange={onChange}
          inputId={inputId}
        />
      )}

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── MCQ Sub-component ─── */
function McqField({
  field,
  value,
  onChange,
  accentColor,
  inputId,
}: {
  field: FormField;
  value: string;
  onChange: (id: string, val: unknown) => void;
  accentColor: string;
  inputId: string;
}) {
  return (
    <div className="space-y-2" role="radiogroup" aria-labelledby={inputId}>
      {(field.options || []).map((option, idx) => {
        const isSelected = value === option;
        return (
          <button
            key={idx}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(field.id, option)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-200",
              isSelected
                ? "border-primary/50 bg-secondary"
                : "border-border/40 bg-card hover:border-border/80 hover:bg-muted/50"
            )}
            style={isSelected ? { borderColor: accentColor + "80" } : undefined}
          >
            <div
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                isSelected ? "border-primary" : "border-border"
              )}
              style={isSelected ? { borderColor: accentColor } : undefined}
            >
              {isSelected && (
                <div
                  className="h-2.5 w-2.5 rounded-full bg-primary"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </div>
            <span className={cn("text-foreground", isSelected && "font-medium")}>{option}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Rating Sub-component ─── */
function RatingField({
  field,
  value,
  onChange,
  accentColor,
  inputId,
}: {
  field: FormField;
  value: number;
  onChange: (id: string, val: unknown) => void;
  accentColor: string;
  inputId: string;
}) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const currentValue = value || 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1" role="slider" aria-label={field.label} aria-valuenow={currentValue} aria-valuemin={1} aria-valuemax={5}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(field.id, star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="p-0.5 transition-transform duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring/30 rounded"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              className="h-8 w-8 transition-colors duration-150"
              fill={(hoveredStar || currentValue) >= star ? accentColor : "transparent"}
              stroke={(hoveredStar || currentValue) >= star ? accentColor : "currentColor"}
              strokeWidth={1.5}
            />
          </button>
        ))}
      </div>
      {(field.minLabel || field.maxLabel) && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{field.minLabel || ""}</span>
          <span>{field.maxLabel || ""}</span>
        </div>
      )}
    </div>
  );
}

/* ─── File Upload Sub-component ─── */
function FileUploadField({
  field,
  value,
  onChange,
  inputId,
}: {
  field: FormField;
  value: File | null;
  onChange: (id: string, val: unknown) => void;
  inputId: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const file = value as File | null;

  const acceptMap: Record<string, string> = {
    pdf: ".pdf",
    image: "image/*",
    any: "*",
  };

  const acceptStr = (field.allowedFileTypes || ["any"])
    .map((t) => acceptMap[t] || "*")
    .join(",");

  const handleFile = (files: FileList | null) => {
    if (files && files[0]) {
      console.log(`[FileUpload] Selected file: ${files[0].name} (${files[0].size} bytes)`);
      onChange(field.id, files[0]);
    }
  };

  return (
    <div>
      {!file ? (
        <div
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
            dragOver ? "border-primary bg-secondary/50" : "border-border/60 hover:border-border hover:bg-muted/30"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files);
          }}
          role="button"
          aria-label="Upload file"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click(); }}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag & drop or <span className="font-medium text-primary">click to upload</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {(field.allowedFileTypes || ["any"]).join(", ").toUpperCase()}
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
            {file.type.startsWith("image/") ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(field.id, null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={acceptStr}
        onChange={(e) => handleFile(e.target.files)}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
