import { useEffect, useState } from "react";
import axios from "@/lib/utils/axiosClient";
import { isAxiosError } from "axios";
import { useAlert } from "@/contexts/AlertContext";

export const useFilesProccessing = () => {
  const [loading, setLoading] = useState(true);
  const [assignedServices, setAssignedServices] = useState<
    AssignedServicesEntity[] | []
  >([]);
  const [clients, setClients] = useState<User[] | []>([]);
  const [pendingFolderStatus, setPendingFolderStatus] = useState<string | null>(
    null
  );
  const [rejectingFileId, setRejectingFileId] = useState<number | null>(null);
  const { showAlert } = useAlert();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/assigned_services`);
      setAssignedServices(response.data);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        console.warn("Assigned Services not found");
      } else {
        console.error("An unexpected error occurred:", err);
      }
      setAssignedServices([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFileStatus = async (
    fileId: number,
    status: string,
    rejection_reason?: string
  ) => {
    try {
      setLoading(true);

      await axios.put(`/admin/assigned_services/file_status/${fileId}`, {
        status,
        rejection_reason,
      });
      showAlert("success", "Succès", "Statut du fichier mis à jour.");
    } catch {
      showAlert(
        "error",
        "Erreur",
        "Impossible de mettre à jour le statut du fichier."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/assigned_services/clients`);
      setClients(response.data);
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        console.warn("Users not found");
      } else {
        console.error("An unexpected error occurred:", err);
      }
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFolderStatus = async (
    requestServiceId: number,
    status: string
  ) => {
    try {
      setLoading(true);
      await axios.put(
        `/admin/assigned_services/folder_status/${requestServiceId}`,
        { status }
      );
      showAlert("success", "Succès", "Statut du dossier mis à jour.");
    } catch {
      showAlert(
        "error",
        "Erreur",
        "Impossible de mettre à jour le statut du dossier."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);
  return {
    loading,
    pendingFolderStatus,
    setPendingFolderStatus,
    rejectingFileId,
    setRejectingFileId,
    assignedServices,
    showAlert,
    updateFileStatus,
    updateFolderStatus,
    clients,
    fetchClients,
  };
};
