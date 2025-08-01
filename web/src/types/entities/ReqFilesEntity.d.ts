interface ReqFilesEntity {
  id: number;
  request_service_id: number;
  file_name: string;
  base64: string;
  status: FileStatus;
  rejection_reason?: string;
}

interface FileEntity {
  file: File;
  name: string;
  status: FileStatus;
}

type FileStatus = "Accepted" | "Refused" | "Pending";
