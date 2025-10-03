import axios from "@/lib/utils/axiosClient";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useAlert } from "@/contexts/AlertContext";
import { arraysEqual } from "@/lib/utils/arrayEqual";

export const useServicesM = (setService: Dispatch<SetStateAction<serviceEntity | null>> | null) => {
  const [services, setServices] = useState<
    (serviceEntity & { selected?: boolean })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const { showAlert } = useAlert();
  const selectedServices = services.filter((service) => service.selected);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 6;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`/admin/services?page=${currentPage}&limit=${perPage}`);
        setServices(response.data.services);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
  
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 401) {
          console.warn("Services not found");
        } else {
          console.error("An unexpected error occurred:", err);
        }
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [currentPage]);

  const toggleSelect = (id: number) => {
    setServices((prev) =>
      prev.map((service) =>
        (service.id as number) === id
          ? { ...service, selected: !service.selected }
          : service
      )
    );
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setServices((prev) =>
      prev.map((service) => ({ ...service, selected: newSelectAll }))
    );
  };

  const deleteServices = async () => {
    setLoading(true);
    try {
      const response = await axios.delete("/admin/services/delete", {
        data: {
          ids: services
            .filter((service) => service.selected)
            .map((service) => service.id),
        },
      });

      if (response.status === 200) {
        setServices((prev) => prev.filter((service) => !service.selected));
        setSelectAll(false);
        showAlert("success", "Service supprimé avec succès", "...");
      } else {
        showAlert("error", "Erreur de supprimer des service", response.data);
      }
    } catch (error: unknown) {
      console.error("Error adding service:", error);
      showAlert("error", "Erreur de supprimer des services", "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const addService = async (data: ServiceFormData, onSuccess?: () => void) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price?.toString() || "");
      
      if (data.requestedFiles) {
        data.requestedFiles.forEach((fileName, index) => {
          formData.append(`requestedFiles[${index}]`, fileName);
        });
      }

      if (file) {
        formData.append("coverImage", file);
      }

      const response = await axios.post("/admin/services/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        const newService: Omit<
          serviceEntity & { selected?: boolean },
          | "createdAt"
          | "updatedAt"
        > = {
          id: response.data.service.id,
          name: data.name,
          description: data.description,
          price: data.price,
          requestedFiles: data.requestedFiles,
          coverImage: response.data.service.coverImage || "/images/serviceImg.png",
          selected: false,
        };

        setServices((prev) => [
          ...prev,
          {
            ...newService,
          },
        ]);
        showAlert("success", "Service ajouté avec succès", "...");
        setFile(null);
        onSuccess?.();
      } else {
        showAlert("error", "Erreur d'ajout de service", response.data);
      }
    } catch (error: unknown) {
      console.error("Error adding lawyer:", error);
      showAlert("error", "Erreur d'ajout de service", "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (
    serviceId: number,
    data: ServiceFormData,
    oldServiceData: serviceEntity,
    onSuccess?: () => void,
  ) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("id", serviceId.toString());

      // Only append fields that have changed
      if (oldServiceData.name !== data.name)
        formData.append("name", data.name);
      if (oldServiceData.description !== data.description) 
        formData.append("description", data.description);
      if (data.price && oldServiceData.price !== data.price)
        formData.append("price", data.price.toString());

      if (data.requestedFiles && !arraysEqual(oldServiceData.requestedFiles, data.requestedFiles)) {
        data.requestedFiles.forEach((fileName, index) => {
          formData.append(`requestedFiles[${index}]`, fileName);
        });
      }

      if (file) {
        formData.append("coverImage", file);
      }

      const response = await axios.put("/admin/services/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
      setServices(prev =>
          prev.map(s =>
            s.id === serviceId
              ? {
                  ...s,
                  name: data.name,
                  description: data.description,
                  price: data.price,
                  requestedFiles: data.requestedFiles,
                  coverImage: file ? URL.createObjectURL(file) : s.coverImage,
                }
              : s
          )
        )
        if( setService ){
          setService(prev => prev && ({
            ...prev!,
            name: data.name,
            description: data.description,
            price: data.price,
            requestedFiles: data.requestedFiles,
            coverImage: file ? URL.createObjectURL(file) : prev.coverImage,
          }));
        }

        showAlert("success", "Service mis à jour avec succès", "...");
        setFile(null);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        showAlert("error", "Erreur de mise à jour du service", response.data);
      }
    } catch (error: unknown) {
      console.error("Error updating service:", error);
      if (isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        showAlert(
          "error",
          "Erreur de mise à jour du service",
          "Une erreur est survenue"
        );
        console.log(error.response?.data?.message)
      } else {
        showAlert(
          "error",
          "Erreur de mise à jour du service",
          "Une erreur est survenue"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    loading,
    selectAll,
    selectedServices,
    toggleSelect,
    toggleSelectAll,
    deleteServices,
    addService,
    file,
    setFile,
    totalPages,
    currentPage,
    perPage,
    setCurrentPage,
    updateService
  };
};