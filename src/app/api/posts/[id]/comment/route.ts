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

// إضافة دالة GET للسماح لأي شخص بمشاهدة التعليقات
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: postId } = await params;

  try {
    console.log("🔍 Fetching comments for Post ID:", postId);

    if (!postId) {
      console.error("❌ Invalid Post ID!");
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 });
    }

    // جلب التعليقات مع معلومات المستخدم والإعجابات
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      orderBy: {
        createdAt: 'desc', // ترتيب التعليقات من الأحدث للأقدم
      },
      include: {
        user: {
          select: {
            id: true,
            fName: true,
            img: true,
          },
        },
        likes: true, // إضافة الإعجابات
      },
    });

    // تنسيق البيانات لتكون أكثر ملاءمة للواجهة
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      authorId: comment.userId,
      author: {
        fName: comment.user?.fName || "Anonymous",
        img: comment.user?.img || "/placeholder-avatar.png"
      },
      createdAt: comment.createdAt.toISOString(),
      likeCount: comment.likes.length // إضافة عدد الإعجابات
    }));

    return NextResponse.json(formattedComments);
  } catch (error) {
    console.error("❌ Error fetching comments:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
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

    // إنشاء التعليق مع تضمين معلومات المستخدم
    const newComment = await prisma.comment.create({
      data: commentData,
      include: {
        user: {
          select: {
            id: true,
            fName: true,
            img: true
          }
        }
      }
    });

    // الحصول على معلومات المنشور وصاحبه
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        title: true,
        authorId: true
      }
    });

    // إرسال إشعار فقط إذا كان المعلق ليس هو صاحب المنشور
    if (post && post.authorId !== user.id) {
      try {
        io?.emit("commentNotification", {
          postId: postId,
          commentId: newComment.id,
          postTitle: post.title,
          commentContent: newComment.content,
          commenterName: newComment.user?.fName || "Unknown",
          commenterId: newComment.userId,
          commenterImg: newComment.user?.img || null,
          recipientId: post.authorId, // معرف صاحب المنشور الذي سيتلقى الإشعار
          createdAt: new Date().toISOString(),
          read: false
        });
        console.log(`📢 New Notification: Comment on post ${postId} by user ${user.id} to author ${post.authorId}`);
      } catch (wsError) {
        console.warn(
          `⚠️ WebSocket not initialized! Ensure \`server.ts\` is running.`,
          wsError
        );
      }
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
