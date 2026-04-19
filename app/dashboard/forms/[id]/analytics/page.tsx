import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TopBar from "@/components/dashboard/TopBar";
import StatCard from "@/components/ui/StatCard";
import { formatDuration } from "@/lib/utils";
import {
  MessageSquare,
  BarChart3,
  Clock,
  TrendingUp,
  Download,
  ChevronRight,
} from "lucide-react";
import AnalyticsCharts from "./AnalyticsCharts";

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  console.log(`[Analytics] Loading analytics for form ${id}`);

  let form: {
    id: string;
    title: string;
    schema: unknown;
    responses: { id: string; answers: unknown; timeTakenSec: number | null; completedAt: Date }[];
    _count: { responses: number };
  } | null = null;

  try {
    form = await prisma.form.findUnique({
      where: { id },
      include: {
        responses: {
          orderBy: { completedAt: "desc" },
        },
        _count: { select: { responses: true } },
      },
    });
  } catch (err) {
    console.error("[Analytics] Error:", err);
  }

  if (!form) notFound();

  const schema = (form.schema as { id: string; label: string; type: string; options?: string[] }[]) || [];
  const responseCount = form._count.responses;

  // Calculate stats
  const timesWithValues = form.responses.filter((r) => r.timeTakenSec);
  const avgTimeSec = timesWithValues.length > 0
    ? Math.round(timesWithValues.reduce((s, r) => s + (r.timeTakenSec || 0), 0) / timesWithValues.length)
    : 0;

  // Responses this week
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const responsesThisWeek = form.responses.filter(
    (r) => new Date(r.completedAt) >= weekAgo
  ).length;

  // Build chart data — responses per day for last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const dailyCounts: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split("T")[0];
    dailyCounts[key] = 0;
  }
  form.responses.forEach((r) => {
    const key = new Date(r.completedAt).toISOString().split("T")[0];
    if (dailyCounts[key] !== undefined) dailyCounts[key]++;
  });

  const chartData = Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
  }));

  // Field-level breakdown
  const fieldBreakdowns = schema.map((field) => {
    const fieldAnswers = form!.responses.map(
      (r) => ((r.answers as Record<string, unknown>) || {})[field.id]
    ).filter((a) => a !== undefined && a !== null);

    if (field.type === "mcq" && field.options) {
      const distribution: Record<string, number> = {};
      field.options.forEach((opt) => (distribution[opt] = 0));
      fieldAnswers.forEach((a) => {
        const val = String(a);
        if (distribution[val] !== undefined) distribution[val]++;
      });
      return { ...field, breakdown: distribution, total: fieldAnswers.length };
    }

    if (field.type === "rating") {
      const nums = fieldAnswers.map(Number).filter((n) => !isNaN(n));
      const avg = nums.length > 0 ? (nums.reduce((s, n) => s + n, 0) / nums.length).toFixed(1) : "0";
      return { ...field, avgRating: parseFloat(avg), total: nums.length };
    }

    return { ...field, total: fieldAnswers.length };
  });

  return (
    <div>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/dashboard/forms" className="hover:text-foreground transition-colors">Forms</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/dashboard/forms/${id}`} className="hover:text-foreground transition-colors truncate max-w-[120px]">
          {form.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">Analytics</span>
      </nav>

      <TopBar
        title="Analytics"
        subtitle={form.title}
        actions={
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label="Export CSV"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        }
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total responses"
          value={responseCount}
          icon={<MessageSquare className="h-4.5 w-4.5" />}
        />
        <StatCard
          label="Completion rate"
          value={responseCount > 0 ? "100%" : "0%"}
          icon={<BarChart3 className="h-4.5 w-4.5" />}
        />
        <StatCard
          label="Avg. time"
          value={avgTimeSec > 0 ? formatDuration(avgTimeSec) : "—"}
          icon={<Clock className="h-4.5 w-4.5" />}
        />
        <StatCard
          label="This week"
          value={responsesThisWeek}
          icon={<TrendingUp className="h-4.5 w-4.5" />}
        />
      </div>

      {/* Charts — client components */}
      <AnalyticsCharts
        chartData={chartData}
        fieldBreakdowns={fieldBreakdowns}
      />
    </div>
  );
}
