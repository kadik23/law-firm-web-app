import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import axios from "@/lib/utils/axiosClient";

function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await axios.get("/user/categories/all");
          setCategories(response.data);
        } catch (err: unknown) {
          if (isAxiosError(err) && err.response?.status === 401) {
            console.warn("Categories not found");
          } else {
            console.error("An unexpected error occurred:", err);
          }
          setCategories([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCategories();
    }, []);
  return { categories, loading }
}

export default useCategories