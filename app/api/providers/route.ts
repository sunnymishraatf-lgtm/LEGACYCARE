import { NextRequest, NextResponse } from "next/server";

import { demoProviders } from "@/lib/demo-data/providers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category")?.trim();
    const city = searchParams.get("city")?.trim();

    const providers = demoProviders
      .filter((provider) => !category || provider.category === category)
      .filter((provider) => !city || provider.city.toLowerCase() === city.toLowerCase())
      .sort((a, b) => b.rating - a.rating);

    return NextResponse.json(providers);
  } catch (error) {
    console.error("GET providers error:", error);

    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}
