import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { registerSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);
    // DEMO MODE: the signup page stores this temporary account in browser storage.
    return NextResponse.json({ id: `demo-${Date.now()}`, email: validated.email, name: validated.name }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
