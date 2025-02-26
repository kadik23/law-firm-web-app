import axios from "@/lib/utils/axiosClient";
import { useState } from "react";

export const useTestimonialsByService = () => {
  const [testimonials, setTestimonials] = useState<avisEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async (service_id: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`/user/testimonials/service/${service_id}`);
      setTestimonials(response.data.testimonials);
    } catch (err) {
      setError("Failed to fetch testimonials");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    testimonials,
    loading,
    error,
    fetchTestimonials,
    setTestimonials
  };
};