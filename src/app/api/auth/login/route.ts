import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, User } from "@prisma/client";
import { comparePassword, generateToken } from "../../../../../utils/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, password }: { email: string; password: string } = await req.json();

    const user: User | null = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Email or Password is incorrect" }, { status: 401 });
    }

    const isMatch: boolean = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Email or Password is incorrect" }, { status: 401 });
    }

    const token: string = generateToken(user.id);

    const { password: _, ...userWithoutPassword } = user;

    // ✅ إنشاء الاستجابة
    const response = NextResponse.json({ user: userWithoutPassword });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ❗ مهم عند التطوير
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // أسبوع
      sameSite: "strict",
    });

    return response;
  } catch (error: unknown) {
    console.error("❌ Login Error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
