"use client";
import usePagination from "@/hooks/usePagination ";
import BlogCard from "./blogCard";
import { useState, useEffect } from "react";

interface FavBlogsProps {
  blogs: Blog[];
  signIn?: boolean;
}

const FavBlogs: React.FC<FavBlogsProps> = ({ blogs, signIn }) => {
  const blogsPerPage = 6;
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    setFilteredBlogs(Array.isArray(blogs) ? blogs : []);
  }, [blogs]);

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    generatePaginationNumbers,
    setCurrentPage,
  } = usePagination(filteredBlogs.length, blogsPerPage);

  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const blogsToDisplay = filteredBlogs.slice(startIndex, endIndex);

  return (
    <div className="w-full">
      {/* Display Blogs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogsToDisplay.map((blog) => (
          <BlogCard key={blog.id} blog={blog} signIn={signIn} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Previous Button */}
          {currentPage > 1 && (
            <button
              onClick={goToPreviousPage}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
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
                    ? "bg-primary text-white font-bold"
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
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FavBlogs;
