"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const leftBound = Math.max(2, currentPage - 2);
    const rightBound = Math.min(totalPages - 1, currentPage + 2);

    pages.push(1);
    if (leftBound > 2) pages.push("ellipsis");
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }
    if (rightBound < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8 mb-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-full transition-colors duration-200 ${
          currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <ChevronLeft size={24} />
      </button>

      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              currentPage === page
                ? "bg-primary text-primary-foreground"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-4 py-2 text-gray-500 cursor-default">
            <MoreHorizontal size={24} />
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full transition-colors duration-200 ${
          currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
      >
        <ChevronRight size={24} />
      </button>
    </nav>
  );
}
