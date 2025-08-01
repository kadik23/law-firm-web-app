import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/utils/axiosClient";
import { isAxiosError } from "axios";

export interface AttorneyDashboardStats {
  totalAttorneys: number;
  totalServices: number;
  totalTestimonials: number;
  totalBlogs: number;
  myBlogs: number;
  pendingBlogs: number;
  acceptedBlogs: number;
  refusedBlogs: number;
  assignedServices: number;
  pendingAssignedServices: number;
  completedAssignedServices: number;
  recentBlogs: Array<{
    id: number;
    title: string;
    status: boolean;
    createdAt: string;
  }>;
  recentServices: Array<{
    id: number;
    name: string;
    price: number;
    createdAt: string;
  }>;
  recentTestimonials: Array<{
    id: number;
    content: string;
    rating: number;
    createdAt: string;
  }>;
  monthlyStats: {
    newBlogs: number;
    newServices: number;
    newTestimonials: number;
  };
}

export const useAttorneyDashboardStats = () => {
  const [stats, setStats] = useState<AttorneyDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/attorney/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to fetch dashboard stats");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}; 