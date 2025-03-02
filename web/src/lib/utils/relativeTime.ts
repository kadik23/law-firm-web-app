// utils/relativeTime.ts
export const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000; // Years
    if (interval > 1) {
        return Math.floor(interval) + " year(s) ago";
    }
    interval = seconds / 2592000; // Months
    if (interval > 1) {
        return Math.floor(interval) + " month(s) ago";
    }
    interval = seconds / 86400; // Days
    if (interval > 1) {
        return Math.floor(interval) + " day(s) ago";
    }
    interval = seconds / 3600; // Hours
    if (interval > 1) {
        return Math.floor(interval) + " hour(s) ago";
    }
    interval = seconds / 60; // Minutes
    if (interval > 1) {
        return Math.floor(interval) + " minute(s) ago";
    }
    return Math.floor(seconds) + " second(s) ago";
};