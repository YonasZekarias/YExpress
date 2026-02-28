export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900">
      
      <div className="relative flex items-center justify-center">
        <div
          className="
            w-16 h-16 rounded-full animate-spin
            border-4
            border-slate-300 dark:border-slate-800
            border-t-indigo-600 dark:border-t-indigo-400
          "
        />
      </div>

      <p className="mt-6 text-slate-600 dark:text-slate-400 text-lg font-medium">
        Loading your experience...
      </p>
    </div>
  );
}