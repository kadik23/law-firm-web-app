import { useEffect, useState } from "react";
import axios from "@/lib/utils/axiosClient";

export function useConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/user/consultations");
        setConsultations(res.data);
      } catch (e: any) {
        setError("Erreur lors du chargement des consultations");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  return { consultations, loading, error };
}
 