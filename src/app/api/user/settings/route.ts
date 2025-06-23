import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../../../../../utils/auth";

const prisma = new PrismaClient();

// Update user profile
export async function PUT(req: NextRequest): Promise<NextResponse> {
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

    // Parse request body
    const { fName, lName, bio, img } = await req.json();

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        fName,
        lName,
        bio,
        img,
      },
    });

    // Exclude password from response
    const {...userWithoutPassword } = updatedUser;
      
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { error: "An error occurred while updating user data" },
      { status: 500 }
    );
  }
}
