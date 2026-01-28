"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect} from "react";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
export default function FloatingCart() {
  const router = useRouter();
  const { count, fetchCount } = useCartStore();

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  if (count === 0) return null;
  return (
    <AnimatePresence>
  {count > 0 && (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onClick={() => router.push("/customer/cart")}
      className="fixed top-20 right-6 z-40 group flex items-center bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-1 pr-4 rounded-full shadow-2xl transition-all"
    >
      <div className="relative bg-orange-500 p-2.5 rounded-full text-white shadow-lg shadow-orange-500/40">
        <ShoppingCart size={20} />
        <motion.span 
          key={count} // This triggers animation on number change
          initial={{ scale: 1.5, backgroundColor: "#000" }}
          animate={{ scale: 1, backgroundColor: "#f97316" }}
          className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
        >
          {count}
        </motion.span>
      </div>
      <span className="ml-3 text-sm font-bold text-gray-700 dark:text-gray-200">View Cart</span>
    </motion.button>
  )}
</AnimatePresence>
  );
}
