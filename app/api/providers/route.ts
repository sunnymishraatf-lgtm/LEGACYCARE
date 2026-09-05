import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category")?.trim();
    const city = searchParams.get("city")?.trim();

    const providers = await db.serviceProvider.findMany({
      where: {
        status: "VERIFIED",

        ...(category
          ? {
              category,
            }
          : {}),

        ...(city
          ? {
              city,
            }
          : {}),
      },

      include: {
        services: true,
        reviews: true,
      },

      orderBy: {
        rating: "desc",
      },
    });

    return NextResponse.json(providers);
  } catch (error) {
    console.error("GET providers error:", error);

    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
