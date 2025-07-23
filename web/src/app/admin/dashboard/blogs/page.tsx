"use client";
import BlogCard from "@/components/dashboard/admin/blogs/blogCard";
import BlogsHeader from "@/components/dashboard/admin/blogs/blogsHeader";
import { useState } from "react";
import Modal from "@/components/Modal";
import { DeleteConfirmation } from "@/components/dashboard/admin/DeleteConfirmation";
import FormModal from "@/components/dashboard/admin/formModal";
import { AddBlogForm } from "@/components/dashboard/admin/AddBlogForm";
import BlogsWrapper from "@/components/BlogsWrapper";
import { useBlogsM } from "@/hooks/admin/useBlogsM";
import LoadingSpinner from "@/components/LoadingSpinner";

const InPage = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const {
    blogs,
    selectedBlogs,
    toggleSelect,
    deleteBlogs,
    addBlog,
    file,
    setFile,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    handleCategoryChange,
    handleTimeChange,
    selectedCategory,
    selectedTime,
  } = useBlogsM();

  const handlePageChange = (page: number) => {
    setCurrentPage?.(page);
  };

  const confirmDelete = () => {
    if (selectedBlogs.length > 0) {
      setDeleteModalOpen(true);
    }
  };

  //   const handleCheckboxChange = (
  //     blogId: number,
  //     blogTitle: string,
  //     isChecked: boolean
  //   ) => {
  //     if (isChecked) {
  //       selectedBlogs = [...selectedBlogs, { id: blogId, title: blogTitle }];
  //     } else {
  //       setSelectedBlogs(selectedBlogs.filter((blog) => blog.id !== blogId));
  //     }
  //   };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  return (
    <div>
      {/* Header */}
      <BlogsHeader
        blogsPage={true}
        onAddClick={() => setAddModalOpen(true)}
        onDeleteClick={() => {
          confirmDelete();
        }}
        handleCategoryChange={handleCategoryChange}
        handleTimeChange={handleTimeChange}
        selectedCategory={selectedCategory}
        selectedTime={selectedTime}
      />

      {/* Blogs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs &&
          blogs.map((blog) => (
            <BlogCard blog={blog} key={blog.id} toggleSelect={toggleSelect} />
          ))}
      </div>

      {blogs.length === 0 && !loading && (
        <div className="flex items-center justify-center mt-8">
          <span className="text-gray-500">Aucun avocat trouvé</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center mt-8">
          <LoadingSpinner />
        </div>
      )}

      <div className="flex items-center justify-center mt-8">
        {totalPages > 1 && (
          <div className="flex gap-3 justify-center items-center mt-4">
            {/* Previous Button */}
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-btnSecondary text-white rounded-md"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>

      <FormModal
        isOpen={addModalOpen}
        onClose={handleAddModalClose}
        isNotStepOne={true}
      >
        <div className="text-center text-white font-semibold text-xl">
          Ajouter un blog
        </div>
        <AddBlogForm
          file={file}
          setFile={setFile}
          onSubmit={(data) => addBlog(data, () => setAddModalOpen(false))}
          isUpdate= {false}
        />
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        isNotStepOne={true}
      >
        <DeleteConfirmation
          selectedAvocats={selectedBlogs}
          itemType="blog"
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={() => {
            deleteBlogs();
            setDeleteModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
};

const Page = () => {
  return (
    <BlogsWrapper>
      <InPage />
    </BlogsWrapper>
  );
};
export default Page;
