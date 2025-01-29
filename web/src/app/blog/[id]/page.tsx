"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import BlogCategory from "@/components/blog/blogCategory";
import BLogInfromation from "@/components/blog/blogInfromation";
import ReaderFeedback from "@/components/blog/readerFeedback";
import OtherBlogs from "@/components/blog/otherBlogs";
import useBlog from "@/hooks/useBlog";
import { useBlogs } from "@/hooks/useBlogs";
import useCategories from "@/hooks/useCategories";

const Page = () => {
  const { id } = useParams() as { id: string };
  const { fetchBlog, blog, loading } = useBlog();
  const {
    blogs,
    blogsLoading,
    getFilteredBlogs,
    selectedCategory,
    setSelectedCategory,
  } = useBlogs();
  const { categories } = useCategories();
  useEffect(() => {
    if (id) {
      fetchBlog(parseInt(id));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!blog)
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-7xl font-bold">Blog not found!</h1>
      </div>
    );

  return (
    <div className="">
      <BlogCategory
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <BLogInfromation blog={blog} />
      <ReaderFeedback />
      <div className="font-bold text-3xl md:text-4xl text-primary mb-3">
        D{"'"} autres blogs
      </div>
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
              ? "Loading..."
              : "Aucun blog disponible pour le moment."}
          </p>
        </>
      )}
    </div>
  );
};

export default Page;
