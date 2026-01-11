"use client";

import { ChevronLeft } from "lucide-react";

export default function AuthFormContainer({
  title,
  children,
  onBack,
}: {
  title: string;
  children: React.ReactNode;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen pt-12 pb-12 bg-slate-100 dark:bg-slate-950 font-sans">
      <div
        className="
          w-full max-w-md p-8 m-4
          bg-white dark:bg-slate-900
          rounded-3xl shadow-2xl
          border border-slate-200 dark:border-slate-800
          relative
        "
      >
        {/* Back Button */}
        <button
          onClick={onBack}
          className="
            absolute top-6 left-6
            text-slate-500 dark:text-slate-400
            hover:text-slate-700 dark:hover:text-slate-200
            transition flex items-center text-sm font-medium
          "
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Landing
        </button>

        <div className="mt-8">
          <h2 className="text-4xl font-extrabold text-center text-slate-900 dark:text-white mb-2 tracking-tight">
            {title}
          </h2>

          <p className="text-center text-slate-500 dark:text-slate-400 mb-8">
            {title === "Sign In"
              ? "Welcome back! Enter your credentials."
              : "Join us to get started on your journey."}
          </p>

          {children}
        </div>
      </div>
    </div>
  );
}
