"use client";
import Image from "next/image";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

type FileUploadProps = {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  previewSrc?: string;
};

const FileUpload = ({ file, setFile, previewSrc }: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        const previewUrl = URL.createObjectURL(uploadedFile);
        setPreview(previewUrl);

        let uploadProgress = 0;
        const interval = setInterval(() => {
          uploadProgress += 10;
          setProgress(uploadProgress);
          if (uploadProgress >= 100) clearInterval(interval);
        }, 100);
      }
    },
  });

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (previewSrc) {
      setPreview(previewSrc);
    } else {
      setPreview(null);
    }
  }, [file, previewSrc]);

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-2xl mt-4">
      {preview ? (
        <div className="w-96">
          <div className="relative border-2 border-dashed border-blue-500 bg-[#2c3e50] 
            text-white p-4 rounded-lg flex flex-col items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md mb-4 cursor-pointer"
              onClick={open}
            />
          </div>

          {(file || previewSrc) && (
            <div className="flex flex-col gap-2 pt-4">
                <span className="text-white font-semibold text-sm">Uploading</span>
                <div className="relative">
                <div className="flex items-center rounded-md bg-transparent border border-white w-full">
                    <input
                    type="text"
                    value={file ? file.name : "existing-image.jpg"} // 👈 fallback for edit mode
                    className="px-2 py-2 bg-transparent text-gray-300 w-full"
                    readOnly
                    />
                    <button
                    onClick={handleRemoveFile}
                    className="absolute right-2 bg-[#2c3e50] pl-2"
                    >
                    <Image
                        src={"/icons/dashboard/admin/close.svg"}
                        alt="Upload"
                        width="14"
                        height="14"
                        className="text-white hover:text-secondary"
                    />
                    </button>
                </div>
                <div className="absolute bottom-0 w-full bg-gray-700 rounded-full h-1">
                    <div
                    className="h-1 border border-[1.5px] rounded-full transition-all duration-300"
                    style={{ width: `${file ? progress : 100}%` }}
                    />
                </div>
                </div>
            </div>
            )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="w-full border-2 border-dashed border-blue-500 bg-[#2c3e50] 
          text-white p-8 rounded-lg flex flex-col items-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <Image
            src={"/icons/dashboard/admin/Upload.svg"}
            alt="Upload"
            width="68"
            height="68"
            className="mb-4"
          />
          <p className="text-lg font-semibold">
            Glissez-déposez l{"'"}image or{" "}
            <span className="text-blue-400 underline">Parcourez</span>
          </p>
          <p className="text-sm text-gray-300 mt-2">
            Formats pris en charge: JPEG, PNG
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;