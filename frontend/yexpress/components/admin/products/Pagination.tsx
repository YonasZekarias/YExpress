'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  pageIndex: number; // For "Page X" display
}

export default function Pagination({ hasPrev, hasNext, onPrev, onNext, pageIndex }: PaginationProps) {
  return (
    <div className="px-8 py-4 flex items-center justify-between">
      <button 
        onClick={onPrev} 
        disabled={!hasPrev}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>
      <span className="text-xs text-gray-400">
        Page {pageIndex + 1}
      </span>
      <button 
        onClick={onNext} 
        disabled={!hasNext}
        className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}