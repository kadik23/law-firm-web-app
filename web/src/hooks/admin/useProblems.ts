import { useEffect, useState, useCallback } from "react";
import axios from "@/lib/utils/axiosClient";
import { useAlert } from "@/contexts/AlertContext";

export const useProblems = () => {
  const [problems, setProblems] = useState<problemEntity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<serviceEntity[]>([]);
  const [newProblem, setNewProblem] = useState({ name: "", category_id: 0, service_id: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<problemEntity[]>("/user/problems");
      setProblems(res.data);
    } catch (e: unknown) {
      setError("Erreur lors du chargement des problèmes" + e as string);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get<Category[]>("/user/categories/all");
      setCategories(res.data);
    } catch {}
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await axios.get<{ services: serviceEntity[] }>("/admin/services");
      setServices(res.data.services);
    } catch {}
  }, []);

  useEffect(() => {
    fetchProblems();
    fetchCategories();
    fetchServices();
  }, [fetchProblems, fetchCategories, fetchServices]);

  const addProblem = useCallback(async () => {
    if (!newProblem.name.trim() || !newProblem.category_id || !newProblem.service_id) return;
    setLoading(true);
    setError(null);
    try {
      await axios.post("/admin/problems", newProblem);
      setNewProblem({ name: "", category_id: 0, service_id: 0 });
      fetchProblems();
      showAlert("success", "probleme ajouté avec succès", newProblem.name);
    } catch (e: unknown) {
      setError("Erreur lors de l'ajout du problème");
      showAlert("error", "Erreur lors de l'ajout de le probleme", e as string);
    } finally {
      setLoading(false);
    }
  }, [newProblem, fetchProblems]);

  const deleteProblem = useCallback(async (id?: number) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/admin/problems/${id}`);
      fetchProblems();
      showAlert("success", "probleme supprimé avec succès", id.toString());
    } catch (e: unknown) {
      setError("Erreur lors de la suppression du problème");
      showAlert(
        "error",
        "Erreur de supprimer des problemes" + e,
        "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  }, [fetchProblems]);

  return {
    problems,
    categories,
    services,
    newProblem,
    setNewProblem,
    loading,
    error,
    addProblem,
    deleteProblem,
  };
}; 