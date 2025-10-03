import { useState } from 'react';

const usePagination = (totalItems: number, itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const generatePaginationNumbers = () => {
    const paginationNumbers: number[] = [];
    const pageRange = 2;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        paginationNumbers.push(i);
      }
    } else {
      paginationNumbers.push(1);
      for (
        let i = Math.max(currentPage - pageRange, 2);
        i <= Math.min(currentPage + pageRange, totalPages - 1);
        i++
      ) {
        paginationNumbers.push(i);
      }
      if (paginationNumbers[paginationNumbers.length - 1] !== totalPages) {
        paginationNumbers.push(totalPages);
      }
    }

    return paginationNumbers;
  };

  return {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    generatePaginationNumbers,
    setCurrentPage,
  };
};

export default usePagination;


