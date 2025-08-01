import axios from "@/lib/utils/axiosClient";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useAlert } from "@/contexts/AlertContext";

export const useAttorneyBlogs = () => {
  const [blogs, setBlogs] = useState<(Blog & { selected?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const { showAlert } = useAlert();
  const selectedBlogs = blogs.filter((blog) => blog.selected);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [status, setStatus] = useState<'accepted' | 'pending' | 'refused'>('accepted');
  const perPage = 6;

  const fetchBlogs = async (page: number = currentPage, statusFilter = status) => {
    try {
      setLoading(true);
      const response = await axios.get(`/attorney/blogs?page=${page}&status=${statusFilter}`);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, status]);

  const handleStatusChange = (newStatus: 'accepted' | 'pending' | 'refused') => {
    setStatus(newStatus);
    setCurrentPage(1);
  };

  const toggleSelect = (id: number) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        (blog.id as number) === id
          ? { ...blog, selected: !blog.selected }
          : blog
      )
    );
  };

  const addBlog = async (data: BlogFormData, onSuccess?: () => void) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("body", data.body);
      formData.append("readingDuration", data.readingDuration.toString());
      formData.append("categoryId", data.categoryId.toString());
      if (file) {
        formData.append("image", file);
      }
      const response = await axios.post("/attorney/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        showAlert("success", "Blog ajouté avec succès", "...");
        setFile(null);
        onSuccess?.();
        fetchBlogs(1, status);
      } else {
        showAlert("error", "Erreur d'ajout de blog", response.data);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        showAlert("error", "Erreur d'ajout de blog", error.response?.data?.message || "Une erreur est survenue");
      } else {
        showAlert("error", "Erreur d'ajout de blog", "Une erreur est survenue");
      }
    }
  };

  const updateBlog = async (
    blogId: number,
    data: BlogFormData,
    oldBlogData: Blog,
    onSuccess?: () => void,
  ) => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (data.title !== oldBlogData.title) formData.append("title", data.title);
      if (data.body !== oldBlogData.body) formData.append("body", data.body);
      if (data.readingDuration !== oldBlogData.readingDuration) formData.append("readingDuration", data.readingDuration.toString());
      if (data.categoryId !== oldBlogData.categoryId) formData.append("categoryId", data.categoryId.toString());
      if (file) formData.append("image", file);
      const response = await axios.put(`/attorney/blogs/${blogId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        showAlert("success", "Blog mis à jour avec succès", "...");
        setFile(null);
        onSuccess?.();
        fetchBlogs(currentPage, status);
      } else {
        showAlert("error", "Erreur de mise à jour du blog", response.data);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        showAlert("error", "Erreur de mise à jour du blog", error.response?.data?.message || "Une erreur est survenue");
      } else {
        showAlert("error", "Erreur de mise à jour du blog", "Une erreur est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogs = async () => {
    try {
      const response = await axios.delete("/attorney/blogs", {
        data: { ids: blogs.filter((blog) => blog.selected).map((blog) => blog.id) },
      });
      if (response.status === 200) {
        setBlogs((prev) => prev.filter((blog) => !blog.selected));
        showAlert("success", "Blog supprimé avec succès", "...");
        fetchBlogs(currentPage, status);
      } else {
        showAlert("error", "Erreur de supprimer des blogs", response.data);
      }
    } catch {
      showAlert("error", "Erreur de supprimer des blogs", "Une erreur est survenue");
    }
  };

  return {
    blogs,
    loading,
    selectedBlogs,
    toggleSelect,
    deleteBlogs,
    addBlog,
    file,
    setFile,
    totalPages,
    currentPage,
    perPage,
    setCurrentPage,
    status,
    handleStatusChange,
    fetchBlogs,
    updateBlog,
  };
}; 