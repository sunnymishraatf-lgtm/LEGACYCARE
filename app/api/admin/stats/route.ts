import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const [
      users,
      plans,
      providers,
      pending,
      disputes,
    ] = await Promise.all([
      db.user.count(),

      db.funeralPlan.count(),

      db.serviceProvider.count(),

      db.serviceProvider.count({
        where: {
          status: "PENDING",
        },
      }),

      db.dispute.count(),
    ]);

    return NextResponse.json({
      users,
      plans,
      providers,
      pendingVerifications: pending,
      disputes,
    });
  } catch (error) {
    console.error("GET admin stats error:", error);

    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
