import axios from "@/lib/utils/axiosClient";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useAlert } from "@/contexts/AlertContext";

export const useBlogsM = () => {
  const [blogs, setBlogs] = useState<(Blog & { selected?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const { showAlert } = useAlert();
  const selectedBlogs = blogs.filter((blog) => blog.selected);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("Catégorie");
  const [selectedTime, setSelectedTime] = useState<string>("Date de poste");
  const perPage = 6;

  const fetchBlogs = async (page: number = currentPage) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/admin/blogs/filter?page=${page}&limit=${perPage}&category=${selectedCategory}&time=${selectedTime}`
      );
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        console.warn("Blogs not found");
      } else {
        console.error("An unexpected error occurred:", err);
      }
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory, selectedTime]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setCurrentPage(1); // Reset to first page when filter changes
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

  const deleteBlogs = async () => {
    try {
      const response = await axios.delete("/admin/blogs/delete", {
        data: {
          ids: blogs.filter((blog) => blog.selected).map((blog) => blog.id),
        },
      });

      if (response.status === 200) {
        setBlogs((prev) => prev.filter((blog) => !blog.selected));
        showAlert("success", "Blog supprimé avec succès", "...");
      } else {
        showAlert("error", "Erreur de supprimer des blogs", response.data);
      }
    } catch (error: unknown) {
      console.error("Error adding blogs:", error);
      showAlert(
        "error",
        "Erreur de supprimer des blogs",
        "Une erreur est survenue"
      );
    }
  };

  const addBlog = async (data: BlogFormData, onSuccess?: () => void) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("body", data.body);
      formData.append("readingDuration", data.readingDuration.toString());
      formData.append("categoryId", data.name.toString());
      if (file) {
        formData.append("image", file);
      }

      const response = await axios.post("/admin/blogs/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const newBlog: Blog & { selected?: boolean } = {
          id: response.data.id,
          title: data.title,
          body: data.body,
          readingDuration: data.readingDuration,
          categoryId: parseInt(data.name),
          image: response.data.image || "/images/avocatImg.png",
          likes: 0,
          author: "admin",
          updatedAt: new Date(),
          createdAt: new Date(),
          selected: false,
          category: response.data.category
        };

        setBlogs((prev) => [
          ...prev,
          {
            ...newBlog,
          },
        ]);
        showAlert("success", "Blog ajouté avec succès", "...");
        setFile(null);
        onSuccess?.();
      } else {
        showAlert("error", "Erreur d'ajout de blog", response.data);
      }
    } catch (error: unknown) {
      console.error("Error adding blog:", error);
      showAlert("error", "Erreur d'ajout de blog", "Une erreur est survenue");
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
    selectedCategory,
    selectedTime,
    handleCategoryChange,
    handleTimeChange,
    fetchBlogs
  };
};
