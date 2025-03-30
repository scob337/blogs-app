'use client';

import {  useState } from 'react';
import { useRouter } from "next/navigation";
import { useUser } from '../../../contexts/UserContext';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Login</h1>
            <div className="w-full flex-1 mt-8">

              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Login with E-mail
                </div>
              </div>
              <LoginForm />
            </div>
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
        router.replace("/");
      }, 1000);
      
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
    <div className="mx-auto max-w-xs">

      {error !=null &&       <div className="bg-red-100
      mb-2 text-center
      text-red-800 text-lg font-medium m-auto px-2.5 py-2 rounded-sm
       dark:bg-red-900 dark:text-red-300">{error}</div>}
       {Success !=null &&       <div className="bg-green-100
      mb-2 text-center
      text-green-800 text-lg font-medium m-auto px-2.5 py-2 rounded-sm
       dark:bg-green-900 dark:text-green-300">{Success}</div> }
<form onSubmit={handleSubmit}>
<input
        name="email"
        value={information.email}
        onChange={handleChange}
        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
        type="email"
        required
        placeholder="Email"
      />
      <input
        name="password"
        value={information.password}
        onChange={handleChange}
        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
        type="password"
        placeholder="Password"
        required
      />
      <button
        disabled={loading}
        className={`mt-5 tracking-wide font-semibold
       bg-indigo-500 text-gray-100 w-full py-4 rounded-lg
        hover:bg-indigo-700 transition-all duration-300 ease-in-out 
        flex items-center justify-center focus:shadow-outline focus:outline-none cursor-pointer
        ${loading && "opacity-50 cursor-not-allowed"}
        `}
        onClick={() => handleSubmit} 
      >
        <span className="ml-3">
          {loading? "Loading..." : "Login"}
        </span>
      </button>

</form>
    </div>
  );
};



export default Login;
