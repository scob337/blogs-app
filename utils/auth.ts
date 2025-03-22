import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

const SECRET_KEY: string = process.env.JWT_SECRET as string;

interface TokenPayload {
  id: string;
}

// ✅ دالة تشفير الباسورد
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// ✅ دالة مقارنة الباسورد المشفر
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// ✅ دالة إنشاء التوكن
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, SECRET_KEY, { expiresIn: "7d" });
};

// ✅ دالة التحقق من صحة التوكن
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as TokenPayload;
  } catch (error) {
    console.error("❌ Verify Token Error:", error instanceof Error ? error.message : "Unknown error");
    return null;
  }
};
