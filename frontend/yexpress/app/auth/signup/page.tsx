"use client";
import { useState } from "react";
import AuthFormContainer from "../_components/AuthFormContainer";
import { Input } from "@/components/ui/input"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signupUser } = useAuthStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signupUser({ username, email, phone, password });
      if (!res.success) {
        toast.error(res.message || "Signup failed");
        return;
      }

      toast.success("Account created successfully 🎉");
      router.push("/auth/verification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormContainer title="Sign Up" onBack={() => router.push("/")}>
      <form onSubmit={handleSignup} className="space-y-6">
        {/* Username */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
            <input
              type="text"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Username"
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
            <input
              type="email"
              required
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Email address"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
            Phone Number
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
            <input
              type="tel"
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Phone number"
              value={phone}
              disabled={loading}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              className="w-full pl-10 pr-12 py-3 border rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:ring-violet-500 focus:border-violet-500"
              placeholder="Minimum 6 characters"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition flex items-center justify-center space-x-2"
        >
          <User className="h-5 w-5" />
          <span>Create Account</span>
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <button
          onClick={() => router.push("/auth/signin")}
          className="font-semibold text-violet-600 hover:text-violet-800 dark:hover:text-violet-400"
        >
          Sign In
        </button>
      </p>
    </AuthFormContainer>
  );
}
