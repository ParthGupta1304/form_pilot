import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import TopBar from "@/components/dashboard/TopBar";
import Link from "next/link";
import { cn, formatRelativeTime, formatDuration } from "@/lib/utils";
import {
  Pencil,
  Share2,
  Copy,
  Globe,
  MessageSquare,
  Clock,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import AiSummaryCard from "@/components/forms/AiSummaryCard";
import FormDetailClient from "./FormDetailClient";
import type { AiSummaryData } from "@/lib/types";

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  console.log(`[FormDetail] Loading form ${id}`);

  let form: Awaited<ReturnType<typeof prisma.form.findUnique>> & {
    responses: { id: string; answers: unknown; timeTakenSec: number | null; completedAt: Date }[];
    aiSummary: {
      id: string;
      formId: string;
      summary: string;
      themes: unknown;
      sentiment: string;
      actionItems: unknown;
      generatedAt: Date;
    } | null;
    _count: { responses: number };
    org: { id: string; accentColor: string; name: string };
  } | null = null;

  try {
    form = await prisma.form.findUnique({
      where: { id },
      include: {
        responses: {
          orderBy: { completedAt: "desc" },
          take: 50,
        },
        aiSummary: true,
        _count: { select: { responses: true } },
        org: { select: { id: true, accentColor: true, name: true } },
      },
    });
  } catch (err) {
    console.error("[FormDetail] Error fetching form:", err);
  }

  if (!form) {
    notFound();
  }

  const schema = (form.schema as { id: string; label: string; type: string }[]) || [];
  const responseCount = form._count.responses;

  // Calculate stats
  const avgTimeSec = form.responses.length > 0
    ? Math.round(
        form.responses
          .filter((r) => r.timeTakenSec)
          .reduce((sum, r) => sum + (r.timeTakenSec || 0), 0) /
          Math.max(form.responses.filter((r) => r.timeTakenSec).length, 1)
      )
    : 0;

  // Serialize AI summary
  const aiSummary: AiSummaryData | null = form.aiSummary
    ? {
        id: form.aiSummary.id,
        formId: form.aiSummary.formId,
        summary: form.aiSummary.summary,
        themes: form.aiSummary.themes as string[],
        sentiment: form.aiSummary.sentiment as "positive" | "neutral" | "negative",
        actionItems: form.aiSummary.actionItems as string[],
        generatedAt: form.aiSummary.generatedAt,
      }
    : null;

  const publicUrl = `/f/${form.slug}`;

  return (
    <div>
      <TopBar
        title={form.title}
        actions={
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
                form.published
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {form.published ? "Published" : "Draft"}
            </span>
            <Link
              href={`/dashboard/forms/${id}/analytics`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50"
              aria-label="View analytics"
            >
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Link>
            <Link
              href={`/dashboard/forms/new?edit=${id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50"
              aria-label="Edit form"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>
          </div>
        }
      />

      {/* Share Section */}
      <div className="rounded-xl border border-border/40 bg-card p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Share your form</h3>
        </div>
        <FormDetailClient
          formId={id}
          slug={form.slug}
          published={form.published}
          publicUrl={publicUrl}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-border/40 bg-card p-4 text-center">
          <MessageSquare className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{responseCount}</p>
          <p className="text-xs text-muted-foreground">Total responses</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card p-4 text-center">
          <BarChart3 className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {responseCount > 0 ? "100%" : "0%"}
          </p>
          <p className="text-xs text-muted-foreground">Completion rate</p>
        </div>
        <div className="rounded-xl border border-border/40 bg-card p-4 text-center">
          <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">
            {avgTimeSec > 0 ? formatDuration(avgTimeSec) : "—"}
          </p>
          <p className="text-xs text-muted-foreground">Avg time</p>
        </div>
      </div>

      {/* AI Summary */}
      <div className="mb-6">
        <AiSummaryCard
          summary={aiSummary}
          responseCount={responseCount}
          formId={id}
        />
      </div>

      {/* Responses Table */}
      <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
        <div className="border-b border-border/40 px-5 py-4">
          <h3 className="text-base font-semibold text-foreground">Responses</h3>
        </div>

        {form.responses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Response data">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Submitted</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
                  {schema.slice(0, 3).map((field) => (
                    <th key={field.id} className="px-4 py-3 text-left font-medium text-muted-foreground truncate max-w-[150px]">
                      {field.label}
                    </th>
                  ))}
                  {schema.length > 3 && (
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">...</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {form.responses.slice(0, 10).map((response, idx) => {
                  const answers = (response.answers as Record<string, unknown>) || {};
                  return (
                    <tr key={response.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                      <td className="px-4 py-3 text-foreground">
                        {formatRelativeTime(response.completedAt)}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {response.timeTakenSec ? formatDuration(response.timeTakenSec) : "—"}
                      </td>
                      {schema.slice(0, 3).map((field) => (
                        <td key={field.id} className="px-4 py-3 text-foreground truncate max-w-[150px]">
                          {String(answers[field.id] || "—")}
                        </td>
                      ))}
                      {schema.length > 3 && (
                        <td className="px-4 py-3 text-muted-foreground">...</td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-foreground">No responses yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Share your form to start collecting responses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
