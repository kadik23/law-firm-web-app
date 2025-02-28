"use client";
import BlogCard from "./blogCard";
import { useState, useEffect } from "react";

const OtherBlogs = ({
  selectedCategory,
  blogs,
  signIn,
  getFilteredBlogs,
  currentPage,
  totalPages,
  setCurrentPage
}: {
  selectedCategory: Category | null;
  blogs: Blog[];
  signIn?: boolean;
  getFilteredBlogs: (page: number) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}) => {
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    setFilteredBlogs(blogs);
  }, [blogs]);

  useEffect(() => {
    getFilteredBlogs?.(currentPage);
  }, [selectedCategory, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage?.(page);
  };

  return (
    <div className="">
      <div className="">
        {/* display Blogs */}
        <div>
          {/* {selectedCategory && (
              <div className="font-bold text-3xl md:text-4xl text-primary mb-3">
                D{"'"} autres blogs
              </div>
            )} */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlogs.map((blog) => (
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
                onClick={()=>handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-btnSecondary text-white rounded-md"
              >
                Previous
              </button>
            )}

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 text-lg rounded-md ${
                      currentPage === pageNumber
                        ? "bg-primary text-white font-bold"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>

            {currentPage < totalPages && (
              <button
                onClick={()=>handlePageChange(currentPage + 1)}
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

export default OtherBlogs;
