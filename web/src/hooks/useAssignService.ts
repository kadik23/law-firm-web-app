import { isAxiosError } from "axios";
import axios from "@/lib/utils/axiosClient";
import { useState } from "react";
import { useAlert } from "@/contexts/AlertContext";

export const useAssignService = (serviceId?: number) => {
  const [loading, setLoading] = useState(true);
  const [assignServices, setassignServices] = useState<serviceEntity[]>([]);
  const { showAlert } = useAlert();

  const fetchAssignService = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/user/services/assignedServices");
      if (response.status == 200) {
        setassignServices(response.data);
      }
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        console.warn("Services not found");
      } else {
        console.error("An unexpected error occurred:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const assignService = async () => {
    try {
      const response = await axios.post("/user/services/assign_client", {
        serviceId: serviceId,
      });
      if (response.status == 201) {
        showAlert(
          "success",
          "attribuer un service avec succès",
          "Veuillez sélectionner le service que vous avez choisi ici pour terminer le téléchargement des fichiers requis."
        );
      }
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 401) {
        console.warn("Services not found");
      } else {
        console.error("An unexpected error occurred:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, assignService, fetchAssignService, assignServices};
};
