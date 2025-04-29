"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import BLogInfromation from "@/components/blog/blogInfromation";
import useBlog from "@/hooks/useBlog";
import BlogsHeader from "@/components/dashboard/admin/blogs/blogsHeader";

const BlogOverview = () => {
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
  useEffect(() => {
    if (id) {
      fetchBlog(parseInt(id));
    }
    console.log("isLike: ", isLike);
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Chargement...</h1>
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
      <BlogsHeader blogsPage={false} blogName={blog.title} />
      <BLogInfromation
        blog={blog}
        isFavorited={isFavorited}
        setisLike={setisLike}
        isLike={isLike}
        setisFavorited={setisFavorited}
        setBlog={setBlog}
      />
    </div>
  );
};

export default BlogOverview;
