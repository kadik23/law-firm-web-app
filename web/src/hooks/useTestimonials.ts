import axios from "@/lib/utils/axiosClient";
import { useEffect, useState } from "react";

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<avisEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/user/testimonials");
      setTestimonials(response.data.testimonials);
    } catch (err) {
      setError("Failed to fetch testimonials");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    error,
    refetchTestimonials: fetchTestimonials,
  };
};