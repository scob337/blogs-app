import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateToken, hashPassword } from "../../../../../utils/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = generateToken(user.id);
    return NextResponse.json({ user, token });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
