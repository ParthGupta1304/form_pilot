"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { generateSlug } from "@/lib/utils";
import type { FormField, FieldType } from "@/lib/types";
import {
  Type,
  AlignLeft,
  ListChecks,
  Star,
  Upload,
  GripVertical,
  X,
  Plus,
  Save,
  Globe,
  Trash2,
  Settings2,
  Layers,
  ChevronLeft,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useToast } from "@/components/ui/Toast";
import { ToastProvider } from "@/components/ui/Toast";

/* ─── Field type config ─── */
const FIELD_TYPES: { type: FieldType; label: string; icon: React.ReactNode }[] = [
  { type: "short_text", label: "Short text", icon: <Type className="h-4 w-4" /> },
  { type: "long_text", label: "Long text", icon: <AlignLeft className="h-4 w-4" /> },
  { type: "mcq", label: "Multiple choice", icon: <ListChecks className="h-4 w-4" /> },
  { type: "rating", label: "Rating 1-5", icon: <Star className="h-4 w-4" /> },
  { type: "file_upload", label: "File upload", icon: <Upload className="h-4 w-4" /> },
];

function generateFieldId(): string {
  return "field_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function createField(type: FieldType): FormField {
  const base: FormField = {
    id: generateFieldId(),
    type,
    label: FIELD_TYPES.find((f) => f.type === type)?.label || "Field",
    placeholder: "",
    required: false,
  };
  if (type === "mcq") base.options = ["Option 1", "Option 2"];
  if (type === "rating") { base.minLabel = "Poor"; base.maxLabel = "Excellent"; }
  if (type === "file_upload") base.allowedFileTypes = ["any"];
  return base;
}

/* ─── Main Page ─── */
export default function FormBuilderPage() {
  return (
    <ToastProvider>
      <FormBuilderContent />
    </ToastProvider>
  );
}

