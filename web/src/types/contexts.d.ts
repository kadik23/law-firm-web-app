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
  setLoading: Dispatch<SetStateAction<boolean>>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

interface NotificationContextType {
  filters: FilterValues;
  notifications: NotificationType[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  updateFilter: (filterType: keyof FilterValues, value: string) => void;
  deleteNotification: (notificationId: number) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  fetchNotifications: (page?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  perPage: number;
  setUnreadCount: (count: number) => void;
}

type AlertContextType = {
  showAlert: (type: string, title: string, message: string) => void;
  closeAlert: () => void; 
  setShowAlert: (show: boolean) => void;
};