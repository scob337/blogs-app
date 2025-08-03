# دليل إصلاح مشكلة التوكن - Token Fix Guide

## 🚨 المشكلة
كان التوكن لا يتم حفظه في الموقع بعد تسجيل الدخول إلا بعد إعادة تحميل الصفحة يدوياً.

## ✅ الحلول المطبقة

### 1. تحديث UserContext (`contexts/UserContext.tsx`)
```typescript
// إضافة وظيفة refreshUser
const refreshUser = async () => {
  setLoading(true);
  await fetchUser();
};

// تحسين وظيفة login
const login = async (userData: User) => {
  setUser(userData);
  setLoading(false);
  
  setTimeout(() => {
    router.replace("/auth");
  }, 500); // زيادة التأخير لضمان حفظ التوكن
};
```

### 2. تحديث صفحة تسجيل الدخول (`src/app/login/page.tsx`)
```typescript
// إضافة refreshUser بعد تسجيل الدخول
await login(userData.user);

// انتظار لحفظ التوكن
await new Promise(resolve => setTimeout(resolve, 300));

// تحديث بيانات المستخدم
await refreshUser();
```

### 3. إنشاء Utility Functions (`utils/fetch.ts`)
```typescript
// ضمان إرسال credentials في جميع الطلبات
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: 'include', // Always include credentials
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};
```

### 4. تحديث API Routes
#### Login Route (`src/app/api/auth/login/route.ts`)
```typescript
response.cookies.set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // أسبوع
  sameSite: "lax", // تحسين التوافق
});
```

#### Register Route (`src/app/api/auth/register/route.ts`)
```typescript
// إضافة إرسال التوكن في الـ cookies
const response = NextResponse.json({ user: userWithoutPassword });

response.cookies.set("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
  sameSite: "lax",
});
```

## 🔧 خطوات التطبيق

### 1. تأكد من وجود JWT_SECRET
أضف في ملف `.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### 2. إعادة تشغيل الخادم
```bash
npm run dev
# أو
yarn dev
```

### 3. اختبار الوظائف
استخدم ملف `utils/test-token.js` لاختبار التوكن:
```javascript
// في console المتصفح
window.tokenTests.checkToken();
window.tokenTests.testApiCall();
window.tokenTests.testLogin(email, password);
```

## 🎯 النتيجة المتوقعة

بعد تطبيق الحلول:
1. ✅ يتم حفظ التوكن فوراً في الـ cookies
2. ✅ يتم تحديث حالة المستخدم في الـ context
3. ✅ يتم التوجيه التلقائي إلى الصفحة المطلوبة
4. ✅ لا حاجة لإعادة تحميل الصفحة يدوياً

## 🐛 استكشاف الأخطاء

### إذا لم يعمل التوكن:
1. تأكد من وجود `JWT_SECRET` في `.env`
2. تأكد من أن `NODE_ENV=development` في بيئة التطوير
3. تحقق من console المتصفح للأخطاء
4. استخدم `window.tokenTests.checkToken()` لفحص التوكن

### إذا لم يتم التوجيه:
1. تحقق من middleware في `src/middleware.ts`
2. تأكد من أن الـ routes صحيحة
3. تحقق من console للأخطاء

## 📝 ملاحظات مهمة

- في بيئة التطوير: `secure: false` للـ cookies
- في بيئة الإنتاج: `secure: true` للـ cookies
- `sameSite: "lax"` لتحسين التوافق
- `credentials: 'include'` في جميع الطلبات
- تأخير 300-500ms لضمان حفظ التوكن

## 🔄 التحديثات المستقبلية

- إضافة refresh token mechanism
- تحسين error handling
- إضافة automatic token refresh
- تحسين UX مع loading states 