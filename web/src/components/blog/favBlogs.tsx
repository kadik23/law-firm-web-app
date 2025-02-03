"use client";
import usePagination from "@/hooks/usePagination ";
import BlogCard from "./blogCard";
import { useState, useEffect } from "react";

const FavBlogs = ({
  blogs,
  signIn,
}: {
  blogs: Blog[];
  signIn?: boolean;
}) => {
  const blogsPerPage = 6; // Max blogs per page
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    setFilteredBlogs(blogs);
  }, [blogs]);

  // Using the custom usePagination hook
  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    generatePaginationNumbers,
    setCurrentPage,
  } = usePagination(filteredBlogs.length, blogsPerPage);

  // Calculate the starting index and ending index based on currentPage
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;

  // Slice the blogs array to get only the blogs for the current page
  const blogsToDisplay = filteredBlogs.slice(startIndex, endIndex);

  return (
    <div className="">
      <div className="">
        {/* display Blogs */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogsToDisplay.map((blog) => (
              <BlogCard blog={blog} key={blog.id} signIn={signIn} />
            ))}
          </div>
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex gap-3 justify-center items-center mt-4">
            {/* Previous Button */}
            {currentPage > 1 && (
              <button
                onClick={goToPreviousPage}
                className="px-4 py-2 bg-btnSecondary text-white rounded-md"
              >
                Previous
              </button>
            )}

            {/* Page Numbers */}
            <div className="flex gap-2">
              {generatePaginationNumbers().map((pageNumber: number) => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-2 text-lg rounded-md ${
                    currentPage === pageNumber
                      ? "bg-primary text-white font-bold" // Active page styling
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            {/* Next Button */}
            {currentPage < totalPages && (
              <button
                onClick={goToNextPage}
                className="px-4 py-2 bg-btnSecondary text-white rounded-md"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavBlogs;
