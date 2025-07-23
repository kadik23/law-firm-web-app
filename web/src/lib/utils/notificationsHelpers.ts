export const sortNotificationsByDate = (
  notifications: NotificationType[]
): NotificationType[] => {
  return [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const applyFilters = (
  notifications: NotificationType[],
  filters: FilterValues
): NotificationType[] => {
  let filtered = [...notifications];
  filtered = sortNotificationsByDate(filtered);
  if (filters.notificationType !== "Tous") {
    const typeMapping: { [key: string]: string } = {
      Commentaires: "Comments",
      Consultations: "Consultation",
      Documents: "Documents",
    };
    const typeFilter =
      typeMapping[filters.notificationType] || filters.notificationType;
    filtered = filtered.filter(
      (notification) => notification.type === typeFilter
    );
  }
  if (filters.postTime !== "Tous") {
    filtered = applyTimeFilter(filtered, filters.postTime);
  }
  if (
    (filters.notificationType === "Tous" ||
      filters.notificationType === "Consultations") &&
    (filters.consultationType !== "Tous" || filters.consultationTime !== "Tous")
  ) {
    let consultationNotifications = filtered.filter(
      (notification) => notification.type === "Consultation"
    );
    if (filters.consultationType !== "Tous") {
      consultationNotifications = consultationNotifications.filter(
        (notification) => {
          if (!notification.status) return false;
          return (
            notification.status.toLowerCase() ===
            (filters.consultationType === "Acceptée"
              ? "accepted"
              : "rejected"
            ).toLowerCase()
          );
        }
      );
    }
    if (filters.consultationTime !== "Tous") {
      consultationNotifications = applyTimeFilter(
        consultationNotifications,
        filters.consultationTime
      );
    }
    if (filters.notificationType === "Tous") {
      const nonConsultationNotifications = filtered.filter(
        (notification) => notification.type !== "Consultation"
      );
      filtered = [
        ...nonConsultationNotifications,
        ...consultationNotifications,
      ];
    } else {
      filtered = consultationNotifications;
    }
  }
  return sortNotificationsByDate(filtered);
};

export const applyTimeFilter = (
  notifications: NotificationType[],
  timeValue: string
): NotificationType[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return notifications.filter((notification) => {
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
