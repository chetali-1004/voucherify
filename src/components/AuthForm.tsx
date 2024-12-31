"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthFormData {
  email: string;
  password: string;
  adminKey?: string;
  mode: "signup" | "signin";
  role: "ADMIN" | "USER";
}

const AuthForm = () => {
  const { register, handleSubmit, reset } = useForm<AuthFormData>();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const onSubmit: SubmitHandler<AuthFormData> = async (data) => {
    try {
      const endpoint = `http://localhost:3000/auth/${data.mode.toLowerCase()}`;
      const payload = {
        email: data.email,
        password: data.password,
        ...(isAdmin && data.adminKey ? { adminKey: data.adminKey } : {}),
      };

      const response = await axios.post(endpoint, payload);
      console.log(`Success: ${JSON.stringify(response.data)}`);
      if (isAdmin && data.mode === "signin") {
        router.push("/voucher");
      }
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `Error: ${error.response?.data?.message || error.message}`
        );
      } else {
        console.error(`Error: ${(error as Error).message}`);
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
      <div className=" bg-gray-800 p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          Welcome to SecureAuth
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Please{" "}
          {isAdmin ? "Sign In or Sign Up as Admin" : "Sign In or Sign Up"}{" "}
          below.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Mode Selection */}
          <div className="flex justify-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="signup"
                {...register("mode")}
                defaultChecked
                className="form-radio text-blue-500 focus:ring-blue-400"
              />
              <span className="text-gray-300">Sign Up</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="signin"
                {...register("mode")}
                className="form-radio text-blue-500 focus:ring-blue-400"
              />
              <span className="text-gray-300">Sign In</span>
            </label>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          {/* Role Selection */}
          <div className="flex justify-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="USER"
                checked={!isAdmin}
                onChange={() => setIsAdmin(false)}
                className="form-radio text-blue-500 focus:ring-blue-400"
              />
              <span className="text-gray-300">User</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="ADMIN"
                checked={isAdmin}
                onChange={() => setIsAdmin(true)}
                className="form-radio text-blue-500 focus:ring-blue-400"
              />
              <span className="text-gray-300">Admin</span>
            </label>
          </div>

          {/* Admin Key Input */}
          {isAdmin && (
            <div>
              <label className="block text-gray-400 font-medium mb-1">
                Admin Key
              </label>
              <input
                type="text"
                {...register("adminKey")}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring focus:ring-blue-400 focus:outline-none"
                placeholder="Enter the admin key"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
