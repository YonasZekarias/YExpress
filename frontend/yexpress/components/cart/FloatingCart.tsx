"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingCart() {
  const router = useRouter();
  const { count, fetchCount } = useCartStore();

  // Poll for count updates or fetch on mount
  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/users/cart")}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-2 pr-6 rounded-full shadow-2xl cursor-pointer"
        >
          {/* Icon Container */}
          <div className="relative bg-black dark:bg-white text-white dark:text-black p-3 rounded-full shadow-md">
            <ShoppingCart size={20} />
            
            {/* Badge */}
            <motion.span 
              key={count} // Triggers pop animation when number changes
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900"
            >
              {count}
            </motion.span>
          </div>

          {/* Text */}
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Items</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">View Cart</span>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}