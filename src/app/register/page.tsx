"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

interface FormData {
  fName: string;
  lName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"error" | "success" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fName.trim()) {
      newErrors.fName = "First name is required";
    }

    if (!formData.lName.trim()) {
      newErrors.lName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must be at least 6 characters, include a letter, a number, and a special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setStatus(null);
    setStatusMessage(null);

    // توليد صورة افتراضية بناءً على الاسم الأول واسم العائلة
    const img = `https://avatar.iran.liara.run/username?username=${formData.fName}+${formData.lName}`;

    const { ...dataToSend } = formData;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...dataToSend, img }),
      });

const responseData = await response.json();
if (response.ok) {
  setStatus("success");
  setStatusMessage(responseData.message || "Registration successful! Redirecting...");
  setTimeout(() => router.push("/login"), 2000);
} else {
  setStatus("error");
  setStatusMessage(responseData.error || "Something went wrong.");
}

    } catch (error) {
      console.error("An error occurred:", error);
      setStatusMessage("An error occurred. Please try again later.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Logo or Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join our community of writers and readers</p>
        </div>

        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Status Message */}
          {status && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                status === "success" 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <p className="text-center text-sm font-medium">{statusMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Names Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="fName"
                  name="fName"
                  value={formData.fName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="John"
                />
                {errors.fName && <p className="text-red-500 text-xs mt-1">{errors.fName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="lName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lName"
                  name="lName"
                  value={formData.lName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Doe"
                />
                {errors.lName && <p className="text-red-500 text-xs mt-1">{errors.lName}</p>}
              </div>
            </div>

            {/* Email & Password Fields */}
            {[
              { label: "Email Address", name: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", name: "password", type: "password", placeholder: "••••••••" },
              { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "••••••••" }
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} className="space-y-2">
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name as keyof FormData]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
                {errors[name as keyof FormData] && (
                  <p className="text-red-500 text-xs mt-1">{errors[name as keyof FormData]}</p>
                )}
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 
                ${loading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account?</span>{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
