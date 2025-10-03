"use client";

import axiosClient from "@/lib/utils/axiosClient";
import { useState } from "react";

type CreatePayload = {
  request_service_id: number;
  payment_method: "CIB" | "EDAHABIYA" | "FREE_CONSULTATION";
  payment_type: "FULL" | "PARTIAL";
  amount: number;
};

function useCreatePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (payload: CreatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post("api/payments/create", payload);
      return response.data as CreatePaymentResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Payment failed");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { createPayment, loading, error };
}

export default useCreatePayment;


