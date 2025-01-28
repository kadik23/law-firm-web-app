import { BlogsFiltersContext } from "@/contexts/BlogsFiltersContext";
import { useContext } from "react";

export const useBlogs = (): BlogsFiltersContextType => {
  const context = useContext(BlogsFiltersContext);
  if (!context) {
    throw new Error("useBlogs must be used within an AuthProvider");
  }
  return context;
};  