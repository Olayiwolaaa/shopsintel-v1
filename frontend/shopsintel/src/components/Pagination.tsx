import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const maxVisiblePages = 5;

  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "ellipsis",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      <Link
        href={`?page=${currentPage - 1}`}
        className={`p-2 rounded-full transition-colors duration-200 ${
          currentPage === 1
            ? "text-gray-500 cursor-not-allowed"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft size={24} />
      </Link>
      {pageNumbers.map((page, index) => (
        <Link
          key={index}
          href={typeof page === "number" ? `?page=${page}` : "#"}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            currentPage === page
              ? "bg-primary text-primary-foreground"
              : page === "ellipsis"
              ? "text-gray-500 cursor-default"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          {page === "ellipsis" ? <MoreHorizontal size={24} /> : page}
        </Link>
      ))}
      <Link
        href={`?page=${currentPage + 1}`}
        className={`p-2 rounded-full transition-colors duration-200 ${
          currentPage === totalPages
            ? "text-gray-500 cursor-not-allowed"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight size={24} />
      </Link>
    </nav>
  );
}
