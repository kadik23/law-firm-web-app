"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BlogCategory from "@/components/blog/blogCategory";
import BLogInfromation from "@/components/blog/blogInfromation";
import ReaderFeedback from "@/components/blog/readerFeedback";
import blogPosts from "@/components/blog/blogs";
import OtherBlogs from "@/components/blog/otherBlogs";

const Page = () => {
  const { id } = useParams() as { id: string };
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status

  useEffect(() => {
    if (id) {
      const foundBlog = blogPosts.find((post) => post.id === parseInt(id));
      setBlog(foundBlog || null);
      setLoading(false); // Set loading to false once the data is fetched
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
      <BlogCategory blogCategory={blog.category} />
      <BLogInfromation blog={blog} />
      <ReaderFeedback />
      <OtherBlogs blogs={blogPosts} blogCategory={blog.category} />
    </div>
  );
};

export default Page;
