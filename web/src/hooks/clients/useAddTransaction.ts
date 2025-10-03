"use client";

import axiosClient from "@/lib/utils/axiosClient";
import { useState } from "react";

function useAddTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTransaction = async (paymentId: number, amount: number, paymentMethod: 'CIB' | 'EDAHABIYA') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post(`api/payments/${paymentId}/add-transaction`, {
        transaction_amount: amount,
        chargili_transaction_id: `TXN-${paymentId}-${Date.now()}`,
        chargili_status: 'PENDING',
        payment_method: paymentMethod
      });
      
      return response.data;
    } catch (e: unknown) {
      type ApiError = { response?: { data?: { error?: string } } };
      const err = e as ApiError | Error;
      const apiError = (err as ApiError).response?.data?.error;
      const fallback = (err as Error).message;
      setError(apiError || fallback || "Failed to add transaction");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { addTransaction, loading, error };
}

export default useAddTransaction;
