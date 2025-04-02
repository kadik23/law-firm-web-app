import { isAxiosError } from "axios";
import axios from "@/lib/utils/axiosClient";
import { useState } from "react";
import { useAlert } from "@/contexts/AlertContext";

function useReqFiles() {
  const [files, setFiles] = useState<ReqFilesEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<
    { file: File; name: string }[]
  >([]);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const { showAlert } = useAlert();

  const fetchFiles = async (request_service_id: number) => {
    setLoading(true);
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

  const handleDownload = (fileName: string, fileData: string | File) => {
    if (typeof fileData === 'string') {
      const mimeType = fileName.endsWith('.pdf') ? 'application/pdf' :
                       fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? 'image/jpeg' :
                       fileName.endsWith('.png') ? 'image/png' :
                       'application/octet-stream';
      
      const link = document.createElement('a');
      link.href = `data:${mimeType};base64,${fileData}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } 
    else if (fileData instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const link = document.createElement('a');
        link.href = e.target?.result as string;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      reader.readAsDataURL(fileData);
    }
  };

  const validateFiles = (requiredFiles: number) => {
    if (!requiredFiles) {
      showAlert("success", "s'il te plaît", "Veuillez télécharger tous les fichiers requis");
      return false;
    }

    if (uploadedFiles.length === requiredFiles) {
      return true;
    }
    showAlert("success", "s'il te plaît", "Veuillez télécharger tous les fichiers requis"); 
  };

  const saveFiles = async (request_service_id: number) => {
    setSaveLoading(true);
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
        showAlert("success", "Souvegarder des changements avec succès", "...");
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
      setSaveLoading(false);
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
  };
}

export default useReqFiles;
