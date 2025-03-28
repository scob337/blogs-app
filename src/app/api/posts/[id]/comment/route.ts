import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import * as cookie from "cookie";
import { verifyToken } from "../../../../../../utils/auth";
import { io } from "../../../../../server.js";

const prisma = new PrismaClient();

interface User {
  id?: string;
  email?: string;
  name?: string;
}

interface CommentRequestBody {
  content: string;
}




export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
 ): Promise<NextResponse> {
  const { id: postId } = await params;

  try {
    console.log("🔍 Extracted Post ID:", postId);

    if (!postId) {
      console.error("❌ Invalid Post ID!");
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 });
    }

    const cookies = request.headers.get("cookie");
    console.log("🔍 Cookies Received:", cookies);

    const parsedCookies = cookies ? cookie.parse(cookies) : {};
    const token: string | undefined = parsedCookies.token;

    if (!token) {
      console.error("❌ Token is missing!");
      return NextResponse.json({ error: "Unauthorized - No Token" }, { status: 401 });
    }

    const user: User | null = verifyToken(token);

    if (!user || !user.id) {
      console.error("❌ Invalid Token!", user);
      return NextResponse.json({ error: "Unauthorized - Invalid Token" }, { status: 401 });
    }

    const body: CommentRequestBody = await request.json();
    if (!body.content || body.content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    const commentData: Prisma.CommentUncheckedCreateInput = {
      userId: user.id,
      postId: postId,
      content: body.content.trim(),
      id: undefined, // Optional: Let Prisma auto-generate the ID
    };

    const newComment = await prisma.comment.create({ data: commentData });

    try {
      io?.emit("commentNotification", {
        message: `💬 A new user commented on your post!`,
        comment: newComment,
      });
      console.log(`📢 New Notification: Comment on post ${postId}`);
    } catch (wsError) {
      console.warn(
        `⚠️ WebSocket not initialized! Ensure \`server.ts\` is running.`,
        wsError
      );
    }

    return NextResponse.json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
