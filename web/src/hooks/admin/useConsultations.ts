import { useState, useEffect } from "react";
import axios from "@/lib/utils/axiosClient";

export interface Consultation {
  id: number;
  client_id: number;
  problem_id: number;
  problem_name?: string;
  problem_description: string;
  date: string;
  time: string;
  status: string;
  mode: string;
  meeting_link?: string;
  createdAt: string;
  updatedAt: string;
  problem?: { id: number; name: string };
  client?: {
    id: number;
    name: string;
    surname: string;
    phone_number?: string;
  };
}

export function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/admin/consultations");
      setConsultations(res.data);
    } catch (e: any) {
      setError("Erreur lors du chargement des consultations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const updateConsultation = async (id: number, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(`/admin/consultations/${id}`, { status });
      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...res.data } : c))
      );
      return res.data;
    } catch (e: any) {
      setError("Erreur lors de la mise à jour de la consultation");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { consultations, loading, error, fetchConsultations, updateConsultation };
}
