import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
import { planSchema } from "@/lib/validation";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const plans = await db.funeralPlan.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        ritualPrefs: true,
        ceremonyPrefs: true,
        budget: true,

        _count: {
          select: {
            nominees: true,
            documents: true,
            serviceRequests: true,
          },
        },

        versions: {
          orderBy: {
            version: "desc",
          },
          take: 1,
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("GET plans error:", error);

    return NextResponse.json(
      { error: "Failed to fetch plans" },
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

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const validationResult = planSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid plan data",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const validated = validationResult.data;

    const result = await db.$transaction(async (tx) => {
      const plan = await tx.funeralPlan.create({
        data: {
          userId: session.user.id,

          title: validated.title,

          funeralLocation:
            validated.funeralLocation || null,

          funeralCity:
            validated.funeralCity || null,

          funeralType:
            validated.funeralType || null,

          religiousType:
            validated.religiousType || null,

          specialInstructions:
            validated.specialInstructions || null,

          versions: {
            create: {
              version: 1,
              changes: "Initial plan created",
            },
          },
        },

        include: {
          ritualPrefs: true,
          ceremonyPrefs: true,
          budget: true,
          nominees: true,
          documents: true,
          versions: true,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: "PLAN_CREATED",
          resourceType: "FUNERAL_PLAN",
          resourceId: plan.id,
        },
      });

      return plan;
    });

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    console.error("POST plan error:", error);

    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 }
    );
  }
}
