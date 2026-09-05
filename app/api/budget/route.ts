import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const BUDGET_FIELDS = [
  "totalBudget",
  "funeralService",
  "transportation",
  "flowers",
  "clergy",
  "decoration",
  "cremation",
  "other",
] as const;

type BudgetField = (typeof BUDGET_FIELDS)[number];

function validateBudgetValue(
  value: unknown,
  field: BudgetField
): number | null {
  if (typeof value !== "number") {
    throw new Error(`${field} must be a number`);
  }

  if (!Number.isFinite(value)) {
    throw new Error(`${field} must be a valid number`);
  }

  if (value < 0) {
    throw new Error(`${field} cannot be negative`);
  }

  return value;
}

function getBudgetData(body: Record<string, unknown>) {
  const budgetData: Record<string, number> = {};

  for (const field of BUDGET_FIELDS) {
    if (body[field] !== undefined) {
      budgetData[field] = validateBudgetValue(
        body[field],
        field
      ) as number;
    }
  }

  return budgetData;
}

async function checkPlanAccess(
  planId: string,
  userId: string,
  role?: string
) {
  const plan = await db.funeralPlan.findFirst({
    where: {
      id: planId,
      userId,
    },
    select: {
      id: true,
    },
  });

  // ADMIN can access plans belonging to other users.
  if (!plan && role !== "ADMIN") {
    return false;
  }

  // For admins, also make sure the plan actually exists.
  if (!plan && role === "ADMIN") {
    const adminPlan = await db.funeralPlan.findUnique({
      where: {
        id: planId,
      },
      select: {
        id: true,
      },
    });

    return !!adminPlan;
  }

  return true;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    const hasAccess = await checkPlanAccess(
      planId,
      session.user.id,
      session.user.role
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Plan not found or access denied" },
        { status: 404 }
      );
    }

    const budget = await db.budget.findUnique({
      where: {
        planId,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("GET budget error:", error);

    return NextResponse.json(
      { error: "Failed to fetch budget" },
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

    const planId = body.planId;

    if (typeof planId !== "string" || planId.trim().length === 0) {
      return NextResponse.json(
        { error: "planId is required" },
        { status: 400 }
      );
    }

    const hasAccess = await checkPlanAccess(
      planId,
      session.user.id,
      session.user.role
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Plan not found or access denied" },
        { status: 404 }
      );
    }

    let budgetData: Record<string, number>;

    try {
      budgetData = getBudgetData(body);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Invalid budget data";

      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }

    /*
     * The Prisma schema has:
     *
     * totalBudget
     * funeralService
     * transportation
     * flowers
     * clergy
     * decoration
     * cremation
     * other
     *
     * Only these fields are allowed.
     */
    const budget = await db.budget.upsert({
      where: {
        planId,
      },
      update: budgetData,
      create: {
        planId,
        ...budgetData,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("POST budget error:", error);

    return NextResponse.json(
      { error: "Failed to save budget" },
      { status: 500 }
    );
  }
}
