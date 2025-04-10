"use client";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { useDropzone } from "react-dropzone";

type FileUploadProps = {
    onImageUpload: (imageUrl: string) => void;
    file: File | null,
    setFile: Dispatch<SetStateAction<File | null>>
};
const FileUpload = ({ onImageUpload, file, setFile }: FileUploadProps) => {
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
                onImageUpload(previewUrl);
    
                let uploadProgress = 0;
                const interval = setInterval(() => {
                    uploadProgress += 10;
                    setProgress(uploadProgress);
                    if (uploadProgress >= 100) clearInterval(interval);
                }, 100);
            }
        },
    });

    const handleRemoveFile = () => {
        setFile(null);
        setPreview(null);
        setProgress(0);
        onImageUpload('/images/avocatImg.png');
    };

    return (
        <div className="w-full max-w-2xl mt-4">
            {file ? (
                <div>
                    <div className="relative border-2 border-dashed border-blue-500 bg-[#2c3e50] 
                        text-white p-4 rounded-lg flex flex-col items-center justify-center">
                        <img 
                            src={preview!} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-md mb-4 cursor-pointer"
                            onClick={open} 
                        />
                    </div>

                    <div className="flex flex-col gap-2 pt-4">
                        <span className="text-white font-semibold text-sm">Uploading</span>
                        <div className="relative">
                            <div className="flex items-center rounded-md bg-transparent border border-white w-full">
                                <input 
                                    type="text" 
                                    value={file.name}
                                    className="px-2 py-2 bg-transparent text-gray-300 w-full"
                                    readOnly
                                />
                                <button onClick={handleRemoveFile} className="absolute right-2">
                                    <Image 
                                        src={"/icons/dashboard/admin/close.svg"}
                                        alt="Upload"
                                        width="14"
                                        height="14"
                                        className="text-white hover:text-secondary"
                                    />
                                </button>
                            </div>
                            {/* Progress Bar */}
                            <div className="absolute bottom-0 w-full bg-gray-700 rounded-full h-1">
                                <div 
                                    className="h-1 border border-[1.5px] rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
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
                        Drag & drop image or <span className="text-blue-400 underline">Browse</span>
                    </p>
                    <p className="text-sm text-gray-300 mt-2">
                        Supported formats: JPEG, PNG
                    </p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
