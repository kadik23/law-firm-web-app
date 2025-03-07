import { useAlert } from "@/contexts/AlertContext";
import axios from "@/lib/utils/axiosClient";
import { useState } from "react";

export const useTestimony = () => {
  const [comment, setComment] = useState("");
  const [newTestimonialObject, setNewTestimonialObject] =
    useState<null | avisEntity>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const testimony = async (serviceId: number) => {
    try {
      setLoading(true);
      const response = await axios.post("/user/testimonials", {
        feedback: comment,
        serviceId,
      });
      if (response.status == 201) {
        showAlert(
          "success",
          "Commenter réussie",
          response.data.message
        );
        console.log(response.data.testimonial)
        setNewTestimonialObject(response.data.testimonial);
        setComment("")
      }
    } catch (err) {
      setError("Vous n'avez pas commenté");
      showAlert(
        "error",
        "vous n'avez pas commenté",
        err as string
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateMyTestimonial = async (testimonial_id: number) => {
    try {
      setLoading(true);
      const response = await axios.put(`/user/testimonials/${testimonial_id}`, {
        feedback: comment,
      });
      if (response.status == 201) {
        showAlert(
          "success",
          "Commentaire mis à jour avec succès",
          response.data.message
        );
        console.log(response.data.testimonial)
        setNewTestimonialObject(response.data.testimonial);
        setComment("")
      }
    } catch (err) {
      setError("Vous n'avez pas mise a jour");
      showAlert(
        "error",
        "vous n'avez pas ",
        err as string
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMyTestimonial = async (testimonial_id: number) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/user/testimonials/${testimonial_id}`);
      if (response.status == 200) {
        showAlert(
          "success",
          "Commente supprimé avec succès",
          response.data.message
        );
        console.log(response.data.testimonial)
      }
    } catch (err) {
      setError("Vous n'avez pas supprimer commentaire");
      showAlert(
        "error",
        "vous n'avez pas ",
        err as string
      );
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
    updateMyTestimonial,
    deleteMyTestimonial
  };
};
