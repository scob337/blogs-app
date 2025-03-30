"use client";

import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
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

    const { confirmPassword, ...dataToSend } = formData;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setStatus("success");
        console.log("Registration successful");
        // Perform additional actions after successful registration
      } else {
        setStatus("error");
        console.error("Registration failed");
        // Handle errors here
      }
    } catch (error) {
      setStatus("error");
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md px-8 py-10 flex flex-col items-center">
      <h1 className="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-8">
        Welcome to My Company
      </h1>
      {status && (
        <div
          className={`w-full text-white text-center py-2 mb-4 rounded-md ${
            status === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {status === "success"
            ? "Registration successful!"
            : "Registration failed. Please try again."}
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Password", name: "password", type: "password" },
          {
            label: "Confirm Password",
            name: "confirmPassword",
            type: "password",
          },
        ].map(({ label, name, type }) => (
          <div key={name} className="flex items-start flex-col justify-start">
            <label
              htmlFor={name}
              className="text-sm text-gray-700 dark:text-gray-200 mr-2"
            >
              {label}:
            </label>
            <input
              type={type}
              id={name}
              name={name}
              value={formData[name as keyof FormData]}
              onChange={handleChange}
              className="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors[name as keyof FormData] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[name as keyof FormData]}
              </p>
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500 dark:text-gray-300">
          Already have an account?{" "}
        </span>
        <a href="/login" className="text-blue-500 hover:text-blue-600">
          Login
        </a>
      </div>
    </div>
  );
};

export default RegisterForm;
