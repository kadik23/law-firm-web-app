interface BlogsFiltersContextType {
    blogs: Blog[];
    setBlogs: (blogs: Blog[]) => void;
    blogsLoading: boolean;
    setBlogsLoading: (loading: boolean) => void;
    categoriesLoading: boolean;
    setCategoriesLoading: (loading: boolean) => void;
    categories: Category[];
    setCategories: (categories: Category[]) => void;
    getFilteredBlogs: (page: number = 1) => void;
    selectedCategory: Category | null;
    setSelectedCategory: (category: Category | null) => void;
    searchInput: string;
    setSearchInput: (input: string) => void;
    sort: 'new' | 'best' | null;
    setSort: (sort: 'new' | 'best' | null) => void;
    totalPages: number;
    setTotalPages: (totalPages: number) => void;
    currentPage: number;
    setCurrentPage: (currentPage: number) => void;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}