function FormBuilderContent() {
  const router = useRouter();
  const { toast } = useToast();

  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [editingTitle, setEditingTitle] = useState(false);
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Mobile panel visibility
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null;

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  console.log(`[FormBuilder] fields=${fields.length}, selected=${selectedFieldId}`);

  /* ─── Handlers ─── */
  const addField = useCallback((type: FieldType) => {
    const newField = createField(type);
    console.log(`[FormBuilder] Adding field: ${type}, id=${newField.id}`);
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.id);
    setShowLeftPanel(false);
  }, []);

  const removeField = useCallback((id: string) => {
    console.log(`[FormBuilder] Removing field: ${id}`);
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  }, [selectedFieldId]);

  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFields((prev) => {
        const oldIndex = prev.findIndex((f) => f.id === active.id);
        const newIndex = prev.findIndex((f) => f.id === over.id);
        console.log(`[FormBuilder] Reorder: ${oldIndex} → ${newIndex}`);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, []);

  const handleSave = async (publish = false) => {
    const setter = publish ? setPublishing : setSaving;
    setter(true);
    try {
      const slug = generateSlug();
      console.log(`[FormBuilder] Saving form: "${formTitle}", publish=${publish}, slug=${slug}`);
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          slug,
          schema: fields,
          published: publish,
        }),
      });
      if (!res.ok) throw new Error("Failed to save form");
      const data = await res.json();
      toast(publish ? "Form published!" : "Draft saved!", "success");
      router.push(`/dashboard/forms/${data.id}`);
    } catch (err) {
      console.error("[FormBuilder] Save error:", err);
      toast("Failed to save form. Please try again.", "error");
    } finally {
      setter(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] md:h-screen flex-col md:flex-row -mx-4 -my-6 md:-mx-8 md:-my-8">
      {/* ─── LEFT PANEL (Add fields) ─── */}
      <div className={cn(
        "w-full md:w-[240px] shrink-0 border-r border-border/40 bg-card overflow-y-auto",
        "fixed inset-0 z-40 md:static md:z-auto",
        showLeftPanel ? "block" : "hidden md:block"
      )}>
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-4">
          <h2 className="text-sm font-semibold text-foreground">Add fields</h2>
          <button
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            onClick={() => setShowLeftPanel(false)}
            aria-label="Close field panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-3 space-y-1">
          {FIELD_TYPES.map((ft) => (
            <button
              key={ft.type}
              onClick={() => addField(ft.type)}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-all duration-150 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/30"
              aria-label={`Add ${ft.label} field`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
                {ft.icon}
              </span>
              <span className="font-medium">{ft.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── CENTER PANEL (Canvas) ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border/40 bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              onClick={() => router.push("/dashboard/forms")}
              aria-label="Back to forms"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {editingTitle ? (
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                onKeyDown={(e) => { if (e.key === "Enter") setEditingTitle(false); }}
                className="rounded-lg border border-primary/50 bg-background px-3 py-1.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                autoFocus
                aria-label="Edit form title"
              />
            ) : (
              <button
                onClick={() => setEditingTitle(true)}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                aria-label="Click to edit form title"
              >
                {formTitle}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || fields.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/50"
              aria-label="Save draft"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save draft"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={publishing || fields.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring/50"
              aria-label="Publish form"
            >
              <Globe className="h-3.5 w-3.5" />
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-2xl">
            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 py-20 px-6 text-center">
                <Layers className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">No fields yet</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Drop fields here or click from the left panel
                </p>
                <button
                  onClick={() => setShowLeftPanel(true)}
                  className="md:hidden inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
                  aria-label="Open field panel"
                >
                  <Plus className="h-3.5 w-3.5" /> Add field
                </button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {fields.map((field) => (
                      <SortableFieldCard
                        key={field.id}
                        field={field}
                        isSelected={field.id === selectedFieldId}
                        onSelect={() => {
                          setSelectedFieldId(field.id);
                          setShowRightPanel(true);
                        }}
                        onRemove={() => removeField(field.id)}
                        onToggleRequired={() =>
                          updateField(field.id, { required: !field.required })
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {fields.length > 0 && (
              <button
                onClick={() => setShowLeftPanel(true)}
                className="mt-4 md:hidden flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/60 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                aria-label="Add another field"
              >
                <Plus className="h-3.5 w-3.5" /> Add field
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL (Field settings) ─── */}
      <div className={cn(
        "w-full md:w-[280px] shrink-0 border-l border-border/40 bg-card overflow-y-auto",
        "fixed inset-0 z-40 md:static md:z-auto",
        showRightPanel ? "block" : "hidden md:block"
      )}>
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            {selectedField ? "Field settings" : "Select a field"}
          </h2>
          <button
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            onClick={() => setShowRightPanel(false)}
            aria-label="Close settings panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {selectedField ? (
          <FieldSettings
            field={selectedField}
            onUpdate={(updates) => updateField(selectedField.id, updates)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Settings2 className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              Click a field to edit its settings
            </p>
          </div>
        )}
      </div>

      {/* ─── Mobile FABs ─── */}
      <div className="md:hidden fixed bottom-20 right-4 z-30 flex flex-col gap-2">
        <button
          onClick={() => setShowLeftPanel(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-105"
          aria-label="Add field"
        >
          <Plus className="h-5 w-5" />
        </button>
        {selectedField && (
          <button
            onClick={() => setShowRightPanel(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border/60 text-foreground shadow-lg transition-transform hover:scale-105"
            aria-label="Field settings"
          >
            <Settings2 className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Sortable Field Card ─── */
function SortableFieldCard({
  field,
  isSelected,
  onSelect,
  onRemove,
  onToggleRequired,
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onToggleRequired: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const fieldTypeInfo = FIELD_TYPES.find((ft) => ft.type === field.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-card p-4 transition-all duration-150 cursor-pointer",
        isSelected ? "border-primary shadow-sm" : "border-border/40 hover:border-border/80",
        isDragging && "opacity-50 shadow-lg"
      )}
      onClick={onSelect}
      role="button"
      aria-label={`Field: ${field.label}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 flex h-8 w-6 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Field info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-foreground truncate">{field.label}</span>
          <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-primary">
            {fieldTypeInfo?.icon}
            {fieldTypeInfo?.label}
          </span>
        </div>
        {field.required && (
          <span className="text-[10px] font-medium text-primary">Required</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Required toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleRequired();
          }}
          className={cn(
            "rounded-lg px-2 py-1 text-[10px] font-medium transition-colors",
            field.required
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted"
          )}
          aria-label={`Toggle ${field.label} as ${field.required ? "optional" : "required"}`}
        >
          {field.required ? "Required" : "Optional"}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Delete field: ${field.label}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── Right Panel: Field Settings ─── */
function FieldSettings({
  field,
  onUpdate,
}: {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}) {
  return (
    <div className="p-4 space-y-5">
      {/* Label */}
      <div>
        <label htmlFor="field-label" className="block text-xs font-medium text-muted-foreground mb-1.5">
          Label
        </label>
        <input
          id="field-label"
          type="text"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      {/* Placeholder (for text fields) */}
      {(field.type === "short_text" || field.type === "long_text") && (
        <div>
          <label htmlFor="field-placeholder" className="block text-xs font-medium text-muted-foreground mb-1.5">
            Placeholder text
          </label>
          <textarea
            id="field-placeholder"
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
          />
        </div>
      )}

      {/* Required toggle */}
      <div className="flex items-center justify-between">
        <label htmlFor="field-required" className="text-xs font-medium text-muted-foreground">Required field</label>
        <button
          id="field-required"
          role="switch"
          aria-checked={field.required}
          onClick={() => onUpdate({ required: !field.required })}
          className={cn(
            "relative inline-flex h-6 w-10 items-center rounded-full transition-colors",
            field.required ? "bg-primary" : "bg-muted"
          )}
          aria-label="Toggle required"
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              field.required ? "translate-x-5" : "translate-x-1"
            )}
          />
        </button>
      </div>

      {/* MCQ Options */}
      {field.type === "mcq" && (
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">Options</label>
          <div className="space-y-2">
            {(field.options || []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...(field.options || [])];
                    newOpts[idx] = e.target.value;
                    onUpdate({ options: newOpts });
                  }}
                  className="flex-1 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
                  aria-label={`Option ${idx + 1}`}
                />
                <button
                  onClick={() => {
                    const newOpts = (field.options || []).filter((_, i) => i !== idx);
                    onUpdate({ options: newOpts });
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  aria-label={`Remove option ${idx + 1}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              const newOpts = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`];
              onUpdate({ options: newOpts });
            }}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
            aria-label="Add option"
          >
            <Plus className="h-3 w-3" /> Add option
          </button>
        </div>
      )}

      {/* Rating labels */}
      {field.type === "rating" && (
        <>
          <div>
            <label htmlFor="rating-min" className="block text-xs font-medium text-muted-foreground mb-1.5">Min label</label>
            <input
              id="rating-min"
              type="text"
              value={field.minLabel || ""}
              onChange={(e) => onUpdate({ minLabel: e.target.value })}
              placeholder="e.g. Poor"
              className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div>
            <label htmlFor="rating-max" className="block text-xs font-medium text-muted-foreground mb-1.5">Max label</label>
            <input
              id="rating-max"
              type="text"
              value={field.maxLabel || ""}
              onChange={(e) => onUpdate({ maxLabel: e.target.value })}
              placeholder="e.g. Excellent"
              className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </>
      )}

      {/* File upload config */}
      {field.type === "file_upload" && (
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">Allowed file types</label>
          <div className="space-y-2">
            {(["pdf", "image", "any"] as const).map((t) => {
              const checked = (field.allowedFileTypes || []).includes(t);
              return (
                <label key={t} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      let newTypes = [...(field.allowedFileTypes || [])];
                      if (checked) {
                        newTypes = newTypes.filter((x) => x !== t);
                      } else {
                        newTypes.push(t);
                      }
                      if (newTypes.length === 0) newTypes = ["any"];
                      onUpdate({ allowedFileTypes: newTypes });
                    }}
                    className="rounded border-border text-primary focus:ring-ring/30"
                  />
                  {t === "pdf" ? "PDF" : t === "image" ? "Images" : "Any file"}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
