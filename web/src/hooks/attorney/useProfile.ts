"use client";
import axiosClient from "@/lib/utils/axiosClient";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<avocatEntity | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const uploadProfileImage = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("coverImage", file);

      const { data } = await axiosClient.put(
        "/attorney/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImage(data.base64Image);
      return data.base64Image;
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || "Upload failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Upload failed");
      }
      return null;
    } finally {
      setUploading(false);
    }
  };

  const getProfile = async () => {
    setLoadingProfile(true);
    setError(null);

    try {
      const { data } = await axiosClient.get("/attorney/profile");
      setProfile(data);
      if (data?.profileImage) {
        setImage(data.profileImage);
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.message || err.message || "Failed to load profile"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load profile");
      }
      return null;
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return {
    uploading,
    error,
    image,
    uploadProfileImage,
    loadingProfile,
    profile,
  };
};
