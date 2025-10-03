"use client";

import axiosClient from "@/lib/utils/axiosClient";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../useAuth";

function usePayments(client_id?: number | undefined) {
  const [payments, setPayments] = useState<PaymentEntity[]>([]);
  const [filteredPaiments, setFilteredPaiments] = useState<PaymentEntity[]>([]);
  const [loading, setLoading] = useState(false)
  const [filterValues, setFilterValues] = useState({
    total_amount: "",
    paid_amount: "",
    remainingAmount: "",
    created_at: "",
    service: "",
    payment_status: "",
  });
  const {user} = useAuth();
  const [count, setCount] = useState(0)

  const [activeFilters, setActiveFilters] = useState<{
    total_amount: boolean;
    paid_amount: boolean;
    remainingAmount: boolean;
    created_at: boolean;
    service: boolean;
    payment_status: boolean;
  }>({
    total_amount: false,
    paid_amount: false,
    remainingAmount: false,
    created_at: false,
    service: false,
    payment_status: false,
  });

  useEffect(() => {
    const fetchPayment = async() => {
      try{
        setLoading(true)
        const response = await axiosClient.get(  `api/payments/client${user?.type === 'admin' ? `?client_id=${client_id}` : ''}`);
        if(response.status == 200){
          setPayments(response.data.payments)
          setFilteredPaiments(response.data.payments)
        }
      }catch(e){
        console.log(e)
      }finally{
        setLoading(false)
      }
    }
    fetchPayment()
  }, []);

  const applyAllFilters = useCallback(() => {
    let result = [...payments];

    if (activeFilters.total_amount && filterValues.total_amount) {
      result = result.filter((paiment) =>
        String(paiment.total_amount).includes(filterValues.total_amount)
      );
    }

    if (activeFilters.paid_amount && filterValues.paid_amount) {
      result = result.filter((paiment) =>
        String(paiment.paid_amount).includes(filterValues.paid_amount)
      );
    }

    if (activeFilters.remainingAmount && filterValues.remainingAmount) {
      result = result.filter((paiment) => {
        const remaining = paiment.total_amount - paiment.paid_amount;
        return String(remaining).includes(filterValues.remainingAmount);
      });
    }

    if (activeFilters.created_at && filterValues.created_at) {
      result = result.filter((paiment) =>
        String(paiment.created_at).includes(filterValues.created_at)
      );
    }

    if (activeFilters.service && filterValues.service) {
      result = result.filter(
        (paiment) => paiment.service?.name === filterValues.service
      );
    }

    if (activeFilters.payment_status && filterValues.payment_status) {
      result = result.filter(
        (paiment) => paiment.payment_status === filterValues.payment_status
      );
    }

    setFilteredPaiments(result);
  }, [payments, activeFilters, filterValues]);

  useEffect(() => {
    applyAllFilters();
  }, [applyAllFilters]);

  const getCount = async () => {
    const response = await axiosClient.get("api/payments/count");
    if (response.status === 200) {
      setCount(response.data.count);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof typeof filterValues
  ) => {
    const value = e.target.value.trim();

    setFilterValues({
      ...filterValues,
      [field]: value,
    });

    setActiveFilters({
      ...activeFilters,
      [field]: value !== "",
    });
  };

  return {
    filteredPaiments,
    payments,
    filterValues,
    activeFilters,
    setFilterValues,
    setActiveFilters,
    handleFilterChange,
    loading,
    getCount,
    count
  };
}

export default usePayments;
