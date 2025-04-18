'use client';

import {  useState } from 'react';
import { useRouter } from "next/navigation";
import { useUser } from '../../../contexts/UserContext';
import Link from 'next/link';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100">
          <LoginForm />
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{"Don't have an account?"}</span>
            <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const router = useRouter();

  const [information, setInformation] = useState({
    email: "",
    password: "",
  });

  const { login } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [Success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInformation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!information.email || !information.password) {
      setError("Please fill in all fields.");
      setTimeout(() => setError(null), 2000);
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(information),
      });
  
      const userData = await res.json();
  
      if (!res.ok) throw new Error(userData.error);
  
      setLoading(false);
      setSuccess("Login successful!");
      setError(null);
      
      setTimeout(() => {
        login(userData);
        setSuccess(null);
        router.replace("/auth");
      }, 400);
      
    } catch (err: unknown) {
      setLoading(false);
      setSuccess(null);
  
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
  
      setTimeout(() => setError(null), 1000);
    }
  };
  

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
          {error}
        </div>
      )}
      {Success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm">
          {Success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={information.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={information.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 
            ${loading 
              ? "bg-indigo-400 cursor-not-allowed" 
              : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"}`}
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
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
};



export default Login;
