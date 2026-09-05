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

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,

        profile: true,

        _count: {
          select: {
            funeralPlans: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 50,
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("GET admin users error:", error);

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
