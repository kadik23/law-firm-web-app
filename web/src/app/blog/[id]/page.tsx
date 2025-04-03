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
import LoadingSpinner from "@/components/LoadingSpinner";

const Page = () => {
  const { id } = useParams() as { id: string };
  const {
    fetchBlog,
    blog,
    loading,
    isFavorited,
    setisFavorited,
    isLike,
    setisLike,
    setBlog,
  } = useBlog();
  const {
    blogs,
    blogsLoading,
    getFilteredBlogs,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useBlogs();
  const { categories } = useCategories();
  useEffect(() => {
    if (id) {
      fetchBlog(parseInt(id));
    }
    console.log("isLike: ", isLike);
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner/>
      </div>
    );
  }

  if (!blog)
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-7xl font-bold">Blog introuvable !</h1>
      </div>
    );

  return (
    <div className="">
      <BlogCategory
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      <BLogInfromation
        blog={blog}
        isFavorited={isFavorited}
        setisLike={setisLike}
        isLike={isLike}
        setisFavorited={setisFavorited}
        setBlog={setBlog}
      />
      <ReaderFeedback blogId={id} />
      <div className="font-bold text-3xl md:text-4xl text-primary mb-3">
        D{"'"} autres blogs
      </div>
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

export default Page;
