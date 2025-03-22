import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as cookie from "cookie";
import { verifyToken } from "../../../../../../utils/auth";

const prisma = new PrismaClient();

export async function POST(req: Request, context: { params: { id: string } }) {
  try {
    console.log("✅ API Called for Adding Comment!");

    // استخراج postId من الـ params
    const { id: postId } = context.params;
    if (!postId) {
      console.error("❌ postId is missing from params!");
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

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

    // استخراج محتوى الكومنت من الطلب
    const { content } = await req.json();
    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    // إضافة الكومنت
    const newComment = await prisma.comment.create({
      data: { userId: user.id, postId, content },
    });

    return NextResponse.json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
