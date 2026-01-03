"use client";
import { useState } from "react";
import AuthFormContainer from "../_components/AuthFormContainer";
import { Mail, Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password });

      setLoading(false);

      if (!res.success) {
        toast.error("LogIn failed");
        return;
      }
      const { role } = useAuthStore.getState();
      const {user} = useAuthStore.getState();
      console.log("Logged in user:", user);
      if (role === "admin") {
        router.push("/admin/");
      } else {
        router.push("/users/overview");
      }
    }finally{
      setLoading(false)
    }
  };
  return (
    <AuthFormContainer title="Sign In" onBack={() => router.push("/")}>
      <form onSubmit={handleLogin} className="space-y-6">
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-3 border text-black border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
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
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
            <input
              type="password"
              required
              className="w-full pl-10 pr-4 py-3 border text-black border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
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
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
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
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <button
          onClick={() => router.push("/auth/signup")}
          className="font-semibold text-indigo-600 hover:text-indigo-800"
        >
          Create Account
        </button>
      </p>
    </AuthFormContainer>
  );
}
