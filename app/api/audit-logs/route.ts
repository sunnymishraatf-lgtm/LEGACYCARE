import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const isAdmin = session.user.role === "ADMIN";

    const logs = await db.auditLog.findMany({
      where: isAdmin
        ? {}
        : {
            userId: session.user.id,
          },

      orderBy: {
        createdAt: "desc",
      },

      take: 100,

      select: {
        id: true,
        userId: true,
        action: true,
        resourceType: true,
        resourceId: true,
        metadata: true,
        createdAt: true,
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);

    return NextResponse.json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
