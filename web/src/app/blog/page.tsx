"use client";
import BlogCategory from "@/components/blog/blogCategory";
import OtherBlogs from "@/components/blog/otherBlogs";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useBlogs } from "@/hooks/useBlogs";
import useCategories from "@/hooks/useCategories";

const Blogs = () => {
  const {
    blogs,
    blogsLoading,
    getFilteredBlogs,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    totalPages,
    setCurrentPage
  } = useBlogs();
  const { categories } = useCategories();

  return (
    <div>
      <BlogCategory
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      {blogs?.length > 0 ? (
        <OtherBlogs
          blogs={blogs}
          selectedCategory={selectedCategory}
          getFilteredBlogs={getFilteredBlogs}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <>
          <OtherBlogs
            blogs={[]}
            selectedCategory={selectedCategory}
            getFilteredBlogs={getFilteredBlogs}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
          <p>
            {blogsLoading
              ? <LoadingSpinner/>
              : "Aucun blog disponible pour le moment."}
          </p>
        </>
      )}
    </div>
  );
};

export default Blogs;
