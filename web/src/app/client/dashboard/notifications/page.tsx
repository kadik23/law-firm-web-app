"use client";

import { useEffect } from "react";
import Image from "next/image";
import FilterControls from "@/components/dashboard/Notification/FilterControls";
import NotificationItem from "@/components/dashboard/Notification/NotificationItem";
import Pagination from "@/components/Pagination";
import { useNotificationContext } from "@/contexts/NotificationContext";

const Notifications = () => {
    const {
      filters,
      notifications,
      updateFilter,
      deleteNotification,
      markAsRead,
      currentPage,
      totalPages,
      setCurrentPage,
      fetchNotifications,
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

  return (
    <div className="mx-6 md:mx-0">
      <div className="mb-8 flex items-center gap-2 text-3xl font-black text-primary">
        <Image
          src="/icons/notification-primary.svg"
          alt="notification"
          width={28}
          height={33}
        />
        Notifications
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
          notifications
            .map((item) => (
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
