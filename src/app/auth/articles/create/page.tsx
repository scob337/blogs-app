
"use client";
import { XCircle, ArrowLeft, Upload, Save, AlertCircle } from "lucide-react"; 
import './EditorPlugins'

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });

export default function CreateArticle() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [category, setCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // التحقق من وجود تغييرات غير محفوظة قبل مغادرة الصفحة
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title || content || thumbnail) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, content, thumbnail]);
  
  // قائمة الفئات المتاحة
  const categories = [
    "تكنولوجيا",
    "صحة",
    "تعليم",
    "رياضة",
    "فن وثقافة",
    "سياحة وسفر",
    "طعام",
    "أعمال",
    "علوم",
    "أخرى"
  ];

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("يرجى إدخال عنوان للمقال");
      return false;
    }
    if (!content.trim()) {
      toast.error("يرجى إدخال محتوى المقال");
      return false;
    }
    if (!category) {
      toast.error("يرجى اختيار فئة للمقال");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setStatus("idle");
    toast.loading("جاري إنشاء المقال...", { id: "creating-article" });
  
    // تجهيز البيانات ككائن JSON
    const postData: { title: string; content: string; thumbnail: string | null; category: string } = {
      title,
      content,
      thumbnail: null,
      category
    };
  
    if (thumbnail) {
      const reader = new FileReader();
      reader.readAsDataURL(thumbnail);
      reader.onloadend = async () => {
        postData.thumbnail = typeof reader.result === "string" ? reader.result : null; // تحويل الصورة إلى Base64
  
        try {
          const res = await fetch("/api/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          });
  
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "فشل في إنشاء المقال");
          }
          
          const data = await res.json();
          
          toast.success("تم إنشاء المقال بنجاح!", { id: "creating-article" });
          setStatus("success");
          
          // توجيه المستخدم إلى صفحة المقال الجديد بعد إنشائه
          setTimeout(() => {
            router.push(`/auth/articles/${data.id}`);
          }, 1500);
          
        } catch (error: any) {
          console.error("Error:", error);
          toast.error(error.message || "حدث خطأ أثناء إنشاء المقال", { id: "creating-article" });
          setStatus("error");
        } finally {
          setLoading(false);
        }
      };
    } else {
      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
  
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "فشل في إنشاء المقال");
        }
        
        const data = await res.json();
        
        toast.success("تم إنشاء المقال بنجاح!", { id: "creating-article" });
        setStatus("success");
        
        // توجيه المستخدم إلى صفحة المقال الجديد بعد إنشائه
        setTimeout(() => {
          router.push(`/auth/articles/${data.id}`);
        }, 1500);
        
      } catch (error: any) {
        console.error("Error:", error);
        toast.error(error.message || "حدث خطأ أثناء إنشاء المقال", { id: "creating-article" });
        setStatus("error");
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
      <Toaster position="bottom-right" />
      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* رأس الصفحة */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">إنشاء مقال جديد</h1>
            <button 
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-indigo-100 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 ml-1 transform rotate-180 group-hover:translate-x-1 transition-transform" />
              <span>العودة</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* نموذج إنشاء المقال */}
          <div className="space-y-6">
            {/* عنوان المقال */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 text-right">عنوان المقال</label>
              <input
                id="title"
                type="text"
                placeholder="أدخل عنوان المقال هنا..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-right"
                dir="rtl"
              />
            </div>
            
            {/* فئة المقال */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 text-right">فئة المقال</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-right"
                dir="rtl"
              >
                <option value="">اختر فئة...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {/* صورة المقال */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">صورة المقال</label>
              <div className="mt-1">
                {preview ? (
                  <div className="relative w-full h-64 mx-auto rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={preview}
                      alt="معاينة صورة المقال"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={handleRemoveThumbnail}
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        aria-label="إزالة الصورة"
                      >
                        <XCircle className="text-red-500 w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-indigo-200 border-dashed rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-indigo-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium mb-1">انقر لتحميل صورة أو اسحب وأفلت</p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG, GIF (الحد الأقصى: 800×400 بكسل)</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      id="dropzone-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* محتوى المقال */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">محتوى المقال</label>
              <div className="mt-1 border border-gray-300 rounded-lg overflow-hidden">
                <FroalaEditor
                  tag="textarea"
                  model={content}
                  onModelChange={setContent}
                  config={{
                    placeholderText: "اكتب محتوى المقال هنا...",
                    direction: "rtl",
                    language: "ar",
                    toolbarSticky: true,
                    pluginsEnabled: ['image', 'link', 'colors', 'codeView', 'codeBeautifier', 'paragraphFormat', 'quote', 'hr', 'paragraphStyle', 'align'],
                    toolbarButtons: [
                      ['bold', 'italic', 'underline', 'strikeThrough'],
                      ['paragraphFormat', 'paragraphStyle', 'color', 'backgroundColor'],
                      ['insertImage', 'insertLink'],
                      ['quote', 'hr', 'align'],
                      ['html', 'fullscreen', 'codeView']
                    ],
                    paragraphFormat: {
                      N: 'عادي',
                      H1: 'عنوان 1',
                      H2: 'عنوان 2',
                      H3: 'عنوان 3',
                      H4: 'عنوان 4'
                    },
                    heightMin: 300,
                    heightMax: 500
                  }}
                />  
              </div>
            </div>

            {/* زر النشر */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                className={`flex items-center gap-2 py-3 px-6 rounded-lg text-white font-medium transition-all
                  ${loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg"}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-pulse">جاري النشر...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>نشر المقال</span>
                  </>
                )}
              </button>
            </div>
            
            {/* رسائل الحالة */}
            {status === "error" && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-right">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>حدث خطأ أثناء إنشاء المقال. يرجى المحاولة مرة أخرى.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
