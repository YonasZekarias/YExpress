'use client'
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  const handleHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 font-sans">
      <div className="max-w-md w-full text-center">
        {/* Animated Illustration Placeholder */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] font-black text-slate-200 select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 animate-bounce">
              <Search className="w-16 h-16 text-indigo-600" />
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">Page not found</h2>
        <p className="text-slate-600 mb-10 text-lg">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleBack}
            className="flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          <button
            onClick={handleHome}
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>

        {/* Support Link */}
        <p className="mt-12 text-slate-500 text-sm">
          Need help? <a href="#" className="text-indigo-600 font-medium hover:underline">Contact Support</a>
        </p>
      </div>
    </div>
  );
}