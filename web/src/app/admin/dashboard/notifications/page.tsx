"use client";

import { useEffect } from "react";
import Image from "next/image";
import FilterControls from "@/components/dashboard/Notification/FilterControls";
import NotificationItem from "@/components/dashboard/Notification/NotificationItem";
import Pagination from "@/components/Pagination";
import { useNotificationContext } from "@/contexts/NotificationContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const Notifications = () => {
  const {
    filters,
    notifications,
    unreadCount,
    loading,
    error,
    updateFilter,
    deleteNotification,
    markAsRead,
    fetchNotifications,
    currentPage,
    setCurrentPage,
    totalPages
  } = useNotificationContext();

  // Reset to first page when filters or data change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, setCurrentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchNotifications(page);
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-4">Error: {error}</div>
        <button 
          onClick={() => fetchNotifications(currentPage)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-6 md:mx-0">
      <div className="mb-8 flex items-center gap-2 text-2xl font-black text-primary">
        <Image
          src="/icons/notification-primary.svg"
          alt="notification"
          width={24}
          height={32}
        />
        Notifications
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full ml-2">
            {unreadCount} unread
          </span>
        )}
      </div>
      <FilterControls
        postTimeValue={filters.postTime}
        notificationTypeValue={filters.notificationType}
        consultationTimeValue={filters.consultationTime}
        consultationTypeValue={filters.consultationType}
        onPostTimeChange={(value) => updateFilter('postTime', value)}
        onNotificationTypeChange={(value) => updateFilter('notificationType', value)}
        onConsultationTimeChange={(value) => updateFilter('consultationTime', value)}
        onConsultationTypeChange={(value) => updateFilter('consultationType', value)}
      />
      <div className="flex flex-col gap-4">
        {notifications.length > 0 ? (
          notifications.map((item: NotificationType) => (
            <NotificationItem
              key={item.id}
              item={item}
              onDelete={deleteNotification}
              onMarkAsRead={markAsRead}
            />
          ))
        ) : (
          <div className="text-center py-8 text-lg text-secondary">
            Aucune notification trouvée
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPreviousPage={() => handlePageChange(currentPage - 1)}
          goToNextPage={() => handlePageChange(currentPage + 1)}
          generatePaginationNumbers={() => {
            // Simple pagination numbers generator
            const pages = [];
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
          }}
          setCurrentPage={handlePageChange}
        />
      )}
    </div>
  );
};

export default Notifications;