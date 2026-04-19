"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import FormCard from "@/components/ui/FormCard";
import { useToast } from "@/components/ui/Toast";

interface SerializedForm {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  responseCount: number;
  updatedAt: string;
}

interface FormsListClientProps {
  forms: SerializedForm[];
}

type FilterTab = "all" | "published" | "draft";

export default function FormsListClient({ forms }: FormsListClientProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const { toast } = useToast();

  console.log(`[FormsListClient] Rendering ${forms.length} forms, filter=${activeTab}, search="${search}"`);

  const filtered = forms.filter((form) => {
    const matchesSearch = form.title.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "published"
        ? form.published
        : !form.published;
    return matchesSearch && matchesTab;
  });

  const handleDelete = async (formId: string) => {
    console.log(`[FormsListClient] Delete requested for form ${formId}`);
    try {
      const res = await fetch(`/api/forms/${formId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast("Form deleted successfully", "success");
      // In production, trigger revalidation or remove from local state
      window.location.reload();
    } catch (err) {
      console.error("[FormsListClient] Delete error:", err);
      toast("Failed to delete form", "error");
    }
  };

  const handleCopyLink = (slug: string) => {
    toast("Link copied to clipboard!", "success");
  };

  const tabs: { label: string; value: FilterTab; count: number }[] = [
    { label: "All", value: "all", count: forms.length },
    { label: "Published", value: "published", count: forms.filter((f) => f.published).length },
    { label: "Draft", value: "draft", count: forms.filter((f) => !f.published).length },
  ];

  return (
    <div>
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search forms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border/60 bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            aria-label="Search forms"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex rounded-lg border border-border/60 bg-muted/30 p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150",
                activeTab === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={`Filter: ${tab.label}`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs text-muted-foreground">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form cards grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((form) => (
            <FormCard
              key={form.id}
              id={form.id}
              title={form.title}
              published={form.published}
              responseCount={form.responseCount}
              updatedAt={form.updatedAt}
              slug={form.slug}
              onDelete={handleDelete}
              onCopyLink={handleCopyLink}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <p className="text-sm">No forms match your search.</p>
        </div>
      )}
    </div>
  );
}
