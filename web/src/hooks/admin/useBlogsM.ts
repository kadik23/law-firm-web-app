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
  const [status, setStatus] = useState<'accepted' | 'pending' | 'refused'>('accepted');
  const perPage = 6;

  const fetchBlogs = async (page: number = currentPage, statusFilter = status) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/admin/blogs/filter?page=${page}&limit=${perPage}&category=${selectedCategory}&time=${selectedTime}&status=${statusFilter}`
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
  }, [currentPage, selectedCategory, selectedTime, status]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    setCurrentPage(1); // Reset to first page when filter changes
  };

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

  const updateBlog = async (
    blogId: number,
    data: BlogFormData,
    oldBlogData: Blog,
    onSuccess?: () => void,
  ) => {
    try {
      setLoading(true);
      console.log("Starting blog update...");
      console.log("Blog ID:", blogId);
      console.log("Form data:", data);
      console.log("Old blog data:", oldBlogData);
      console.log("File:", file);

      const formData = new FormData();
      formData.append("id", blogId.toString());
      
      // Only append fields that have changed
      if (oldBlogData.title !== data.title)
        formData.append("title", data.title);
      if (oldBlogData.body !== data.body) 
        formData.append("body", data.body);
      if (oldBlogData.readingDuration !== data.readingDuration)
        formData.append("readingDuration", data.readingDuration.toString());
      if (oldBlogData.categoryId !== data.categoryId)
        formData.append("categoryId", data.categoryId.toString());

      if (file) {
        formData.append("image", file);
      }

      // Log the FormData contents
      for (const pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      console.log("Sending PUT request to /admin/blogs/update");
      const response = await axios.put("/admin/blogs/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response received:", response);

      if (response.status === 200) {
        console.log("Update successful");
        showAlert("success", "Blog mis à jour avec succès", "...");
        setFile(null);
        if (onSuccess) {
          console.log("Calling onSuccess callback");
          onSuccess();
        }
      } else {
        console.log("Update failed with status:", response.status);
        showAlert("error", "Erreur de mise à jour du blog", response.data);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      if (isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        showAlert(
          "error",
          "Erreur de mise à jour du blog",
          error.response?.data?.message ||
            error.message ||
            "Une erreur est survenue"
        );
      } else {
        showAlert(
          "error",
          "Erreur de mise à jour du blog",
          "Une erreur est survenue"
        );
      }
    } finally {
      setLoading(false);
    }
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
      formData.append("categoryId", data.categoryId.toString());
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
          category: response.data.category,
          accepted: true,
          rejectionReason: null,
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

  const processBlog = async (
    id: number,
    action: "accept" | "refuse",
    rejectionReason?: string,
    onSuccess?: () => void
  ) => {
    try {
      setLoading(true);
      const response = await axios.put("/admin/blogs/process", {
        id,
        action,
        rejectionReason,
      });
      if (response.status === 200) {
        showAlert("success", `Blog ${action === "accept" ? "accepté" : "refusé"} avec succès`, "...");
        fetchBlogs(currentPage);
        onSuccess?.();
      } else {
        showAlert("error", "Erreur de traitement du blog", response.data);
      }
    } catch {
      showAlert("error", "Erreur de traitement du blog", "Une erreur est survenue");
    } finally {
      setLoading(false);
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
    fetchBlogs,
    updateBlog,
    processBlog,
    status,
    handleStatusChange,
  };
};
