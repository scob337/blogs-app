import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import * as cookie from "cookie";
import { verifyToken } from "../../../../../../utils/auth";

const prisma = new PrismaClient();

// إضافة دالة GET للحصول على اللايكات
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: postId } = await params;

  try {
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const likes = await prisma.like.findMany({
      where: { postId },
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

    return NextResponse.json({
      likes,
      count: likes.length,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}

// دالة POST الحالية تبقى كما هي للتعامل مع إضافة/إزالة اللايكات
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id: postId } = await params;

  try {
    console.log("✅ Like API Called!");
    console.log("🔹 Params:", params);

    // استخراج postId من الـ params
    if (!postId) {
      console.error("❌ postId is missing from params!");
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    console.log("📌 postId received:", postId);

    // استخراج التوكين من الكوكيز
    const cookies = request.headers.get("cookie");
    const parsedCookies = cookies ? cookie.parse(cookies) : {};
    const token = parsedCookies.token;

    // تحقق صارم من وجود التوكن
    if (!token) {
      console.error("❌ Token is missing! User must be logged in to like posts.");
      return NextResponse.json({ 
        error: "Authentication required", 
        message: "You must be logged in to like posts" 
      }, { status: 401 });
    }

    // التحقق من المستخدم
    const user = verifyToken(token);
    if (!user || !user.id) {
      console.error("❌ Invalid Token or missing user ID!");
      return NextResponse.json({ 
        error: "Invalid authentication", 
        message: "Please log in again to like posts" 
      }, { status: 401 });
    }

    console.log("👤 User verified:", user.id);

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
      console.log("🗑️ Removing existing like:", existingLike.id);
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ 
        message: "Like removed",
        action: "removed"
      });
    }

    // إضافة لايك جديد
    console.log("❤️ Adding new like for user:", user.id);
    try {
      const newLike = await prisma.like.create({
        data: { 
          userId: user.id, 
          postId,
          commentId: null // إضافة قيمة صريحة للـ commentId
        },
      });

      return NextResponse.json({ 
        message: "Post liked successfully", 
        like: newLike,
        action: "added"
      });
    } catch (error) {
      // التعامل مع خطأ القيد الفريد
      if (error.code === 'P2002') {
        console.log("⚠️ Unique constraint violation - like already exists");
        // محاولة تحديث اللايك بدلاً من إنشائه
        const updatedLike = await prisma.like.upsert({
          where: {
            userId_postId: {
              userId: user.id,
              postId
            }
          },
          update: {}, // لا تحديثات ضرورية
          create: { 
            userId: user.id, 
            postId,
            commentId: null 
          }
        });
        
        return NextResponse.json({ 
          message: "Post liked successfully (upsert)", 
          like: updatedLike,
          action: "added"
        });
      }
      throw error; // إعادة رمي الخطأ إذا كان من نوع آخر
    }
  } catch (error) {
    console.error("❌ Error adding/removing like:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
