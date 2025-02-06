import axios from "@/lib/utils/axiosClient";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";

export const useAttorneys = () => {
    const [attorneys, setAttorneys] = useState<avocatEntity[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchAttorneys = async () => {
        try {
          const response = await axios.get("/user/attorneys");
          setAttorneys(response.data);
        } catch (err: unknown) {
          if (isAxiosError(err) && err.response?.status === 401) {
            console.warn("Attorneys not found");
          } else {
            console.error("An unexpected error occurred:", err);
          }
          setAttorneys([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAttorneys();
    }, []);
    return { attorneys, loading }
  };  