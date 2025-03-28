import { NextResponse } from "next/server";
import { generateToken, hashPassword } from "../../../../../utils/auth";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const userData: Prisma.UserUncheckedCreateInput = {
      name: String(name), 
      email: String(email),
      password: String(hashedPassword),
    };

    const user = await prisma.user.create({ data: userData });

    const token = generateToken(user.id);
    return NextResponse.json({ user, token });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
