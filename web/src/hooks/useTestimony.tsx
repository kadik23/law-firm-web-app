import axios from "@/lib/utils/axiosClient";
import { useState } from "react";

export const useTestimony = () => {
  const [comment, setComment] = useState("");
  const [newTestimonialObject, setNewTestimonialObject] =
    useState<null | avisEntity>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testimony = async (serviceId: number) => {
    try {
      setLoading(true);
      const response = await axios.post("/user/testimonials", {
        feedback: comment,
        serviceId,
      });
      if (response.status == 201) {
        alert(response.data.message);
        console.log(response.data.testimonial)
        setNewTestimonialObject(response.data.testimonial);
        setComment("")
      }
    } catch (err) {
      setError("Failed to fetch services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    comment,
    setComment,
    loading,
    error,
    testimony,
    newTestimonialObject,
    setNewTestimonialObject,
  };
};
