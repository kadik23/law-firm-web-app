// Notifications.tsx - UI component
"use client";

import { useEffect } from "react";
import Image from "next/image";
import FilterControls from "@/components/dashboard/Notification/FilterControls";
import NotificationItem from "@/components/dashboard/Notification/NotificationItem";
import Pagination from "@/components/Pagination";
import { useNotifications } from "@/hooks/useNotifications";
import usePagination from "@/hooks/usePagination ";

const Notifications = () => {
  const {
    filters,
    filteredNotifications,
    updateFilter,
    deleteNotification
  } = useNotifications();

  const NotificationDataPerPage = 6;
  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    generatePaginationNumbers,
    setCurrentPage,
  } = usePagination(filteredNotifications.length, NotificationDataPerPage);

  // Reset to first page when filters or data change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredNotifications.length, setCurrentPage]);

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
        {filteredNotifications.length > 0 ? (
          filteredNotifications
            .slice(
              (currentPage - 1) * NotificationDataPerPage,
              currentPage * NotificationDataPerPage
            )
            .map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onDelete={deleteNotification}
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
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          generatePaginationNumbers={generatePaginationNumbers}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Notifications;