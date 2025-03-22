import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../../../utils/auth";

const prisma = new PrismaClient();

// ✅ جلب مقال محدد
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(post);
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ✅ تعديل مقال
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 📌 استخراج التوكن من الكوكيز
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 📌 التحقق من التوكن
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // 📌 جلب المقال والتأكد أنه يخص المستخدم
    const existingPost = await prisma.post.findUnique({ where: { id: params.id } });
    if (!existingPost) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (existingPost.authorId !== decoded.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 📌 تحديث المقال
    const { title, content } = await req.json();
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: { title, content },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("❌ Error updating post:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ✅ حذف مقال
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const existingPost = await prisma.post.findUnique({ where: { id: params.id } });
    if (!existingPost) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (existingPost.authorId !== decoded.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.post.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
