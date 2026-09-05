import { NextRequest, NextResponse } from "next/server";
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

    const notifications = await db.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);

    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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

    if (
      typeof body !== "object" ||
      body === null ||
      !("id" in body) ||
      typeof body.id !== "string" ||
      body.id.trim() === ""
    ) {
      return NextResponse.json(
        { error: "Notification id is required" },
        { status: 400 }
      );
    }

    const result = await db.notification.updateMany({
      where: {
        id: body.id,
        userId: session.user.id,
      },
      data: {
        isRead: true,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to update notification:", error);

    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
