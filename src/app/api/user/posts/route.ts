import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../../../utils/auth";

const prisma = new PrismaClient();

// Get current user's posts
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch user posts from the database
    const posts = await prisma.post.findMany({
      where: { authorId: decoded.id },
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
    console.error("❌ Error fetching user posts:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user posts" },
      { status: 500 }
    );
  }
}
