import { NextResponse } from "next/server";
import { generateToken, hashPassword } from "../../../../../utils/auth";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { fName, lName, email, password, img } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // إنشاء رابط الصورة الافتراضية باستخدام الاسم الأول واسم العائلة
    const defaultImg = `https://avatar.iran.liara.run/username?username=${encodeURIComponent(fName + ' ' + lName)}`;

    const userData: Prisma.UserUncheckedCreateInput = {
      fName: String(fName),
      lName: String(lName),
      email: String(email),
      password: String(hashedPassword),
      img: img ? String(img) : defaultImg,
    };

    const user = await prisma.user.create({ data: userData });

    const token = generateToken(user.id);
    
    // ✅ إنشاء الاستجابة مع التوكن في الـ cookies
    const { password: _, ...userWithoutPassword } = user;
    const response = NextResponse.json({ user: userWithoutPassword });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // أسبوع
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
