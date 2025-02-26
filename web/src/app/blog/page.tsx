"use client";
import BlogCategory from "@/components/blog/blogCategory";
import OtherBlogs from "@/components/blog/otherBlogs";
import { useBlogs } from "@/hooks/useBlogs";
import useCategories from "@/hooks/useCategories";

const Blogs = () => {
  const {
    blogs,
    blogsLoading,
    getFilteredBlogs,
    selectedCategory,
    setSelectedCategory,
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
        />
      ) : (
        <>
          <OtherBlogs
            blogs={[]}
            selectedCategory={selectedCategory}
            getFilteredBlogs={getFilteredBlogs}
          />
          <p>
            {blogsLoading
              ? "Chargement..."
              : "Aucun blog disponible pour le moment."}
          </p>
        </>
      )}
    </div>
  );
};

export default Blogs;
