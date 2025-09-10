import React from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { signup, login, loginWithGoogle, getCurrentUser } from "../backend/auth";
import { useUser } from "../context/UserContext";

export default function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // 1. Create user
      await signup(data.email, data.password, data.name);

      // 2. Auto-login user
      await login(data.email, data.password);

      // 3. Fetch logged in user
      const user = await getCurrentUser();
      setUser(user);

      localStorage.setItem("userId", user.$id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);

      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message || "Something went wrong");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google login error:", err);
      alert(err.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl border border-gray-100">
        {/* Header */}
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create Account
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">Sign up to get started</p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Full Name
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 py-3 rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 py-3 rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 py-3 rounded-lg border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 rounded-lg shadow-md transition"
            >
              Sign Up
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          {/* Google Login */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 rounded-lg py-3 border-gray-300 hover:bg-gray-50 transition"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="text-2xl" />
            <span className="font-medium text-gray-700">Continue with Google</span>
          </Button>

          {/* Redirect to login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-pink-600 font-semibold hover:underline"
            >
              Log in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
