import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TopBar from "@/components/dashboard/TopBar";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import FormsListClient from "./FormsListClient";

export default async function FormsListPage() {
  const { userId, orgId } = await auth();
  if (!userId) redirect("/sign-in");

  console.log(`[FormsListPage] userId=${userId}, orgId=${orgId}`);

  let forms: {
    id: string;
    title: string;
    slug: string;
    published: boolean;
    updatedAt: Date;
    _count: { responses: number };
  }[] = [];

  try {
    if (orgId) {
      const org = await prisma.organization.findFirst({
        where: { clerkOrgId: orgId },
      });

      if (org) {
        forms = await prisma.form.findMany({
          where: { orgId: org.id },
          orderBy: { updatedAt: "desc" },
          include: { _count: { select: { responses: true } } },
        });
        console.log(`[FormsListPage] Loaded ${forms.length} forms`);
      }
    }
  } catch (err) {
    console.error("[FormsListPage] Error fetching forms:", err);
  }

  return (
    <div>
      <TopBar
        title="Your forms"
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

      {forms.length > 0 ? (
        <FormsListClient
          forms={forms.map((f) => ({
            id: f.id,
            title: f.title,
            slug: f.slug,
            published: f.published,
            responseCount: f._count.responses,
            updatedAt: f.updatedAt.toISOString(),
          }))}
        />
      ) : (
        <EmptyState
          icon={<FileText className="h-6 w-6" />}
          title="No forms yet"
          description="Create your first form to start collecting responses from your audience."
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
  );
}
