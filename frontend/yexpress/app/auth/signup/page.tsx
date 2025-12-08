"use client";

import { useState } from "react";
import AuthFormContainer from "../_components/AuthFormContainer";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 👉 Add your API call logic here
    // Example:
    // await registerUser({ name, email, password });

    setLoading(false);
  };

  return (
    <AuthFormContainer
      title="Sign Up"
      onBack={() => router.push("/")}
    >
      <form onSubmit={handleSignup} className="space-y-6">

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
            <input
              type="text"
              required
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-3 border text-black border-slate-300 rounded-xl focus:ring-violet-500 focus:border-violet-500"
              value={name}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 border text-black border-slate-300 rounded-xl focus:ring-violet-500 focus:border-violet-500"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full pl-10 pr-4 py-3 border text-black border-slate-300 rounded-xl focus:ring-violet-500 focus:border-violet-500"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition flex items-center justify-center space-x-2"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
              />
            </svg>
          ) : (
            <>
              <User className="h-5 w-5" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/auth/signin")}
          className="font-semibold text-violet-600 hover:text-violet-800"
        >
          Sign In
        </button>
      </p>
    </AuthFormContainer>
  );
}
