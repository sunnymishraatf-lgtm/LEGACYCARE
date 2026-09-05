import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { nomineeSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const nominees = await db.nominee.findMany({
      where: {
        plan: {
          userId: session.user.id,
        },
      },
      include: {
        plan: true,
      },
      orderBy: {
        invitedAt: "desc",
      },
    });

    return NextResponse.json(nominees);
  } catch (error) {
    console.error("GET nominees error:", error);

    return NextResponse.json(
      { error: "Failed to fetch nominees" },
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
     * planId is required so the nominee is added to
     * the plan selected by the user.
     */
    if (
      typeof body.planId !== "string" ||
      body.planId.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    const planId = body.planId.trim();

    /*
     * Validate nominee fields using the existing
     * schema in lib/validation.ts.
     *
     * planId is checked separately because it belongs
     * to the relationship between nominee and plan.
     */
    const nomineeData = {
      name: body.name,
      relationship: body.relationship,
      email: body.email,
      phone: body.phone,
      accessLevel: body.accessLevel,
    };

    const validationResult =
      nomineeSchema.safeParse(nomineeData);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid nominee data",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    /*
     * Make sure the selected plan belongs to the
     * logged-in user.
     */
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
     * ADMIN can work with another user's plan,
     * but the plan must still actually exist.
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
    } else if (!plan) {
      return NextResponse.json(
        { error: "Plan not found or access denied" },
        { status: 404 }
      );
    }

    const nominee = await db.nominee.create({
      data: {
        planId,
        name: validationResult.data.name,
        relationship: validationResult.data.relationship,
        email: validationResult.data.email,
        phone: validationResult.data.phone,
        accessLevel: validationResult.data.accessLevel,
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.user.id,
        action: "NOMINEE_ADDED",
        resourceType: "NOMINEE",
        resourceId: nominee.id,
      },
    });

    return NextResponse.json(nominee, {
      status: 201,
    });
  } catch (error) {
    console.error("POST nominees error:", error);

    return NextResponse.json(
      { error: "Failed to add nominee" },
      { status: 500 }
    );
  }
}
