"use client";

import { useEffect, useState } from "react";

function usePayments(paymentData: paimentEntity[]) {
  const [filteredPaiments, setFilteredPaiments] =
    useState<paimentEntity[]>(paymentData);

  const [filterValues, setFilterValues] = useState({
    totalAmount: "",
    paidAmount: "",
    remainingAmount: "",
    paymentDate: "",
    service: "",
    status: "",
  });

  const [activeFilters, setActiveFilters] = useState<{
    totalAmount: boolean;
    paidAmount: boolean;
    remainingAmount: boolean;
    paymentDate: boolean;
    service: boolean;
    status: boolean;
  }>({
    totalAmount: false,
    paidAmount: false,
    remainingAmount: false,
    paymentDate: false,
    service: false,
    status: false,
  });

  useEffect(() => {
    setFilteredPaiments(paymentData);
  }, [paymentData]);

  useEffect(() => {
    applyAllFilters();
  }, [filterValues, activeFilters]);

  const applyAllFilters = () => {
    let result = [...paymentData];

    if (activeFilters.totalAmount && filterValues.totalAmount) {
      result = result.filter((paiment) =>
        String(paiment.totalAmount).includes(filterValues.totalAmount)
      );
    }

    if (activeFilters.paidAmount && filterValues.paidAmount) {
      result = result.filter((paiment) =>
        String(paiment.paidAmount).includes(filterValues.paidAmount)
      );
    }

    if (activeFilters.remainingAmount && filterValues.remainingAmount) {
      result = result.filter((paiment) => {
        const remaining = paiment.totalAmount - paiment.paidAmount;
        return String(remaining).includes(filterValues.remainingAmount);
      });
    }

    if (activeFilters.paymentDate && filterValues.paymentDate) {
      result = result.filter((paiment) =>
        String(paiment.paymentDate).includes(filterValues.paymentDate)
      );
    }

    if (activeFilters.service && filterValues.service) {
      result = result.filter(
        (paiment) => paiment.service.name === filterValues.service
      );
    }

    if (activeFilters.status && filterValues.status) {
      result = result.filter(
        (paiment) => paiment.status === filterValues.status
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
  };
}

export default usePayments;
