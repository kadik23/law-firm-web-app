import axios from "@/lib/utils/axiosClient";
import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getFavorites = useCallback(async () => {
    if (!user) return [];
    setLoading(true);
    try {
      const response = await axios.get("/user/favorites");
      console.log("api response: ",response.data);
      return response.data;
    } catch (err) {
      setError("Failed to fetch favorites");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const searchFavorites = useCallback(async (query: string) => {
    if (!user) return [];
    setLoading(true);
    try {
      const response = await axios.get(`/user/favorites/search?q=${query}`);
      return response.data;
    } catch (err) {
      setError("Failed to search favorites");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToFavorites = useCallback(async (blogId: number) => {
    if (!user) return false;
    setLoading(true);
    try {
      await axios.post("/user/favorites", { blogId });
      return true;
    } catch (err) {
      setError("Failed to add to favorites");
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeFromFavorites = useCallback(async (blogId: number) => {
    if (!user) return false;
    setLoading(true);
    try {
      await axios.delete(`/user/favorites/${blogId}`);
      return true;
    } catch (err) {
      setError("Failed to remove from favorites");
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeAllFavorites = useCallback(async () => {
    if (!user) return false;
    setLoading(true);
    try {
      await axios.delete("/user/favorites");
      return true;
    } catch (err) {
      setError("Failed to remove all favorites");
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getFavoritesCount = useCallback(async () => {
    if (!user) return 0;
    try {
      const response = await axios.get("/user/favorites/count");
      return response.data.count;
    } catch (err) {
      setError("Failed to get favorites count");
      return 0;
    }
  }, [user]);

  return {
    loading,
    error,
    getFavorites,
    searchFavorites,
    addToFavorites,
    removeFromFavorites,
    removeAllFavorites,
    getFavoritesCount
  };
};