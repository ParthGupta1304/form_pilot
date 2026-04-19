import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PublicFormClient from "./PublicFormClient";
import type { FormField } from "@/lib/types";

interface PublicFormPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicFormPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const form = await prisma.form.findUnique({
      where: { slug },
      select: { title: true, description: true, org: { select: { name: true } } },
    });
    if (form) {
      return {
        title: `${form.title} — ${form.org.name}`,
        description: form.description || `Fill out this form by ${form.org.name}`,
      };
    }
  } catch (err) {
    console.error("[PublicForm] Metadata error:", err);
  }
  return { title: "FormPilot" };
}

export default async function PublicFormPage({ params }: PublicFormPageProps) {
  const { slug } = await params;
  console.log(`[PublicForm] Loading form with slug: ${slug}`);

  let form: {
    id: string;
    title: string;
    description: string | null;
    schema: unknown;
    published: boolean;
    org: { name: string; logoUrl: string | null; accentColor: string };
  } | null = null;

  try {
    form = await prisma.form.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        description: true,
        schema: true,
        published: true,
        org: { select: { name: true, logoUrl: true, accentColor: true } },
      },
    });
  } catch (err) {
    console.error("[PublicForm] Error fetching form:", err);
  }

  if (!form || !form.published) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <span className="text-2xl">🚫</span>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Form not available
          </h1>
          <p className="text-sm text-muted-foreground">
            This form is not currently accepting responses.
          </p>
        </div>
      </div>
    );
  }

  const fields = (form.schema as FormField[]) || [];

  return (
    <PublicFormClient
      formId={form.id}
      title={form.title}
      description={form.description}
      fields={fields}
      orgName={form.org.name}
      orgLogoUrl={form.org.logoUrl}
      accentColor={form.org.accentColor}
    />
  );
}
