"use client";
import { useState } from "react";
import Modal from "@/components/Modal";
import { DeleteConfirmation } from "@/components/dashboard/admin/DeleteConfirmation";
import FormModal from "@/components/dashboard/admin/formModal";
import { AddBlogForm } from "@/components/dashboard/admin/AddBlogForm";
import BlogsWrapper from "@/components/BlogsWrapper";
import { useAttorneyBlogs } from "@/hooks/attorney/useAttorneyBlogs";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

const InPage = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
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
    status,
    handleStatusChange,
    updateBlog,
    fetchBlogs,
  } = useAttorneyBlogs();

  const handlePageChange = (page: number) => {
    setCurrentPage?.(page);
  };

  const confirmDelete = () => {
    if (selectedBlogs.length > 0) {
      setDeleteModalOpen(true);
    }
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setEditingBlog(null);
  };

  return (
    <div>
      {/* Status Switch */}
      <div className="flex gap-4 justify-center mt-6">
        <button
          className={`px-4 py-2 rounded-md font-semibold ${status === "accepted" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => handleStatusChange("accepted")}
        >
          Acceptés
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold ${status === "pending" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => handleStatusChange("pending")}
        >
          En attente
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold ${status === "refused" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => handleStatusChange("refused")}
        >
          Refusés
        </button>
        <button
          className="ml-auto px-4 py-2 bg-btnSecondary hover:opacity-80 transition-all duration-300 text-white rounded-md"
          onClick={() => setAddModalOpen(true)}
        >
          Ajouter un blog
        </button>
        <button
          className="px-4 py-2 border-red-500 border hover:bg-red-500 hover:text-white transition-all duration-300 text-red-500 rounded-md"
          onClick={confirmDelete}
        >
          Supprimer sélectionnés
        </button>
      </div>

      {/* Blogs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {blogs &&
          blogs.map((blog) => (
            <div key={blog.id} className={`relative border rounded-md p-4 ${blog.selected ? "border-primary" : "border-gray-200"}`}>
              <input
                type="checkbox"
                checked={!!blog.selected}
                onClick={e => e.stopPropagation()}
                onChange={() => toggleSelect(blog.id as number)}
                className="absolute top-2 right-2 z-10"
              />
              <Link href={`/attorney/dashboard/blogs/${blog.id}`} className="block cursor-pointer h-full w-full">
                <div className="font-bold text-lg mb-2">{blog.title}</div>
                <img src={blog.image} alt="blog" className="w-full h-32 object-cover rounded mb-2" />
                <div className="text-sm text-gray-600 mb-2">{blog.body.slice(0, 35)}...</div>
                <div className="text-xs text-gray-400">Durée de lecture: {blog.readingDuration} min</div>
                {status === "refused" && blog.rejectionReason && (
                  <div className="mt-2 text-xs text-red-500">Raison du refus: {blog.rejectionReason}</div>
                )}
              </Link>
              {!blog.accepted && (
                <button
                  className="absolute bottom-2 right-2 px-3 py-1 bg-primary text-white rounded-md z-20"
                  onClick={() => {
                    setEditingBlog(blog);
                    setEditModalOpen(true);
                  }}
                >
                  Modifier
                </button>
              )}
            </div>
          ))}
      </div>

      {blogs.length === 0 && !loading && (
        <div className="flex items-center justify-center mt-8">
          <span className="text-gray-500">Aucun blog trouvé</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center mt-8">
          <LoadingSpinner />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-3 justify-center items-center mt-4">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 bg-btnSecondary text-white rounded-md"
            >
              Précédent
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
              Suivant
            </button>
          )}
        </div>
      )}

      {/* Add Blog Modal */}
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
          isUpdate={false}
        />
      </FormModal>

      {/* Edit Blog Modal */}
      <FormModal
        isOpen={editModalOpen}
        onClose={handleEditModalClose}
        isNotStepOne={true}
      >
        <div className="text-center text-white font-semibold text-xl mb-4">
          Modifier le blog
        </div>
        {editingBlog && (
          <AddBlogForm
            file={file}
            setFile={setFile}
            onSubmit={(data) =>
              updateBlog(
                editingBlog.id as number,
                data,
                editingBlog,
                () => {
                  handleEditModalClose();
                  fetchBlogs(currentPage, status);
                }
              )
            }
            isUpdate={true}
            blog={editingBlog}
            setBlog={() => {}}
          />
        )}
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