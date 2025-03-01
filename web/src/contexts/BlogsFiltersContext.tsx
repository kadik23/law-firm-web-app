import { createContext, ReactNode, useState, useEffect } from "react";
import axios from "@/lib/utils/axiosClient";
import { isAxiosError } from "axios";

export const BlogsFiltersContext = createContext<
  BlogsFiltersContextType | undefined
>(undefined);

export const BlogsFiltersProvider = ({ children }: { children: ReactNode }) => {
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sort, setSort] = useState<"new" | "best" | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/user/blogs/all");
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setBlogs(response.data.blogs);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        console.warn("Blog not found");
      } else {
        console.error("An unexpected error occurred:", err);
      }
      setBlogs([]);
    } finally {
      setBlogsLoading(false);
    }
  };
  const getFilteredBlogs = async (page: number = 1) => {
    try {
      const params: Record<string, string> = { page: page.toString() };
      if (selectedCategory) params.categoryId = selectedCategory.id.toString();
      if (sort) params.sort = sort;
      if (searchInput !== "") params.title = searchInput;

      const response = await axios.get("/user/blogs/sort", { params });
      setBlogs(response.data.blogs);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        console.warn("Blog not found");
      } else {
        console.error("An unexpected error occurred:", err);
      }
      setBlogs([]);
    } finally {
      setBlogsLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/user/categories/all");
      setCategories(response.data);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        console.warn("Categories not found");
      } else {
        console.error("An unexpected error occurred:", err);
      }
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, []);

  return (
    <BlogsFiltersContext.Provider
      value={{
        blogs,
        setBlogs,
        blogsLoading,
        setBlogsLoading,
        categoriesLoading,
        setCategoriesLoading,
        categories,
        setCategories,
        getFilteredBlogs,
        selectedCategory,
        setSelectedCategory,
        searchInput,
        setSearchInput,
        sort,
        setSort,
        totalPages,
        setTotalPages,
        currentPage,
        setCurrentPage,
      }}
    >
      {children}
    </BlogsFiltersContext.Provider>
  );
};
