import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);
    const existing = await db.user.findUnique({ where: { email: validated.email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(validated.password, 12);
    const user = await db.user.create({
      data: {
        email: validated.email,
        name: validated.name,
        password: hashedPassword,
        role: validated.role,
      },
    });
    await db.auditLog.create({
      data: { userId: user.id, action: "USER_REGISTERED", resourceType: "USER", resourceId: user.id },
    });
    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
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
