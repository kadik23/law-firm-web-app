// context/AuthContext.tsx
import { createContext, ReactNode, useState, useEffect } from "react";
import axios from "@/lib/utils/axiosClient";
import { isAxiosError } from "axios";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/user/current", { withCredentials: true });
        setUser(response.data);
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 401) {
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

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
