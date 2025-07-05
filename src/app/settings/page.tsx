'use client';

import { useState, useEffect } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { User, Camera, Save, Lock, KeyRound, Eye, EyeOff, ArrowLeft, Shield, UserCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface UserSettings {
  fName: string;
  lName: string;
  bio: string;
  img: string;
}

interface PasswordSettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [userSettings, setUserSettings] = useState<UserSettings>({
    fName: '',
    lName: '',
    bio: '',
    img: ''
  });
  const [passwordSettings, setPasswordSettings] = useState<PasswordSettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      setUserSettings({
        fName: user.fName || '',
        lName: user.lName || '',
        bio: user.bio || '',
        img: user.img || ''
      });
      setPreview(user.img || null);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate inputs
    if (!userSettings.fName.trim() || !userSettings.lName.trim()) {
      toast.error('يرجى إدخال الاسم الأول والأخير');
      setIsSubmitting(false);
      return;
    }

    try {
      let imageData = userSettings.img;

      if (profileImage) {
        // Check file size (2MB limit)
        if (profileImage.size > 2 * 1024 * 1024) {
          toast.error('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
          setIsSubmitting(false);
          return;
        }

        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(profileImage);
        });
        imageData = await promise;
      }

      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userSettings,
          img: imageData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'حدث خطأ أثناء تحديث المعلومات');
      }

      toast.success('تم تحديث ملفك الشخصي بنجاح');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء تحديث المعلومات');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate password
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      toast.error('كلمات المرور الجديدة غير متطابقة');
      setIsSubmitting(false);
      return;
    }

    if (passwordSettings.newPassword.length < 8) {
      toast.error('يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordSettings.currentPassword,
          newPassword: passwordSettings.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'حدث خطأ أثناء تغيير كلمة المرور');
      }

      setPasswordSettings({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success('تم تغيير كلمة المرور بنجاح');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <Toaster position="bottom-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link href="/auth" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">إعدادات الحساب</h1>
          </div>
          {user && (
            <Link href={`/author/${user.id}`} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg transition flex items-center">
              <UserCircle className="w-5 h-5 ml-2" />
              عرض الملف الشخصي
            </Link>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 text-sm font-medium flex items-center ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <User className="w-4 h-4 ml-2" />
              الملف الشخصي
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-4 text-sm font-medium flex items-center ${activeTab === 'password' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Lock className="w-4 h-4 ml-2" />
              كلمة المرور
            </button>
          </div>

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-blue-100 mb-4 shadow-md group">
                  <Image
                    src={preview || '/placeholder-avatar.png'}
                    alt="الصورة الشخصية"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <label className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg cursor-pointer transition flex items-center">
                  <Camera className="w-5 h-5 ml-2" />
                  تغيير الصورة
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">الحد الأقصى لحجم الصورة: 2 ميجابايت</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fName" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    الاسم الأول
                  </label>
                  <input
                    type="text"
                    id="fName"
                    name="fName"
                    value={userSettings.fName}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-right"
                    dir="rtl"
                    placeholder="أدخل اسمك الأول"
                  />
                </div>
                <div>
                  <label htmlFor="lName" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                    الاسم الأخير
                  </label>
                  <input
                    type="text"
                    id="lName"
                    name="lName"
                    value={userSettings.lName}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-right"
                    dir="rtl"
                    placeholder="أدخل اسمك الأخير"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  نبذة شخصية
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={userSettings.bio}
                  onChange={handleUserChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-right"
                  placeholder="اكتب نبذة قصيرة عن نفسك..."
                  dir="rtl"
                  maxLength={300}
                />
                <p className="text-xs text-gray-500 mt-1 text-left">{userSettings.bio.length}/300</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition-colors'}`}
                >
                  <Save className="w-5 h-5 ml-2" />
                  {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              </div>
            </form>
          )}

          {/* Password Settings */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5 ml-3" />
                  <div>
                    <h3 className="text-amber-800 font-medium text-right">تغيير كلمة المرور</h3>
                    <p className="text-amber-700 text-sm text-right">تأكد من اختيار كلمة مرور قوية تحتوي على أحرف وأرقام ورموز.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  كلمة المرور الحالية
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordSettings.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-right"
                    required
                    dir="rtl"
                  />
                  <KeyRound className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordSettings.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-right"
                    required
                    dir="rtl"
                    minLength={8}
                  />
                  <KeyRound className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">يجب أن تكون كلمة المرور 8 أحرف على الأقل</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordSettings.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-right"
                    required
                    dir="rtl"
                  />
                  <KeyRound className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition-colors'}`}
                >
                  <Lock className="w-5 h-5 ml-2" />
                  {isSubmitting ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
