import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import * as cookie from "cookie";
import { verifyToken } from "../../../../../../utils/auth";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// إضافة دالة GET للحصول على اللايكات للتعليق
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: commentId } = await params;

  try {
    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    const likes = await prisma.like.findMany({
      where: { commentId },
      include: {
        user: {
          select: {
            id: true,
            fName: true,
            img: true,
          },
        },
      },
    });

    // استخراج معرفات المستخدمين الذين قاموا بالإعجاب
    const likerIds = likes.map(like => like.userId);

    return NextResponse.json({
      likes,
      likerIds,
      count: likes.length,
    });
  } catch (error) {
    console.error("Error fetching comment likes:", error);
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}

// دالة POST للتعامل مع إضافة/إزالة اللايكات للتعليق
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: commentId } = await params;

  try {
    console.log("✅ Comment Like API Called!");
    console.log("🔹 Params:", params);

    // استخراج commentId من الـ params
    if (!commentId) {
      console.error("❌ commentId is missing from params!");
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    console.log("📌 commentId received:", commentId);

    // استخراج التوكين من الكوكيز
    const cookies = request.headers.get("cookie");
    const parsedCookies = cookies ? cookie.parse(cookies) : {};
    const token = parsedCookies.token;

    // تحقق صارم من وجود التوكن
    if (!token) {
      console.error("❌ Token is missing! User must be logged in to like comments.");
      return NextResponse.json({ 
        error: "Authentication required", 
        message: "You must be logged in to like comments" 
      }, { status: 401 });
    }

    // التحقق من المستخدم
    const user = verifyToken(token);
    if (!user || !user.id) {
      console.error("❌ Invalid Token or missing user ID!");
      return NextResponse.json({ 
        error: "Invalid authentication", 
        message: "Please log in again to like comments" 
      }, { status: 401 });
    }

    console.log("👤 User verified:", user.id);

    // التأكد من أن commentId صالح كـ ObjectId
    if (!ObjectId.isValid(commentId)) {
      console.error("❌ Invalid Comment ID format!");
      return NextResponse.json({ error: "Invalid Comment ID" }, { status: 400 });
    }

    // البحث عن اللايك الحالي
    const existingLike = await prisma.like.findFirst({
      where: { userId: user.id, commentId },
    });

    if (existingLike) {
      // حذف اللايك إذا كان موجود
      console.log("🗑️ Removing existing like:", existingLike.id);
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ 
        message: "Like removed",
        action: "removed"
      });
    }

    // الحصول على معرف المنشور من التعليق
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true }
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // إضافة لايك جديد
    console.log("❤️ Adding new like for user:", user.id);
    try {
      const newLike = await prisma.like.create({
        data: { 
          userId: user.id, 
          postId: comment.postId,
          commentId
        },
      });

      return NextResponse.json({ 
        message: "Comment liked successfully", 
        like: newLike,
        action: "added"
      });
    } catch (error: unknown) {
      // التعامل مع خطأ القيد الفريد
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        console.log("⚠️ Unique constraint violation - like already exists");
        // محاولة تحديث اللايك بدلاً من إنشائه
        const updatedLike = await prisma.like.findFirst({
          where: {
            AND: [
              { userId: user.id },
              { commentId }
            ]
          }
        });
        
        if (updatedLike) {
          await prisma.like.delete({
            where: { id: updatedLike.id }
          });
        }
        
        return NextResponse.json({ 
          message: "Like status updated", 
          action: "removed"
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("❌ Error adding/removing like:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}