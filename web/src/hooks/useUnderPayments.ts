"use client";

import { useEffect, useState } from "react";

function useUnderPayments(underPayments: underPaymentEntity[]) {
  const [filteredPaiments, setFilteredPaiments] =
    useState<underPaymentEntity[]>(underPayments);

  const [filterValues, setFilterValues] = useState({
    paidAmount: "",
    paymentDate: "",
  });

  const [activeFilters, setActiveFilters] = useState<{
    paidAmount: boolean;
    paymentDate: boolean;
  }>({
    paidAmount: false,
    paymentDate: false,
  });

  useEffect(() => {
    setFilteredPaiments(underPayments);
  }, [underPayments]);

  useEffect(() => {
    applyAllFilters();
  }, [filterValues, activeFilters]);

  const applyAllFilters = () => {
    let result = [...underPayments];

    if (activeFilters.paidAmount && filterValues.paidAmount) {
      result = result.filter((paiment) =>
        String(paiment.paidAmount).includes(filterValues.paidAmount)
      );
    }

    if (activeFilters.paymentDate && filterValues.paymentDate) {
      result = result.filter((paiment) =>
        String(paiment.paymentDate).includes(filterValues.paymentDate)
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

export default useUnderPayments;
