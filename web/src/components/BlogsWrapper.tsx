"use client";

import { BlogsFiltersProvider } from "@/contexts/BlogsFiltersContext";

const BlogsWrapper = ({ children }: { children: React.ReactNode }) => {
  return <BlogsFiltersProvider>{children}</BlogsFiltersProvider>;
};

export default BlogsWrapper;
