import { useState, useCallback, useEffect } from "react";
import axios from "@/lib/utils/axiosClient";

export function useAvailableSlots() {
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/admin/available_slots");
      setSlots(res.data);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError(
          (err as { message?: string }).message || "Error fetching slots"
        );
      } else {
        setError("Error fetching slots");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const addSlot = useCallback(
    async (slot: Omit<AvailableSlot, "id">) => {
      setLoading(true);
      setError(null);
      try {
        await axios.post("/admin/available_slots", slot);
        await fetchSlots();
      } catch (err: unknown) {
        if (err && typeof err === "object" && "message" in err) {
          setError(
            (err as { message?: string }).message || "Error adding slots"
          );
        } else {
          setError("Error adding slots");
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchSlots]
  );

  const removeSlot = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        await axios.delete(`/admin/available_slots/${id}`);
        await fetchSlots();
      } catch (err: unknown) {
        if (err && typeof err === "object" && "message" in err) {
          setError(
            (err as { message?: string }).message || "Error removing slots"
          );
        } else {
          setError("Error removing slots");
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchSlots]
  );

  return { slots, loading, error, addSlot, removeSlot };
}
