import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/** POST /api/forms — Create a new form */
export async function POST(req: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, schema, published, description } = body;

    console.log(`[API/forms] POST — Creating form "${title}" for org ${orgId}`);

    // Get or create org record
    let org = await prisma.organization.findFirst({
      where: { clerkOrgId: orgId },
    });

    if (!org) {
      org = await prisma.organization.create({
        data: {
          clerkOrgId: orgId,
          name: "My Workspace",
          accentColor: "#534AB7",
        },
      });
      console.log(`[API/forms] Created org record: ${org.id}`);
    }

    const form = await prisma.form.create({
      data: {
        orgId: org.id,
        title: title || "Untitled Form",
        slug: slug || Date.now().toString(36),
        description: description || null,
        schema: schema || [],
        published: published || false,
      },
    });

    console.log(`[API/forms] Created form: ${form.id}`);
    return NextResponse.json(form, { status: 201 });
  } catch (err) {
    console.error("[API/forms] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** GET /api/forms — List all forms for current org */
export async function GET() {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const org = await prisma.organization.findFirst({
      where: { clerkOrgId: orgId },
    });

    if (!org) {
      return NextResponse.json([]);
    }

    const forms = await prisma.form.findMany({
      where: { orgId: org.id },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { responses: true } } },
    });

    return NextResponse.json(forms);
  } catch (err) {
    console.error("[API/forms] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
