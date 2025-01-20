import { useEffect, useState } from "react";
import axios from "@/lib/utils/axiosClient";

export const useAuth = () => {
  const [user, setUser] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/user/current", { withCredentials: true });
        setUser(response.data);
      } catch (err) {
        console.error("User not authenticated:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
