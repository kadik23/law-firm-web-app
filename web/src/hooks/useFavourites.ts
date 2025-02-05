import axios from "@/lib/utils/axiosClient";
import { useState } from "react";

export const useFavorites = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFavorites = async () => {
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
  };

  const searchFavorites =async (query: string) => {
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
  };

  const addToFavorites = async (blogId: number) => {
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
  };

  const removeFromFavorites = async (blogId: number) => {
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
  };

  const removeAllFavorites = async () => {
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
  };

  const getFavoritesCount = async () => {
    try {
      const response = await axios.get("/user/favorites/count");
      return response.data.totalFavorites;
    } catch (err) {
      setError("Failed to get favorites count");
      return 0;
    }
  };

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