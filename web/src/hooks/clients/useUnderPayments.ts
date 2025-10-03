"use client";

import axiosClient from "@/lib/utils/axiosClient";
import { useEffect, useState } from "react";
import { useAuth } from "../useAuth";

function useUnderPayments(client_id?: number | undefined) {
  const [filteredPaiments, setFilteredPaiments] =
    useState<PaymentTransactionEntity[]>([]);
  const [loading, setLoading] = useState(false)
  const [filterValues, setFilterValues] = useState({
    paidAmount: "",
    paymentDate: "",
  });
  const {user} = useAuth();
  const [count, setCount] = useState(0)

  const [activeFilters, setActiveFilters] = useState<{
    paidAmount: boolean;
    paymentDate: boolean;
  }>({
    paidAmount: false,
    paymentDate: false,
  });

  const fetchPayment = async(id: number) => {
    try{
      setLoading(true)
      const response = await axiosClient.get(`api/payments/${id}${user?.type == 'admin' ? `?client_id=${client_id}` : ''}`)
      if(response.status == 200){
        setFilteredPaiments(response.data.payment.transactions)
      }
    }catch(e){
      console.log(e)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    applyAllFilters();
  }, [filterValues, activeFilters]);

  const getCount = async (id: number) => {
    const response = await axiosClient.get(`api/payments/${id}/transactions/count`);
    if (response.status === 200) {
      setCount(response.data.count);
    }
  };

  const applyAllFilters = () => {
    let result = [...filteredPaiments];

    if (activeFilters.paidAmount && filterValues.paidAmount) {
      result = result.filter((paiment) =>
        String(paiment.transaction_amount).includes(filterValues.paidAmount)
      );
    }

    if (activeFilters.paymentDate && filterValues.paymentDate) {
      result = result.filter((paiment) =>
        String(paiment.transaction_date).includes(filterValues.paymentDate)
      );
    }

    setFilteredPaiments(result);
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
    filterValues,
    activeFilters,
    setFilterValues,
    setActiveFilters,
    handleFilterChange,
    loading,
    fetchPayment,
    count,
    getCount
  };
}

export default useUnderPayments;
