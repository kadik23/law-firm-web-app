"use client"
import BlogCard from "@/components/dashboard/admin/blogs/blogCard";
import BlogsHeader from "@/components/dashboard/admin/blogs/blogsHeader";
import Pagination from "@/components/Pagination";
import usePagination from "@/hooks/usePagination ";
import blogPosts from "@/consts/blogs";
import { useState } from "react";
import Modal from "@/components/Modal";
import { DeleteConfirmation } from "@/components/dashboard/admin/DeleteConfirmation";

const Page = () => {
    const [blogs, setBlogs] = useState(blogPosts);
    const [selectedBlogs, setSelectedBlogs] = useState<{id: number, title: string}[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const BlogsPerPage = 6;
    const {
      currentPage,
      totalPages,
      goToPreviousPage,
      goToNextPage,
      generatePaginationNumbers,
      setCurrentPage,
    } = usePagination(blogPosts.length, BlogsPerPage);

    const handleCheckboxChange = (blogId: number, blogTitle: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedBlogs([...selectedBlogs, {id: blogId, title: blogTitle}]);
        } else {
            setSelectedBlogs(selectedBlogs.filter(blog => blog.id !== blogId));
        }
    };

    const deleteBlogs = () => {
        const updatedBlogs = blogs.filter(blog => 
            !selectedBlogs.some(selected => selected.id === blog.id)
        );
        setBlogs(updatedBlogs);
        setSelectedBlogs([]);
    };

    return (
        <div>
            {/* Header */}
            <BlogsHeader 
                blogsPage={true} 
                onDeleteClick={() => {
                    if (selectedBlogs.length > 0) {
                        setDeleteModalOpen(true);
                    }
                }}
            />
            
            {/* Blogs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs
                .slice(
                    (currentPage - 1) * BlogsPerPage,
                    currentPage * BlogsPerPage)
                .map((blog) => (
                    <BlogCard 
                        blog={blog} 
                        key={blog.id}
                        onCheckboxChange={(isChecked) => 
                            handleCheckboxChange(blog.id, blog.title, isChecked)
                        }
                    />
                ))}
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-center mt-8">
                {totalPages > 1 && (
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPreviousPage={goToPreviousPage}
                    goToNextPage={goToNextPage}
                    generatePaginationNumbers={generatePaginationNumbers}
                    setCurrentPage={setCurrentPage}
                    />
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} isNotStepOne={true}>
                <DeleteConfirmation
                    selectedItems={selectedBlogs}
                    itemName="blog"
                    onCancel={() => setDeleteModalOpen(false)}
                    onConfirm={() => {
                        deleteBlogs();
                        setDeleteModalOpen(false);
                    }}
                />
            </Modal>
        </div>
    )
}

export default Page;