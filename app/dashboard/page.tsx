import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LayoutDashboard, FileText, Sparkles, Globe, Plus, MessageSquare } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import TopBar from "@/components/dashboard/TopBar";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const firstName = user?.firstName || "there";

  // Determine greeting based on time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  console.log(`[Dashboard] userId=${userId}, orgId=${orgId}, greeting=${greeting}`);

  // Fetch metrics — wrap in try/catch for resilience
  let totalForms = 0;
  let totalResponses = 0;
  let aiSummariesCount = 0;
  let publishedThisMonth = 0;
  let recentForms: {
    id: string;
    title: string;
    published: boolean;
    updatedAt: Date;
    _count: { responses: number };
  }[] = [];

  try {
    if (orgId) {
      // Find organization in our DB
      const org = await prisma.organization.findFirst({
        where: { clerkOrgId: orgId },
      });

      if (org) {
        const orgDbId = org.id;

        // Parallel queries for performance
        const [formsCount, responsesCount, summariesCount, publishedCount, forms] =
          await Promise.all([
            prisma.form.count({ where: { orgId: orgDbId } }),
            prisma.response.count({
              where: { form: { orgId: orgDbId } },
            }),
            prisma.aiSummary.count({
              where: { form: { orgId: orgDbId } },
            }),
            prisma.form.count({
              where: {
                orgId: orgDbId,
                published: true,
                updatedAt: {
                  gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
              },
            }),
            prisma.form.findMany({
              where: { orgId: orgDbId },
              orderBy: { updatedAt: "desc" },
              take: 5,
              include: { _count: { select: { responses: true } } },
            }),
          ]);

        totalForms = formsCount;
        totalResponses = responsesCount;
        aiSummariesCount = summariesCount;
        publishedThisMonth = publishedCount;
        recentForms = forms;

        console.log(`[Dashboard] Loaded: ${totalForms} forms, ${totalResponses} responses, ${aiSummariesCount} summaries`);
      } else {
        console.log("[Dashboard] No org record found in DB for clerkOrgId:", orgId);
      }
    } else {
      console.log("[Dashboard] No orgId in auth context — user may not have an org yet");
    }
  } catch (err) {
    console.error("[Dashboard] Error fetching dashboard data:", err);
  }

  return (
    <div>
      <TopBar
        title={`${greeting}, ${firstName}`}
        actions={
          <Link
            href="/dashboard/forms/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/50"
            aria-label="Create new form"
          >
            <Plus className="h-4 w-4" /> New form
          </Link>
        }
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total forms"
          value={totalForms}
          icon={<FileText className="h-4.5 w-4.5" />}
          trend={totalForms > 0 ? { value: 12, positive: true } : undefined}
        />
        <StatCard
          label="Total responses"
          value={totalResponses}
          icon={<MessageSquare className="h-4.5 w-4.5" />}
          trend={totalResponses > 0 ? { value: 8, positive: true } : undefined}
        />
        <StatCard
          label="AI summaries"
          value={aiSummariesCount}
          icon={<Sparkles className="h-4.5 w-4.5" />}
        />
        <StatCard
          label="Published this month"
          value={publishedThisMonth}
          icon={<Globe className="h-4.5 w-4.5" />}
        />
      </div>

      {/* Recent forms */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent forms</h2>

        {recentForms.length > 0 ? (
          <div className="rounded-xl border border-border/40 bg-card divide-y divide-border/40">
            {recentForms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block"
                    >
                      {form.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatRelativeTime(form.updatedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={cn(
                      "hidden sm:inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                      form.published
                        ? "bg-success/10 text-success"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {form.published ? "Published" : "Draft"}
                  </span>
                  <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {form._count.responses}
                  </span>
                  <Link
                    href={`/dashboard/forms/${form.id}`}
                    className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    aria-label={`View form: ${form.title}`}
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="You haven't created any forms yet"
            description="Create your first form to start collecting responses."
            action={
              <Link
                href="/dashboard/forms/new"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/50"
                aria-label="Create your first form"
              >
                <Plus className="h-4 w-4" /> Create your first form
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}