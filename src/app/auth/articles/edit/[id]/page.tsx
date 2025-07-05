'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '../../../../../../contexts/UserContext';
import Image from 'next/image';
import { ArrowLeft, Camera, XCircle, Save, Trash2, AlertTriangle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import '../../../articles/create/EditorPlugins';
import Link from 'next/link';

const FroalaEditor = dynamic(() => import('react-froala-wysiwyg'), { ssr: false });

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [category, setCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Categories in Arabic
  const categories = [
    { id: 'technology', name: 'تكنولوجيا' },
    { id: 'health', name: 'صحة' },
    { id: 'education', name: 'تعليم' },
    { id: 'sports', name: 'رياضة' },
    { id: 'politics', name: 'سياسة' },
    { id: 'entertainment', name: 'ترفيه' },
    { id: 'science', name: 'علوم' },
    { id: 'business', name: 'أعمال' },
    { id: 'travel', name: 'سفر' },
    { id: 'food', name: 'طعام' },
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/posts/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch article data');
        }

        const article = await response.json();

        if (user && article.authorId !== user.id) {
          toast.error('غير مصرح لك بتعديل هذا المقال');
          router.push('/stories');
          return;
        }

        setTitle(article.title);
        setContent(article.content);
        setCategory(article.category || 'technology');
        if (article.thumbnail) {
          setPreview(article.thumbnail);
        }
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        toast.error('An error occurred while fetching article data');
        router.push('/stories');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchArticle();
    }
  }, [id, user, router]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnail(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (title.length < 5) {
      toast.error('عنوان المقال يجب أن يكون أكثر من 5 أحرف');
      return;
    }

    if (content.length < 100) {
      toast.error('محتوى المقال يجب أن يكون أكثر من 100 حرف');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData: { title: string; content: string; thumbnail?: string; category: string } = {
        title,
        content,
        category,
      };

      if (thumbnail) {
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(thumbnail);
        });
        postData.thumbnail = await promise;
      } else if (preview) {
        postData.thumbnail = preview;
      }

      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to update article');
      }

      toast.success('تم تحديث المقال بنجاح');
      setHasUnsavedChanges(false);
      router.push('/stories');
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('حدث خطأ أثناء تحديث المقال');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">جاري تحميل المقال...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <Toaster position="bottom-right" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/stories" className="mr-4 p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">تعديل المقال</h1>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-sm">تغييرات غير محفوظة</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Article Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              عنوان المقال
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-right"
              placeholder="أدخل عنوان المقال"
              dir="rtl"
            />
          </div>
          
          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              فئة المقال
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-right"
              dir="rtl"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة المقال
            </label>
            {preview ? (
              <div className="relative w-full h-72 rounded-lg overflow-hidden mb-4 border border-gray-200">
                <Image
                  src={preview}
                  alt="معاينة صورة المقال"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm truncate">{title || 'عنوان المقال'}</p>
                </div>
                <button
                  onClick={handleRemoveThumbnail}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                  title="إزالة الصورة"
                >
                  <Trash2 className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  اختر صورة
                </button>
                <p className="text-sm text-gray-500 mt-3 font-medium">PNG، JPG، GIF حتى 5 ميجابايت</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              محتوى المقال
            </label>
            <FroalaEditor
              model={content}
              onModelChange={(model: string) => {
                setContent(model);
                setHasUnsavedChanges(true);
              }}
              config={{
                placeholderText: 'اكتب محتوى مقالك هنا...',
                charCounterCount: true,
                toolbarButtons: {
                  moreText: {
                    buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'],
                  },
                  moreParagraph: {
                    buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
                  },
                  moreRich: {
                    buttons: ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'specialCharacters', 'insertHR'],
                  },
                  moreMisc: {
                    buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
                    align: 'right',
                    buttonsVisible: 2,
                  },
                },
                direction: 'rtl',
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Link 
              href="/stories"
              className="px-5 py-2.5 rounded-lg text-gray-700 font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
            >
              إلغاء
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition-colors'}`}
            >
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
