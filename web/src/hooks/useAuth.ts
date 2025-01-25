import { useEffect, useState } from "react";
import axios from "@/lib/utils/axiosClient";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/user/current", { withCredentials: true });
        setUser(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.warn("User not authenticated");
        } else {
          console.error("An unexpected error occurred:", err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
