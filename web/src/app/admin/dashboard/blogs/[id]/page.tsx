"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BLogInfromation from "@/components/blog/blogInfromation";
import useBlog from "@/hooks/useBlog";
import BlogsHeader from "@/components/dashboard/admin/blogs/blogsHeader";
import { AddBlogForm } from "@/components/dashboard/admin/AddBlogForm";
import FormModal from "@/components/dashboard/admin/formModal";
import { useBlogsM } from "@/hooks/admin/useBlogsM";

const BlogOverview = () => {
  const { id } = useParams() as { id: string };
  const {
    file,
    setFile,
    updateBlog
  } = useBlogsM();
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
  }, [id]);

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const [addModalOpen, setAddModalOpen] = useState(false);

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
      <BlogsHeader
        blogsPage={false}
        blogName={blog.title}
        onUpdateClick={() => setAddModalOpen(true)}
      />
      <BLogInfromation
        blog={blog}
        isFavorited={isFavorited}
        setisLike={setisLike}
        isLike={isLike}
        setisFavorited={setisFavorited}
        setBlog={setBlog}
      />
      <FormModal
        isOpen={addModalOpen}
        onClose={handleAddModalClose}
        isNotStepOne={true}
      >
        <div className="text-center text-white font-semibold text-xl">
          Mettre à jour
        </div>
        <AddBlogForm
          file={file}
          setFile={setFile}
          onSubmit={(data) => updateBlog(parseInt(id), data, blog)}
          isUpdate={true}
          blog={blog}
          setBlog={setBlog}
        />
      </FormModal>
    </div>
  );
};

export default BlogOverview;
