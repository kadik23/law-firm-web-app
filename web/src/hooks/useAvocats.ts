import axios from "@/lib/utils/axiosClient";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useAlert } from "@/contexts/AlertContext";
import { error } from "console";

export const useAvocats = () => {
  const [attorneys, setAttorneys] = useState<
    (avocatEntity & { selected?: boolean } & { User?: User })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState<
    Omit<
      avocatEntity & User,
      | "id"
      | "selected"
      | "pays"
      | "ville"
      | "age"
      | "sex"
      | "type"
      | "feedback"
      | "createdAt"
      | "serviceId"
      | "user"
      | "user_id"
      | "phone_number"
      | "date_membership"
      | "picture_path"
    >
  >({
    name: "",
    surname: "",
    password: "",
    email: "",
    linkedin_url: "",
    picture: "/images/avocatImg.png",
    status: "",
    certificats: [],
    updatedAt: new Date().toISOString(),
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const selectedAvocats = attorneys.filter((avocat) => avocat.selected);

  useEffect(() => {
    const fetchAttorneys = async () => {
      try {
        const response = await axios.get("/admin/attorneys");
        setAttorneys(response.data.attorneys);
      } catch (err: unknown) {
        if (isAxiosError(err) && err.response?.status === 401) {
          console.warn("Attorneys not found");
        } else {
          console.error("An unexpected error occurred:", err);
        }
        setAttorneys([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttorneys();
  }, []);

  const toggleSelect = (id: number) => {
    setAttorneys((prev) =>
      prev.map((avocat) =>
        (avocat.id as number) === id
          ? { ...avocat, selected: !avocat.selected }
          : avocat
      )
    );
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setAttorneys((prev) =>
      prev.map((avocat) => ({ ...avocat, selected: newSelectAll }))
    );
  };

  const deleteAvocats = () => {
    setAttorneys((prev) => prev.filter((avocat) => !avocat.selected));
    setSelectAll(false);
  };

  const addAvocat = async (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    try {
      const data = new FormData();
      const formattedDate = new Date().toISOString().split("T")[0];
      data.append("first_name", formData.name);
      data.append("last_name", formData.surname);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("linkedin_url", formData.linkedin_url);
      data.append("date_membership", formattedDate);
      data.append("pays", "Algerie");
      data.append("terms_accepted", "true");
      data.append("status", formData.status || "active");
      if (file) {
        data.append("picture", file || "/images/avocatImg.png");
      }

      if (formData.certificats && formData.certificats.length) {
        formData.certificats.forEach((cert, index) => {
          data.append(`certificats[${index}]`, cert);
        });
      }

      const response = await axios.post("/admin/attorney/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status == 201) {
        const newAvocat: Omit<
          avocatEntity & User & { selected?: boolean },
          | "pays"
          | "ville"
          | "age"
          | "sex"
          | "type"
          | "feedback"
          | "serviceId"
          | "User"
          | "phone_number"
        > = {
          id:
            attorneys.length > 0
              ? Math.max(...attorneys.map((a) => a.id as number)) + 1
              : 1,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          linkedin_url: formData.linkedin_url,
          picture: uploadedImage || "/images/avocatImg.png",
          status: formData.status,
          certificats: formData.certificats,
          updatedAt: new Date().toISOString(),
          user_id: "",
          date_membership: new Date().toISOString(),
          picture_path: "",
          createdAt: new Date().toISOString(),
          selected: false,
        };

        setAttorneys((prev) => [
          ...prev,
          {
            ...newAvocat,
            User: {
              id: 1,
              password: newAvocat.password,
              email: newAvocat.email,
              name: newAvocat.name,
              surname: newAvocat.surname,
              type: "attorney",
            },
          },
        ]);
        showAlert("success", "Avocat ajouté avec succès", "...");
      }
      else{
        showAlert("error", "Erreur d'ajout d'avocat", response.data);
      }
    } catch (error: unknown) {
      console.error("Error adding avocat:", error);
        if (isAxiosError(error) && error.response?.status === 401) {
            showAlert("error", "Erreur d'ajout d'avocat", error.message);
        } else {
            showAlert("error", "Erreur inattendue", error as string);
        }
      return;
    } finally {
      setLoading(false);
      resetForm();
      onSuccess?.();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      surname: "",
      password: "",
      email: "",
      linkedin_url: "",
      picture: "/images/avocatImg.png",
      status: "",
      certificats: [],
      updatedAt: new Date().toISOString(),
    });
    setUploadedImage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  return {
    attorneys,
    loading,
    selectAll,
    formData,
    selectedAvocats,
    toggleSelect,
    toggleSelectAll,
    deleteAvocats,
    addAvocat,
    handleInputChange,
    handleImageUpload,
    resetForm,
    file,
    setFile,
  };
};
