import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../../utils/auth";

const prisma = new PrismaClient();

// ✅ إنشاء مقال جديد
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 📌 استخراج التوكن من الكوكيز
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 📌 التحقق من التوكن
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // 📌 جلب بيانات المقال
    const { title, content, thumbnail } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // 📌 إنشاء المقال في قاعدة البيانات
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        thumbnail, 
        authorId: decoded.id,
      },
    });

    return NextResponse.json(newPost , { status: 201 });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


// ✅ جلب جميع المقالات
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: { 
          select: { 
            id: true, 
            fName: true, 
            img: true 
          } 
        },
      },
    });

    // 📌 حل المشكلة عن طريق استبدال `null` بكائن فارغ إذا لم يكن هناك مؤلف
    const formattedPosts = posts.map(post => ({
      ...post,
      author: post.author ?? { id: null, fName: "Unknown", img: null }
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

