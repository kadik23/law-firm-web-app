import { useEffect, useState } from "react";
import axios from "@/lib/utils/axiosClient";
import { useAlert } from "@/contexts/AlertContext";
import { addDays, format } from "date-fns";

export interface Problem {
  id: number;
  name: string;
  [key: string]: any;
}
export interface AvailableSlotWithBookings {
  id: number;
  day: number;
  startTime: string;
  endTime: string;
  bookedDates: string[];
}

export const useConsultationForm = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [slots, setSlots] = useState<AvailableSlotWithBookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [problemsRes, slotsRes] = await Promise.all([
          axios.get<Problem[]>("/user/problems"),
          axios.get<AvailableSlotWithBookings[]>("/user/available_slots_with_bookings"),
        ]);
        setProblems(problemsRes.data);
        setSlots(slotsRes.data);
      } catch (e: any) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute allowedDates: next 30 days that have at least one free slot
  const getAllowedDates = () => {
    const today = new Date();
    const allowedDates: string[] = [];
    for (let i = 0; i < 30; i++) {
      const d = addDays(today, i);
      const dateStr = format(d, "yyyy-MM-dd");
      const weekday = d.getDay();
      const hasFreeSlot = slots.some(
        slot =>
          slot.day === weekday &&
          !slot.bookedDates.includes(dateStr)
      );
      if (hasFreeSlot) allowedDates.push(dateStr);
    }
    return allowedDates;
  };

  // For a given date, get available times (not booked)
  const getFilteredTimes = (selectedDate: string | undefined) => {
    if (!selectedDate) return [];
    const weekday = new Date(selectedDate).getDay();
    return slots
      .filter(
        slot =>
          slot.day === weekday &&
          !slot.bookedDates.includes(selectedDate)
      )
      .map(slot => ({
        label: `${slot.startTime} - ${slot.endTime}`,
        value: slot.startTime,
      }));
  };

  const submitConsultation = async (data: Record<string, unknown>) => {
    try {
      await axios.post("/user/consultations", data);
      showAlert("success", "Consultation réservée", "Votre demande de consultation a été envoyée.");
    } catch (e: any) {
      showAlert("error", "Erreur", e?.response?.data?.message || "Erreur lors de la réservation");
    }
  };

  return {
    problems,
    slots,
    loading,
    error,
    submitConsultation,
    getAllowedDates,
    getFilteredTimes,
  };
}; 