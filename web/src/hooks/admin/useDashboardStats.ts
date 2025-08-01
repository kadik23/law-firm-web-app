import { useState, useEffect, useCallback } from "react";
import axios from "@/lib/utils/axiosClient";
import { isAxiosError } from "axios";

export interface DashboardStats {
  totalAvocats: number;
  totalServices: number;
  totalTestimonials: number;
  totalBlogs: number;
  totalClients: number;
  totalConsultations: number;
  totalClientFiles: number;
  totalCategories: number;
  recentConsultations: Array<{
    id: number;
    clientName: string;
    status: string;
    date: string;
    time: string;
    createdAt: string;
  }>;
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
  pendingConsultations: number;
  completedConsultations: number;
  pendingFiles: number;
  acceptedFiles: number;
  refusedFiles: number;
  monthlyStats: {
    consultations: number;
    newClients: number;
    newServices: number;
    newBlogs: number;
  };
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/admin/dashboard/stats");
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