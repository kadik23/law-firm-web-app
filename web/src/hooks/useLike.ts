import { useAlert } from "@/contexts/AlertContext";
import axios from "@/lib/utils/axiosClient";
import { useState } from "react";

export const useLike = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const likeBlog = async (blogId: number) => {
    setLoading(true);
    try {
      await axios.post("/user/blogs/likeblog", { id: blogId });
      showAlert(
        "success",
        "J'aime le blog avec succès",
        "Vous avez lu avec succès ce message important."
      );
      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to like a blog");
      showAlert(
        "error",
        "Oh claquement !",
        "Impossible d'aimer un blog"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const dislike = async (blogId: number) => {
    setLoading(true);
    try {
      await axios.post(`/user/blogs/dislikeblog`,{id:blogId});
      showAlert(
        "success",
        "Je n'aime pas le blog avec succès",
        "Vous avez lu avec succès ce message important."
      );
      return true;
    } catch (err) {
      console.error(err);
      setError("Failed to remove from likes");
      showAlert(
        "error",
        "Oh claquement !",
        "Impossible de ne pas aimer un blog"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getlikesCount = async (id: number) => {
    try {
      const response = await axios.get(`/user/blogs/like/count/${id}`);
      return response.data.totalLikees;
    } catch (err) {
      console.error(err);
      setError("Failed to get likes count");
      return 0;
    }
  };

  return {
    loading,
    error,
    likeBlog,
    dislike,
    getlikesCount,
  };
};