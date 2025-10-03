import { isAxiosError } from "axios";
import axios from "@/lib/utils/axiosClient";
import { useState } from "react";
import { useAlert } from "@/contexts/AlertContext";

function useReqFiles() {
  const [files, setFiles] = useState<ReqFilesEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteAll, setIsDeleteAll] = useState<boolean>(false);
  const [isDeleteByOne, setIsDeleteByOne] = useState<boolean>(false);
  const [isUploadingState, setIsUploadingState] = useState<boolean>(false);
  const [deletedFiles, setDeletedFiles] = useState<number[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileEntity[]>([]);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const { showAlert } = useAlert();

  const fetchFiles = async (request_service_id: number) => {
    setLoading(true);
    if (files.length > 0) {
      setFiles([]);
    }
    if (uploadedFiles.length > 0) {
      setUploadedFiles([]);
    }
    try {
      const response = await axios.get(
        `/user/service-files/${request_service_id}`
      );
      if (response.status === 200) {
        setFiles(response.data.files);
      } else if (response.status === 404) {
        setFiles([]);
      }
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        console.warn("Blog not found");
      } else {
        console.error("An unexpected error occurred:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setUploadedFiles([]);
    setFiles([]);
    setIsDeleteAll(true);
    if (setIsDeleteByOne) {
      setIsDeleteByOne(false);
    }
  };

  const handleDeleteByOne = async (fileId: number | FileEntity) => {
    setUploadedFiles((prev) => [
      ...prev.filter((file) => file !== (fileId as FileEntity)),
    ]);
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
    setDeletedFiles((prev) => [...prev, fileId as number]);
    setIsDeleteByOne(true);
    setIsUploadingState(false)
  };

  const handleDownload = (fileName: string, fileData: string | File) => {
    if (typeof fileData === "string") {
      // If backend sent "data:...;base64,xxx", strip metadata
      const base64 = fileData.includes("base64,")
        ? fileData.split("base64,")[1]
        : fileData;

      // Convert base64 → binary
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Detect mime type
      const mimeType = fileName.endsWith(".pdf")
        ? "application/pdf"
        : fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")
        ? "image/jpeg"
        : fileName.endsWith(".png")
        ? "image/png"
        : "application/octet-stream";

      // Create blob + object URL
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke
      URL.revokeObjectURL(url);
    } else if (fileData instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      reader.readAsDataURL(fileData);
    }
  };

  const validateFiles = (requiredFiles: number): boolean => {
    if (isDeleteAll) {
      return true;
    }

    if (!requiredFiles || requiredFiles <= 0) {
      showAlert(
        "error",
        "Erreur",
        "Veuillez spécifier un nombre valide de fichiers requis."
      );
      return false;
    }

    if (uploadedFiles.length + files.length === requiredFiles) {
      return true;
    }

    showAlert(
      "error",
      "Fichiers manquants",
      `Veuillez télécharger tous les fichiers requis (${requiredFiles} attendus, ${uploadedFiles.length} fournis).`
    );
    return false;
  };
  const saveFiles = async (request_service_id: number, filesNumber: number) => {
    setSaveLoading(true);
    if (isDeleteByOne && !isUploadingState) {
      try {
        for (const fileId of deletedFiles) {
          const formData = new FormData();
          formData.append("file", uploadedFiles[0].file, uploadedFiles[0].name);
          const response = await axios.put(
            `/user/service-files/${fileId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.status === 200) {
            showAlert(
              "success",
              "Souvegarder des changements avec succès",
              `Fichiers ${deletedFiles.length} supprimés pour l'ID de demandé  service ${request_service_id}`
            );
            setUploadedFiles((prev) => prev.filter((_, index) => index !== 0));
          }
        }

        setDeletedFiles([]);
        setIsDeleteByOne(false);
        fetchFiles(request_service_id);
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 401) {
          console.warn("Files not found");
        } else {
          console.error("An unexpected error occurred:", err);
        }
        showAlert("error", "Souvegarder des changements avec error", "...");
      } finally {
        setSaveLoading(false);
      }
    } else if (isDeleteAll) {
      try {
        const response = await axios.delete(
          `/user/service-files/${request_service_id}`
        );
        if (response.status === 200) {
          if (uploadedFiles.length > 0) {
            const formData = new FormData();
            uploadedFiles.forEach((uploadedFile) => {
              formData.append("files", uploadedFile.file, uploadedFile.name);
            });
            const response = await axios.post(
              `/user/service-files/${request_service_id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            if (response.status === 201) {
              showAlert(
                "success",
                "Souvegarder des changements avec succès",
                `Fichiers ${filesNumber} supprimés pour l'ID de demandé  service ${request_service_id} et ${uploadedFiles.length} fichiers téléchargés`
              );
            }
          } else {
            showAlert(
              "success",
              "Souvegarder des changements avec succès",
              `Fichiers ${filesNumber} supprimés pour l'ID de demandé  service ${request_service_id}`
            );
          }
          fetchFiles(request_service_id);
          setIsDeleteAll(false);
        }
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 401) {
          console.warn("Files not found");
        } else {
          console.error("An unexpected error occurred:", err);
        }
        showAlert("error", "Souvegarder des changements avec error", "...");
      } finally {
        setSaveLoading(false);
      }
    } else if (deletedFiles.length === 0 ) {
      try {
        const formData = new FormData();

        uploadedFiles.forEach((uploadedFile) => {
          formData.append("files", uploadedFile.file, uploadedFile.name);
        });
        const response = await axios.post(
          `/user/service-files/${request_service_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 201) {
          showAlert(
            "success",
            "Souvegarder des changements avec succès",
            "..."
          );
          fetchFiles(request_service_id);
        } else if (response.status === 404) {
          setFiles([]);
        }
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 401) {
          console.warn("Files not found");
        } else {
          console.error("An unexpected error occurred:", err);
        }
      } finally {
        setSaveLoading(false);
      }
    }
  };

  return {
    fetchFiles,
    files,
    loading,
    handleDownload,
    uploadedFiles,
    setUploadedFiles,
    validateFiles,
    saveFiles,
    saveLoading,
    handleDelete,
    handleDeleteByOne,
    setIsDeleteByOne,
    setIsDeleteAll,
    setIsUploadingState,
    isUploadingState,
    setFiles
  };
}

export default useReqFiles;
