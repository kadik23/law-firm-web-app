"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAttorneyBlogs } from "@/hooks/attorney/useAttorneyBlogs";
import FormModal from "@/components/dashboard/admin/formModal";
import { AddBlogForm } from "@/components/dashboard/admin/AddBlogForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import axios from "@/lib/utils/axiosClient";

const BlogDetails = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const {
    file,
    setFile,
    updateBlog,
  } = useAttorneyBlogs();

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/attorney/blogs/${id}`);
        setBlog(res.data);
      } catch {
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Blog introuvable !</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{blog.title}</h1>
        {!blog.accepted && (
          <button
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => setUpdateModalOpen(true)}
          >
            Modifier
          </button>
        )}
      </div>
      <img src={blog.image} alt="blog" className="w-full h-64 object-cover rounded mb-4" />
      <div className="mb-2 text-gray-700">{blog.body}</div>
      <div className="text-sm text-gray-500 mb-2">Durée de lecture: {blog.readingDuration} min</div>
      <div className="text-sm text-gray-500 mb-2">Catégorie ID: {blog.categoryId}</div>
      {blog.rejectionReason && !blog.accepted && (
        <div className="mt-2 text-xs text-red-500">Raison du refus: {blog.rejectionReason}</div>
      )}
      <div className="mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded-md"
          onClick={() => router.back()}
        >
          Retour
        </button>
      </div>
      <FormModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        isNotStepOne={true}
      >
        <div className="text-center text-white font-semibold text-xl mb-4">
          Mettre à jour le blog
        </div>
        <AddBlogForm
          file={file}
          setFile={setFile}
          onSubmit={(data) =>
            updateBlog(
              blog.id as number,
              data,
              blog,
              () => {
                setUpdateModalOpen(false);
                // Refetch blog after update
                axios.get(`/attorney/blogs/${id}`).then((res) => setBlog(res.data));
              }
            )
          }
          isUpdate={true}
          blog={blog}
          setBlog={setBlog}
        />
      </FormModal>
    </div>
  );
};

export default BlogDetails; 