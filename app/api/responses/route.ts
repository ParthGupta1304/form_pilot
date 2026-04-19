import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/** POST /api/responses — Submit a public form response (no auth required) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { formId, answers, timeTakenSec } = body;

    if (!formId || !answers) {
      return NextResponse.json({ error: "Missing formId or answers" }, { status: 400 });
    }

    console.log(`[API/responses] POST — formId=${formId}, timeTaken=${timeTakenSec}s`);

    // Verify form exists and is published
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { id: true, published: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.published) {
      return NextResponse.json({ error: "Form is not accepting responses" }, { status: 403 });
    }

    const response = await prisma.response.create({
      data: {
        formId,
        answers,
        timeTakenSec: timeTakenSec || null,
      },
    });

    console.log(`[API/responses] Created response: ${response.id}`);
    return NextResponse.json(response, { status: 201 });
  } catch (err) {
    console.error("[API/responses] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
