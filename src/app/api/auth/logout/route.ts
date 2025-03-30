import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  // ✅ حذف الكوكيز بتعيينها إلى قيمة فارغة مع انتهاء صلاحية قديم
  response.cookies.delete("token");
  
  return response;
}
