import { useState } from "react";
import axios from "@/lib/utils/axiosClient";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/contexts/AlertContext";
import { isAxiosError } from "axios";

export const useAdminAccount = () => {
  const { user, fetchUser } = useAuth();
  const { showAlert } = useAlert();
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);

  const updatePersonalInfo = async (data: {
    name: string;
    surname: string;
    email: string;
    phone_number?: string;
    pays?: string;
    ville?: string;
    age?: number | string;
    sex?: string;
  }) => {
    setLoadingInfo(true);
    setErrorInfo(null);
    try {
      await axios.put("/user/update", data);
      showAlert(
        "success",
        "Informations mises à jour",
        "Vos informations personnelles ont été mises à jour."
      );
      await fetchUser();
    } catch (e) {
      if (isAxiosError(e)) {
        setErrorInfo(
          e?.response?.data?.message ||
            "Erreur lors de la mise à jour des informations"
        );
        showAlert(
          "error",
          "Erreur",
          e?.response?.data?.message ||
            "Erreur lors de la mise à jour des informations"
        );
      } else {
        console.log(e);
      }
    } finally {
      setLoadingInfo(false);
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    setLoadingPassword(true);
    setErrorPassword(null);
    try {
      await axios.put("/user/update-password", { oldPassword, newPassword });
      showAlert(
        "success",
        "Mot de passe modifié",
        "Votre mot de passe a été modifié avec succès."
      );
    } catch (e) {
      if (isAxiosError(e)) {
        setErrorPassword(
          e?.response?.data?.message ||
            "Erreur lors de la modification du mot de passe"
        );
        showAlert(
          "error",
          "Erreur",
          e?.response?.data?.message ||
            "Erreur lors de la modification du mot de passe"
        );
      } else {
        console.log(e);
      }
    } finally {
      setLoadingPassword(false);
    }
  };

  return {
    user,
    updatePersonalInfo,
    updatePassword,
    loadingInfo,
    loadingPassword,
    errorInfo,
    errorPassword,
  };
};