"use client";

import { useEffect, useState } from "react";
import { NotificationData } from "@/consts/notifications";


interface FilterValues {
  postTime: string;
  notificationType: string;
  consultationTime: string;
  consultationType: string;
}

export const useNotifications = () => {
  const [filters, setFilters] = useState<FilterValues>({
    postTime: "Tous",
    notificationType: "Tous",
    consultationTime: "Tous",
    consultationType: "Tous",
  });
  
  const [allNotifications, setAllNotifications] = useState<NotificationType[]>(NotificationData);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationType[]>([]);

  // Apply filters whenever any filter value changes or when allNotifications changes
  useEffect(() => {
    const filtered = applyFilters(allNotifications, filters);
    setFilteredNotifications(filtered);
  }, [filters, allNotifications]);

  // Initialize filteredNotifications with sorted allNotifications
  useEffect(() => {
    const sortedNotifications = sortNotificationsByDate([...allNotifications]);
    setFilteredNotifications(sortedNotifications);
  }, []);

  const updateFilter = (filterType: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const deleteNotification = (notificationId: number) => {
    setAllNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  return {
    filters,
    filteredNotifications,
    updateFilter,
    deleteNotification
  };
};

// Helper functions

// Sort notifications by date (most recent first)
const sortNotificationsByDate = (notifications: NotificationType[]): NotificationType[] => {
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Apply all filters to the notifications
const applyFilters = (
  notifications: NotificationType[], 
  filters: FilterValues
): NotificationType[] => {
  let filtered = [...notifications];
  
  // Start by sorting notifications by date
  filtered = sortNotificationsByDate(filtered);
  
  // Filter by notification type
  if (filters.notificationType !== "Tous") {
    const typeMapping: { [key: string]: string } = {
      "Commentaires": "comment",
      "Consultations": "consultation",
      "Documents": "document"
    };
    
    const typeFilter = typeMapping[filters.notificationType] || filters.notificationType.toLowerCase();
    filtered = filtered.filter(notification => 
      notification.type.toLowerCase() === typeFilter
    );
  }
  
  // Apply time filter to all notifications
  if (filters.postTime !== "Tous") {
    filtered = applyTimeFilter(filtered, filters.postTime);
  }
  
  // Apply consultation-specific filters if showing consultations
  if ((filters.notificationType === "Tous" || filters.notificationType === "Consultations") && 
      (filters.consultationType !== "Tous" || filters.consultationTime !== "Tous")) {
    
    // Get only consultation notifications
    let consultationNotifications = filtered.filter(notification => 
      notification.type.toLowerCase() === "consultation"
    );
    
    // Apply consultation status filter
    if (filters.consultationType !== "Tous") {
      consultationNotifications = consultationNotifications.filter(notification => {
        if (!notification.status) return false;
        
        return notification.status.toLowerCase() === 
          (filters.consultationType === "Acceptée" ? "accepted" : "rejected").toLowerCase();
      });
    }
    
    // Apply consultation time filter
    if (filters.consultationTime !== "Tous") {
      consultationNotifications = applyTimeFilter(consultationNotifications, filters.consultationTime);
    }
    
    // Merge or replace based on notification type filter
    if (filters.notificationType === "Tous") {
      const nonConsultationNotifications = filtered.filter(notification => 
        notification.type.toLowerCase() !== "consultation"
      );
      filtered = [...nonConsultationNotifications, ...consultationNotifications];
    } else {
      filtered = consultationNotifications;
    }
  }
  
  // Sort final results again
  return sortNotificationsByDate(filtered);
};

// Helper function to apply time filtering
const applyTimeFilter = (notifications: NotificationType[], timeValue: string): NotificationType[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return notifications.filter(notification => {
    const createdDate = new Date(notification.createdAt);
    
    switch (timeValue) {
      case "Aujourde'hui":
        return createdDate >= today;
      case "7 dernier jours":
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return createdDate >= sevenDaysAgo;
      case "30 dernier jours":
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
      case "cette annee (2025)":
        return createdDate.getFullYear() === 2025;
      case "cette annee (2024)":
        return createdDate.getFullYear() === 2024;
      default:
        return true;
    }
  });
};