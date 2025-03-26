import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as cookie from "cookie";
import { verifyToken } from "../../../../../../utils/auth";
import { io } from "../../../../../../server";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export async function POST(req: Request, context: { params: { id: string } }) {
  try {
    const id = await context.params?.id;
    
    console.log("🔍 Extracted Post ID:", id);

    if (!id || !ObjectId.isValid(id)) {
      console.error("❌ Invalid Post ID!");
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 });
    }

    const cookies = req.headers.get("cookie");
    console.log("🔍 Cookies Received:", cookies);

    const parsedCookies = cookies ? cookie.parse(cookies) : {};
    const token: string | undefined = parsedCookies.token;

    if (!token) {
      console.error("❌ Token is missing!");
      return NextResponse.json({ error: "Unauthorized - No Token" }, { status: 401 });
    }

    const user = verifyToken(token);
    console.log("🔍 Verified User:", user);

    if (!user || !user.id) {
      console.error("❌ Invalid Token!", user);
      return NextResponse.json({ error: "Unauthorized - Invalid Token" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.content || body.content.trim() === "") {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    // ✅ تأكد أن postId يتم تمريره كـ String
    const newComment = await prisma.comment.create({
      data: {
        id: new ObjectId().toString(), // Generate a unique ID for the comment
        userId: user.id, // تأكد أن user.id هو String
        postId: id.toString(), // تحويل ObjectId إلى String
        content: body.content.trim(),
      },
    });

    console.log("✅ Comment Added Successfully:", newComment);

    // ✅ إرسال إشعار عبر WebSocket
    try {
      io?.emit("commentNotification", {
        message: `💬 مستخدم جديد علق على منشورك!`,
        comment: newComment,
      });
      console.log(`📢 إشعار جديد: تعليق على المنشور ${id}`);
    } catch (wsError) {
      console.warn(`⚠️ WebSocket غير مهيأ! تأكد من تشغيل \`server.ts\`.`, wsError);
    }

    return NextResponse.json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
