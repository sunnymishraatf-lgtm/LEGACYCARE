import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const plan = await db.funeralPlan.findUnique({
      where: {
        id: params.id,
      },
      include: {
        ritualPrefs: true,
        ceremonyPrefs: true,
        budget: true,
        nominees: true,
        documents: true,
        versions: {
          orderBy: {
            version: "desc",
          },
        },
        serviceRequests: {
          include: {
            provider: true,
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Only the owner or an ADMIN can view the plan.
    if (
      plan.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("GET plan error:", error);

    return NextResponse.json(
      { error: "Failed to fetch plan" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const plan = await db.funeralPlan.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Owner or ADMIN can update the plan.
    if (
      plan.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
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
     * Only allow fields that are actually editable.
     *
     * IMPORTANT:
     * Do NOT use `...body` here.
     *
     * Fields such as userId, status, progress, finalizedAt, etc.
     * should not be changed simply because a browser sends them.
     */

    const data: {
      title?: string;
      funeralLocation?: string | null;
      funeralCity?: string | null;
      funeralType?: string | null;
      religiousType?: string | null;
      specialInstructions?: string | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (body.title !== undefined) {
      if (
        typeof body.title !== "string" ||
        body.title.trim().length === 0
      ) {
        return NextResponse.json(
          { error: "Title must be a non-empty string" },
          { status: 400 }
        );
      }

      data.title = body.title.trim();
    }

    if (body.funeralLocation !== undefined) {
      if (
        body.funeralLocation !== null &&
        typeof body.funeralLocation !== "string"
      ) {
        return NextResponse.json(
          { error: "Invalid funeralLocation" },
          { status: 400 }
        );
      }

      data.funeralLocation =
        typeof body.funeralLocation === "string"
          ? body.funeralLocation.trim()
          : null;
    }

    if (body.funeralCity !== undefined) {
      if (
        body.funeralCity !== null &&
        typeof body.funeralCity !== "string"
      ) {
        return NextResponse.json(
          { error: "Invalid funeralCity" },
          { status: 400 }
        );
      }

      data.funeralCity =
        typeof body.funeralCity === "string"
          ? body.funeralCity.trim()
          : null;
    }

    if (body.funeralType !== undefined) {
      if (
        body.funeralType !== null &&
        typeof body.funeralType !== "string"
      ) {
        return NextResponse.json(
          { error: "Invalid funeralType" },
          { status: 400 }
        );
      }

      data.funeralType =
        typeof body.funeralType === "string"
          ? body.funeralType.trim()
          : null;
    }

    if (body.religiousType !== undefined) {
      if (
        body.religiousType !== null &&
        typeof body.religiousType !== "string"
      ) {
        return NextResponse.json(
          { error: "Invalid religiousType" },
          { status: 400 }
        );
      }

      data.religiousType =
        typeof body.religiousType === "string"
          ? body.religiousType.trim()
          : null;
    }

    if (body.specialInstructions !== undefined) {
      if (
        body.specialInstructions !== null &&
        typeof body.specialInstructions !== "string"
      ) {
        return NextResponse.json(
          { error: "Invalid specialInstructions" },
          { status: 400 }
        );
      }

      data.specialInstructions =
        typeof body.specialInstructions === "string"
          ? body.specialInstructions.trim()
          : null;
    }

    /*
     * `changes` belongs to PlanVersion, NOT FuneralPlan.
     * We intentionally take it out of the plan update.
     */
    const changes =
      typeof body.changes === "string" &&
      body.changes.trim().length > 0
        ? body.changes.trim()
        : "Plan updated";

    const updated = await db.funeralPlan.update({
      where: {
        id: params.id,
      },
      data,
    });

    const versionCount = await db.planVersion.count({
      where: {
        planId: params.id,
      },
    });

    await db.planVersion.create({
      data: {
        planId: params.id,
        version: versionCount + 1,
        changes,
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "PLAN_UPDATED",
        resourceType: "FUNERAL_PLAN",
        resourceId: params.id,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH plan error:", error);

    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const plan = await db.funeralPlan.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      );
    }

    // Owner or ADMIN can delete the plan.
    if (
      plan.userId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    /*
     * Save the audit information BEFORE deleting the plan.
     *
     * This is important if your database has relations that
     * remove related records when the plan is deleted.
     */
    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "PLAN_DELETED",
        resourceType: "FUNERAL_PLAN",
        resourceId: params.id,
      },
    });

    await db.funeralPlan.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE plan error:", error);

    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    );
  }
}
