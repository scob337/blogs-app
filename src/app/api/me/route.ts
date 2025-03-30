import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../../utils/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // فك التوكن
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log("✅ Decoded User ID:", decoded.id); // ديبسوج عشان تتأكد إنه راجع صح

    // جلب بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, fName: true, lName: true, email: true, img: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ Fetch User Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
