import { useState, useCallback } from "react";
import axios from "@/lib/utils/axiosClient";
import { useAlert } from "@/contexts/AlertContext";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Category[]>("/user/categories/all");
      setCategories(res.data);
    } catch (e: unknown) {
      setError("Erreur lors du chargement des catégories" + e as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post("/admin/categories/add", { name });
      await fetchCategories();
      showAlert("success", "category ajouté avec succès", name);
    } catch (e: unknown) {
      setError("Erreur lors de l'ajout de la catégorie");
      showAlert("error", "Erreur lors de l'ajout de la catégorie", e as string);
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete("/admin/categories/delete", { data: { id } });
      await fetchCategories();
      showAlert("success", "category supprimé avec succès", id.toString());
    } catch (e: unknown) {
      setError("Erreur lors de la suppression de la catégorie");
      showAlert(
        "error",
        "Erreur de supprimer des categories" + e,
        "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    deleteCategory,
    setError,
  };
}; 