import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// جلب مقالات المؤلف
export const Get = async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    const posts = await prisma.post.findMany({
      where: { authorId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            fName: true,
            lName: true,
            img: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("❌ Error fetching author posts:", error);
    return NextResponse.json(
      { error: "Error fetching author posts" },
      { status: 500 }
    );
  }
}