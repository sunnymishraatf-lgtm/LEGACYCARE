import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = [
  "PENDING",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
] as const;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const providers = await db.serviceProvider.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(providers);
  } catch (error) {
    console.error("GET admin providers error:", error);

    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
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

    if (
      typeof body !== "object" ||
      body === null ||
      !("id" in body) ||
      !("status" in body)
    ) {
      return NextResponse.json(
        {
          error: "Provider id and status are required",
        },
        { status: 400 }
      );
    }

    const { id, status } = body as {
      id: unknown;
      status: unknown;
    };

    if (typeof id !== "string" || id.trim() === "") {
      return NextResponse.json(
        { error: "Invalid provider id" },
        { status: 400 }
      );
    }

    if (
      typeof status !== "string" ||
      !ALLOWED_STATUSES.includes(
        status as (typeof ALLOWED_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid provider status" },
        { status: 400 }
      );
    }

    const result = await db.$transaction(async (tx) => {
      const provider = await tx.serviceProvider.update({
        where: {
          id,
        },
        data: {
          status,
          verifiedAt:
            status === "VERIFIED" ? new Date() : null,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action:
            status === "VERIFIED"
              ? "PROVIDER_VERIFIED"
              : "PROVIDER_STATUS_UPDATED",
          resourceType: "PROVIDER",
          resourceId: provider.id,
        },
      });

      return provider;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("PATCH admin provider error:", error);

    return NextResponse.json(
      { error: "Failed to update provider" },
      { status: 500 }
    );
  }
}
