import { useState } from 'react';

const usePagination = (totalItems: number, itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Function to change to the previous page
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Function to change to the next page
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Function to generate the pagination numbers, including ellipsis
  const generatePaginationNumbers = () => {
    const paginationNumbers: number[] = [];
    const pageRange = 2; // Number of pages to show before and after the current page

    if (totalPages <= 5) {
      // If there are 5 or fewer pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        paginationNumbers.push(i);
      }
    } else {
      paginationNumbers.push(1); // Always show the first page

      // Add pages around the current page, ensuring they are within bounds
      for (let i = Math.max(currentPage - pageRange, 2); i <= Math.min(currentPage + pageRange, totalPages - 1); i++) {
        paginationNumbers.push(i);
      }

      // Always show the last page if it's not already included
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
    setCurrentPage, // If you want to directly set the current page
  };
};

export default usePagination;
