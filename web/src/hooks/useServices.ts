import axios from "@/lib/utils/axiosClient";
import { useState, useEffect } from "react";

export const useServices = () => {
  const [services, setServices] = useState<serviceEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchServices = async () => {
    try {
      const response = await axios.get("/user/services");
      setServices(response.data);
    } catch (err) {
      setError("Failed to fetch services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServicesByProblem = async (problem_id: number) => {
    try {
      setLoading(true);
      if (problem_id === 0) {
        fetchServices();
      } else {
        const response = await axios.get(
          `/user/services/problem/${problem_id}`
        );
        setServices(response.data);
      }
    } catch (err) {
      setError("Failed to fetch services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { services, loading, error, fetchServicesByProblem };
};
