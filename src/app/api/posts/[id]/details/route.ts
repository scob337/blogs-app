import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    console.log("✅ API Called for Fetching Post Details!");

    // استخراج postId من الـ params
    const { id: postId } = context.params;
    if (!postId) {
      console.error("❌ postId is missing from params!");
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // جلب البوست مع اللايكات والكومنتات
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: { select: { id: true, name: true } },
        likes: { select: { userId: true } },
        comments: { select: { id: true, content: true, user: { select: { id: true, name: true } } } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("❌ Error fetching post details:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
