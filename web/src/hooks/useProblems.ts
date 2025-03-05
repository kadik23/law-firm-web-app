import axios from "@/lib/utils/axiosClient";
import { useState, useEffect } from "react";

export const useProblems = () => {
  const [problems, setProblems] = useState<problemEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/user/problems");
      setProblems(response.data);
    } catch (err) {
      setError("Failed to fetch problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProblemsByCategory = async (category_id: number) => {
    try {
      setLoading(true);
      if (category_id === 0) {
        fetchProblems();
      } else {
        const response = await axios.get(
          `/user/problems/category/${category_id}`
        );
        setProblems(response.data);
      }
    } catch (err) {
      setError("Failed to fetch problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return { problems, loading, error, fetchProblemsByCategory };
};
