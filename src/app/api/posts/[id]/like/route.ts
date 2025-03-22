import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import * as cookie from "cookie";
import { verifyToken } from "../../../../../../utils/auth";

const prisma = new PrismaClient();

export async function POST(req: Request, context: { params: { id: string } }) {
  try {
    console.log("✅ API Called!");
    console.log("🔹 Context Params:", context.params);

    // استخراج postId من الـ params
    const { id: postId } = context.params;
    if (!postId) {
      console.error("❌ postId is missing from params!");
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    console.log("📌 postId received:", postId);

    // استخراج التوكين من الكوكيز
    const cookies = req.headers.get("cookie");
    const parsedCookies = cookies ? cookie.parse(cookies) : {};
    const token = parsedCookies.token;

    if (!token) {
      console.error("❌ Token is missing!");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // التحقق من المستخدم
    const user = verifyToken(token);
    if (!user) {
      console.error("❌ Invalid Token!");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // التأكد من أن postId صالح كـ ObjectId
    if (!ObjectId.isValid(postId)) {
      console.error("❌ Invalid Post ID format!");
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 });
    }

    // البحث عن اللايك الحالي
    const existingLike = await prisma.like.findFirst({
      where: { userId: user.id, postId },
    });

    if (existingLike) {
      // حذف اللايك إذا كان موجود
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ message: "Like removed" });
    }

    // إضافة لايك جديد
    const newLike = await prisma.like.create({
      data: { userId: user.id, postId },
    });

    return NextResponse.json({ message: "Post liked successfully", like: newLike });
  } catch (error) {
    console.error("❌ Error adding/removing like:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
