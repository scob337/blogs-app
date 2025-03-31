
"use client";
import { XCircle } from "lucide-react"; 
import  './EditorPlugins'

import { useState, useRef } from "react";
import dynamic from "next/dynamic";


import Image from "next/image";

const FroalaEditor = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });

export default function CreateArticle() {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async () => {
    setLoading(true);
    setStatus("idle");
  
    // 📌 تجهيز البيانات ككائن JSON
    const postData: { title: string; content: string; thumbnail: string | null } = {
      title,
      content,
      thumbnail: null, // سيتم التعامل معها لاحقًا إذا احتجت رفعها
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
              "Content-Type": "application/json", // 📌 التأكد من إرسال البيانات كـ JSON
            },
            body: JSON.stringify(postData), // 📌 إرسال البيانات كـ JSON
          });
  
          if (!res.ok) throw new Error("Failed to create article");
  
          setStatus("success");
          setTitle("");
          setContent("");
          setThumbnail(null);
          setPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
          console.error("Error:", error);
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
  
        if (!res.ok) throw new Error("Failed to create article");
  
        setStatus("success");
        setTitle("");
        setContent("");
        setThumbnail(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error("Error:", error);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow-md">
<input
  type="text"
  placeholder=" Article Title "
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="w-full p-2 mb-4 border rounded"
/>


      <div className="mb-4">
        {preview ? (
          <div className="relative w-48 h-48 mx-auto">
            <Image
              width={200}
              height={200}
              src={preview}
              alt="Thumbnail preview"
              className="w-full h-full object-cover rounded border"
            />
            <button
              onClick={handleRemoveThumbnail}
              className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md"
            >
              <XCircle className="text-red-500 w-5 h-5" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="text-sm text-gray-500 font-semibold">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG, GIF (MAX. 800x400px)</p>
            </div>
            <input
              ref={fileInputRef}
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleThumbnailChange}
            />
          </label>
        )}
      </div>

      <FroalaEditor
    tag="textarea"
    model={content}
    onModelChange={setContent}
    config={{
      placeholderText: "Write Article Content Here  ...",
      toolbarSticky: true,
      pluginsEnabled: ['image', 'link', 'colors', 'codeView', 'codeBeautifier', 'paragraphFormat', 'quote', 'hr', 'paragraphStyle'],
      toolbarButtons: [
        ['bold', 'italic', 'underline', 'strikeThrough'],
        ['paragraphFormat', 'paragraphStyle', 'color', 'backgroundColor'],
        ['insertImage', 'insertLink'],
        ['quote', 'hr'],
        ['html', 'fullscreen', 'codeView']
      ],
      paragraphFormat: {
        N: 'Normal',
        H1: 'Heading 1',
        H2: 'Heading 2',
        H3: 'Heading 3',
        H4: 'Heading 4'
      },
      heightMin: 300,
      heightMax: 500
    }}
  />

      <button
        onClick={handleSubmit}
        className={`mt-4 w-full p-2 text-white rounded
          cursor-pointer
          ${loading ? "bg-gray-400" : "bg-blue-500"}`}
        disabled={loading}
      >
        {loading ? "Loading..." : "Submit"}
      </button>

      {status === "success" && <p className="mt-2 text-green-600">✔️ Article created successfully!</p>}
      {status === "error" && <p className="mt-2 text-red-600">❌ Error creating article.</p>}
    </div>
  );
}
