"use client";

import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  generatePaginationNumbers: () => number[];
  setCurrentPage: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  goToPreviousPage,
  goToNextPage,
  generatePaginationNumbers,
  setCurrentPage,
}: PaginationProps) => {
  return (
    <div className="flex gap-3 justify-start items-center mt-4">
      {currentPage > 1 && (
        <button
          onClick={goToPreviousPage}
          className="px-2 py-1 bg-btnSecondary text-white rounded-md"
        >
          <Icon icon="iconamoon:arrow-left-2-duotone" width="12" height="12" />
        </button>
      )}

      <div className="flex gap-2">
        {generatePaginationNumbers().map((pageNumber: number) => (
          <button
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            className={`px-3 py-1 rounded-md ${
              currentPage === pageNumber
                ? "bg-primary text-white font-bold"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {currentPage < totalPages && (
        <button
          onClick={goToNextPage}
          className="px-2 py-1 bg-btnSecondary text-white rounded-md"
        >
          <Icon icon="iconamoon:arrow-right-2-duotone" width="12" height="12" />
        </button>
      )}
      <div className="text-sm">/Pages</div>
    </div>
  );
};

export default Pagination;