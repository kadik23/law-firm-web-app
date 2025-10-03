"use client";

import axiosClient from "@/lib/utils/axiosClient";
import { useState } from "react";

function usePartialPayments() {
  const [partialPayments, setPartialPayments] = useState<PaymentEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPartialPayments = async (paymentId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`api/payments/partial/${paymentId}`);
      if (response.status === 200) {
        setPartialPayments([response.data.payment]);
      }
    } catch (e: unknown) {
      type ApiError = { response?: { data?: { error?: string } } };
      const err = e as ApiError | Error;
      const apiError = (err as ApiError).response?.data?.error;
      const fallback = (err as Error).message;
      setError(apiError || fallback || "Failed to fetch payment details");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPartialPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`api/payments/partial`);
      if (response.status === 200) {
        setPartialPayments(response.data.payments);
      }
    } catch (e: unknown) {
      type ApiError = { response?: { data?: { error?: string } } };
      const err = e as ApiError | Error;
      const apiError = (err as ApiError).response?.data?.error;
      const fallback = (err as Error).message;
      setError(apiError || fallback || "Failed to fetch payments details");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return {
    partialPayments,
    loading,
    error,
    fetchPartialPayments,
    fetchAllPartialPayments
  };
}

export default usePartialPayments;
