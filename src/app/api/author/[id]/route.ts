import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch author data
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    const author = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fName: true,
        lName: true,
        img: true,
        bio: true,
      },
    });

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error('❌ Error fetching author:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching author data' },
      { status: 500 }
    );
  }
}
