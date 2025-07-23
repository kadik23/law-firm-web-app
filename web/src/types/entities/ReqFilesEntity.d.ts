interface ReqFilesEntity {
  id: number;
  request_service_id: number;
  file_name: string;
  base64: string;
  status: FileStatus;
  rejectionReason?: string;
}

interface FileEntity {
  file: File;
  name: string;
}

type FileStatus = "Accepted" | "Refused" | "Pending";
