export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-300 dark:border-slate-700 rounded-full animate-spin border-t-indigo-600"></div>
      </div>
      <p className="mt-6 text-slate-600 dark:text-slate-400 text-lg font-medium">
        Loading your experience...
      </p>
    </div>
  );
}

