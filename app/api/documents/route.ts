import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { documentSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const documents = await db.document.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("GET documents error:", error);

    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body: Record<string, unknown>;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    /*
     * Validate the fields that are defined in
     * lib/validation.ts.
     */
    const validationResult = documentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid document data",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      name,
      fileType,
      isPrivate,
    } = validationResult.data;

    /*
     * planId is optional in the Prisma schema.
     *
     * If a planId is supplied, make sure the plan belongs
     * to the currently logged-in user.
     */
    let planId: string | null = null;

    if (body.planId !== undefined && body.planId !== null) {
      if (
        typeof body.planId !== "string" ||
        body.planId.trim().length === 0
      ) {
        return NextResponse.json(
          { error: "Invalid planId" },
          { status: 400 }
        );
      }

      planId = body.planId.trim();

      const plan = await db.funeralPlan.findFirst({
        where: {
          id: planId,
          userId: session.user.id,
        },
        select: {
          id: true,
        },
      });

      /*
       * ADMIN can work with other users' plans.
       */
      if (!plan && session.user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Plan not found or access denied" },
          { status: 404 }
        );
      }

      /*
       * Even ADMIN should not be able to attach a document
       * to a plan that doesn't exist.
       */
      if (!plan && session.user.role === "ADMIN") {
        const adminPlan = await db.funeralPlan.findUnique({
          where: {
            id: planId,
          },
          select: {
            id: true,
          },
        });

        if (!adminPlan) {
          return NextResponse.json(
            { error: "Plan not found" },
            { status: 404 }
          );
        }
      }
    }

    /*
     * fileSize is stored as an Int in Prisma.
     *
     * Keep a safe default of 0 when the client doesn't send it.
     */
    let fileSize = 0;

    if (body.fileSize !== undefined) {
      if (
        typeof body.fileSize !== "number" ||
        !Number.isInteger(body.fileSize) ||
        body.fileSize < 0
      ) {
        return NextResponse.json(
          { error: "fileSize must be a non-negative integer" },
          { status: 400 }
        );
      }

      fileSize = body.fileSize;
    }

    /*
     * fileUrl is required by the Prisma schema.
     * Keep an empty string as a fallback for compatibility
     * with the current upload flow.
     */
    let fileUrl = "";

    if (body.fileUrl !== undefined) {
      if (typeof body.fileUrl !== "string") {
        return NextResponse.json(
          { error: "fileUrl must be a string" },
          { status: 400 }
        );
      }

      fileUrl = body.fileUrl;
    }

    const doc = await db.document.create({
      data: {
        userId: session.user.id,
        name,
        fileType,
        fileSize,
        fileUrl,
        isPrivate,
        planId,
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "DOCUMENT_UPLOADED",
        resourceType: "DOCUMENT",
        resourceId: doc.id,
      },
    });

    return NextResponse.json(doc, {
      status: 201,
    });
  } catch (error) {
    console.error("POST documents error:", error);

    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
