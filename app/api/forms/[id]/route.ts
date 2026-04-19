import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/** PATCH /api/forms/[id] — Update form */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    console.log(`[API/forms/${id}] PATCH — updating:`, Object.keys(body));

    const form = await prisma.form.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(form);
  } catch (err) {
    console.error("[API/forms/[id]] PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** DELETE /api/forms/[id] — Delete form */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log(`[API/forms/${id}] DELETE`);

    await prisma.form.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API/forms/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
