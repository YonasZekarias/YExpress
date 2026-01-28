'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center gap-2 mt-8">
      <button
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage >= totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}