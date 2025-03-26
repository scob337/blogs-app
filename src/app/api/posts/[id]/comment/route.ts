import { NextResponse } from "next/server";
import { PrismaClient, Comment } from "@prisma/client";
import * as cookie from "cookie";
import { verifyToken } from "../../../../../../utils/auth";
import { io } from "../../../../../../server";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface CommentRequestBody {
  content: string;
}

export async function POST(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  try {
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

    const user: User | null = verifyToken(token);
    console.log("🔍 Verified User:", user);

    if (!user || !user.id) {
      console.error("❌ Invalid Token!", user);
      return NextResponse.json({ error: "Unauthorized - Invalid Token" }, { status: 401 });
    }

    const body: CommentRequestBody = await req.json();
    if (!body.content || body.content.trim() === "") {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    // ✅ Ensure postId is passed as a string
    const newComment: Comment = await prisma.comment.create({
      data: {
        id: new ObjectId().toString(), // Generate a unique ID for the comment
        userId: user.id, // Ensure user.id is a string
        postId: id.toString(), // Convert ObjectId to string
        content: body.content.trim(),
      },
    });

    console.log("✅ Comment Added Successfully:", newComment);

    // ✅ Send notification via WebSocket
    try {
      io?.emit("commentNotification", {
        message: `💬 A new user commented on your post!`,
        comment: newComment,
      });
      console.log(`📢 New Notification: Comment on post ${id}`);
    } catch (wsError) {
      console.warn(`⚠️ WebSocket not initialized! Ensure \`server.ts\` is running.`, wsError);
    }

    return NextResponse.json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
