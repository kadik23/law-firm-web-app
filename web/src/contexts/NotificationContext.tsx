"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { io } from "socket.io-client";
import axios from "@/lib/utils/axiosClient";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/contexts/AlertContext";
import { applyFilters } from "@/lib/utils/notificationsHelpers";

interface NotificationResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
  notifications: NotificationType[];
}

interface UnreadCountResponse {
  success: boolean;
  unreadNotifications: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterValues>({
    postTime: "Tous",
    notificationType: "Tous",
    consultationTime: "Tous",
    consultationType: "Tous",
  });
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const perPage = 6;

  const endpointPrefix = '/admin/notifications';

  // Socket connection for real-time updates
  useEffect(() => {
    if (user?.id) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080');
      newSocket.on('connect', () => {
        newSocket.emit('register', user.id);
      });
      newSocket.on('receive_notification', () => {
        fetchUnreadCount();
        // fetchNotifications(currentPage);
      });
      return () => {
        newSocket.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, currentPage]);

  const fetchNotifications = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<NotificationResponse>(`${endpointPrefix}/all?page=${page}`);
      if (response.data.success) {
        setNotifications(response.data.notifications as NotificationType[]);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      }
    } catch (err) {
      setError('Failed to fetch notifications' + err);
    } finally {
      setLoading(false);
    }
  }, [endpointPrefix]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get<UnreadCountResponse>(`${endpointPrefix}/unread/count`);
      if (response.data.success) {
        setUnreadCount(response.data.unreadNotifications);
      }
    } catch {}
  }, [endpointPrefix]);

  // Initial data fetch
  useEffect(() => {
    if (user?.id) {
      fetchNotifications(currentPage);
      fetchUnreadCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, currentPage]);

  // Re-fetch notifications on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id) {
        fetchNotifications(currentPage);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user?.id, currentPage, fetchNotifications]);

  // Apply filters on the current page only
  const filteredNotifications = applyFilters(notifications, filters);

  const updateFilter = (filterType: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      await axios.delete(`${endpointPrefix}/${notificationId}`);
      showAlert("success", "Notification supprimée avec succès", "...");
      fetchUnreadCount();
    } catch {
      fetchNotifications(currentPage);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      setNotifications(prev => prev.map(notification => notification.id === notificationId ? { ...notification, isRead: true } : notification));
      await axios.put(`${endpointPrefix}/${notificationId}/read`);
      fetchUnreadCount();
    } catch {}
  };

  return (
    <NotificationContext.Provider value={{
      filters,
      notifications: filteredNotifications,
      unreadCount,
      loading,
      error,
      updateFilter: updateFilter as (filterType: string | number | symbol, value: string) => void,
      deleteNotification,
      markAsRead,
      fetchNotifications,
      fetchUnreadCount,
      currentPage,
      setCurrentPage,
      totalPages,
      perPage,
      setUnreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
};

// Helper functions
