import axios from "@/lib/utils/axiosClient";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useAlert } from "@/contexts/AlertContext";

export const useAvocats = () => {
  const [attorneys, setAttorneys] = useState<
    (avocatEntity & { selected?: boolean } & { User?: User })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const { showAlert } = useAlert();
  const selectedAvocats = attorneys.filter((avocat) => avocat.selected);
  const [totalPages, setTotalPages] = useState<number>(0);
  // const [searchItem, setSearchItem] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const perPage = 6;

  
  useEffect(() => {
    const fetchAttorneys = async () => {
      try {
        const response = await axios.get(`/admin/attorneys?page=${currentPage}&limit=${perPage}`);
        setAttorneys(response.data.attorneys);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
  
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
  }, [currentPage]);

  // const searchAttorneys = async () => {
  //   console.log('Searching for attorneys with term:', searchItem);
  //   setLoading(true);
  //   try {
  //     const response = await axios.get("/admin/attorneys/search", {
  //       params: {
  //         page: 1,
  //         limit: 10,
  //         name: searchItem,
  //       },
  //     });
      
  //     console.log('Search results:', response.data);
  //     setAttorneys(response.data.attorneys);
  //     setTotalAttorneys(response.data.totalAttorneys);
  //     setTotalPages(response.data.totalPages);
  //   } catch (err: unknown) {
  //     console.error('Error searching for attorneys:', err);
  //     if (isAxiosError(err) && err.response?.status === 401) {
  //       console.warn("Attorneys not found");
  //     } else {
  //       console.error("An unexpected error occurred:", err);
  //     }
  //     setAttorneys([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  const deleteAvocats = async () => {
    setLoading(true);
    try {
      const response = await axios.delete("/admin/attorney/delete", {
        data: {
          ids: attorneys
            .filter((avocat) => avocat.selected)
            .map((avocat) => avocat.id),
        },
      });

      if (response.status === 200) {
        setAttorneys((prev) => prev.filter((avocat) => !avocat.selected));
        setSelectAll(false);
        showAlert("success", "Avocats supprimé avec succès", "...");
      } else {
        showAlert("error", "Erreur de supprimer des avocats", response.data);
      }
    } catch (error: unknown) {
      console.error("Error adding lawyer:", error);
      showAlert("error", "Erreur de supprimer des avocats", "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const addAvocat = async (data: LawyerFormData, onSuccess?: () => void) => {
    try {
      setLoading(true);
      const formData = new FormData();
      const formattedDate = new Date().toISOString().split("T")[0];

      formData.append("first_name", data.name);
      formData.append("last_name", data.surname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("linkedin_url", data.linkedin_url);
      formData.append("date_membership", formattedDate);
      formData.append("pays", "Algerie");
      formData.append("age", String(data?.age || 0));
      formData.append("ville", data.ville);
      formData.append("phone_number", data.phone_number);
      formData.append("terms_accepted", "true");
      formData.append("status", data.status || "active");
      formData.append("sex", data.sex);

      if (file) {
        formData.append("picture", file);
      }

      if (data.certificats && data.certificats.length) {
        data.certificats.forEach((cert, index) => {
          formData.append(`certificats[${index}]`, cert);
        });
      }

      const response = await axios.post("/admin/attorney/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
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
          id: response.data.attorney.id,
          name: data.name,
          surname: data.surname,
          email: data.email,
          password: data.password,
          linkedin_url: data.linkedin_url,
          picture: response.data.attorney.attorney.picture || "/images/avocatImg.png",
          status: data.status,
          certificats: data.certificats,
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
              phone_number: data.phone_number,
              pays: data.pays,
              ville: data.ville,
              age: data.age,
              sex: "",
              type: "attorney",
            },
          },
        ]);
        showAlert("success", "Avocat ajouté avec succès", "...");
        setFile(null);
        onSuccess?.();
      } else {
        showAlert("error", "Erreur d'ajout d'avocat", response.data);
      }
    }  catch (error: unknown) {
      if (isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.error || "Une erreur est survenue";
        console.error("Axios error:", backendMessage, error.response?.status);

        showAlert("error", "Erreur d'ajout d'avocat", backendMessage);
      } else if (error instanceof Error) {
        console.error("JS error:", error.message);
        showAlert("error", "Erreur d'ajout d'avocat", error.message);
      } else {
        console.error("Unknown error:", error);
        showAlert("error", "Erreur d'ajout d'avocat", "Une erreur est survenue");
      }
    } finally{
      setLoading(false)
    }
  };

  return {
    attorneys,
    loading,
    selectAll,
    selectedAvocats,
    toggleSelect,
    toggleSelectAll,
    deleteAvocats,
    addAvocat,
    file,
    setFile,
    totalPages,
    // searchItem,
    // setSearchItem,
    // searchAttorneys,
    currentPage,
    perPage,
    setCurrentPage,
  };
};
