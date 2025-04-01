import { isAxiosError } from "axios";
import axios from "@/lib/utils/axiosClient";
import { useState } from "react";

function useReqFiles() {
  const [files, setFiles] = useState<ReqFilesEntity[] >([]);
  const [loading, setLoading] = useState(true);
  const fetchFiles = async (request_service_id: number) => {
    try {
      const response = await axios.get(`/user/service-files/${request_service_id}`);
      if (response.status === 200) {
        setFiles(response.data.files);
      }else if (response.status === 404) {
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

  const handleDownload = (fileName: string, base64Data: string) => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${base64Data}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { fetchFiles, files, loading, handleDownload };
}

export default useReqFiles;
