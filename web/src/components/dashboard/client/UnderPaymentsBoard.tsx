"use client";
import usePagination from "@/hooks/usePagination";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useEffect, useState, useRef } from "react";
import useUnderPayments from "@/hooks/clients/useUnderPayments";
import { useParams } from "next/dist/client/components/navigation";
import { useAuth } from "@/hooks/useAuth";

function UnderPaymentBoard() {
  const paymentsPerPage = 6;
  const params = useParams();
  const { user } = useAuth();
  const {
    filteredPaiments,
    filterValues,
    activeFilters,
    setFilterValues,
    setActiveFilters,
    handleFilterChange,
    fetchPayment
  } = useUnderPayments(user?.type == "admin" ? Number(params.id) : undefined);
  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    generatePaginationNumbers,
    setCurrentPage,
  } = usePagination(filteredPaiments.length, paymentsPerPage);

  useEffect(() => {
    if (params.id) {
      if(user?.type == 'admin'){
        fetchPayment(Number(params.payment_id));
        return;
      }
      fetchPayment(Number(params.id));
    }
  }, [params.id]);

  const [transaction_amountModal, settransaction_amountModal] = useState(false);
  const [paymentDateModal, setPaymentDateModal] = useState(false);

  const transaction_amountRef = useRef<HTMLDivElement>(null);
  const paymentDateRef = useRef<HTMLDivElement>(null);

  const transaction_amountInputRef = useRef<HTMLInputElement>(null);
  const paymentDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        transaction_amountModal &&
        transaction_amountRef.current &&
        !transaction_amountRef.current.contains(event.target as Node)
      ) {
        settransaction_amountModal(false);
      }
      if (
        paymentDateModal &&
        paymentDateRef.current &&
        !paymentDateRef.current.contains(event.target as Node)
      ) {
        setPaymentDateModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    transaction_amountModal,
    paymentDateModal,
  ]);

  const startIndex = (currentPage - 1) * paymentsPerPage;
  const endIndex = startIndex + paymentsPerPage;
  const paimentsToDisplay = filteredPaiments?.slice(startIndex, endIndex);

  const toggleModal = (
    modalState: boolean,
    modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    closeAllModals();
    modalSetter(!modalState);
  };

  const closeAllModals = () => {
    settransaction_amountModal(false);
    setPaymentDateModal(false);
  };

  const clearFilter = (
    field: keyof typeof activeFilters,
    inputRef: React.RefObject<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilterValues({
      ...filterValues,
      [field]: "",
    });

    setActiveFilters({
      ...activeFilters,
      [field]: false,
    });

    if (inputRef.current) {
        inputRef.current.value = "";
    }
    
  };

  return (
    <div className="pb-4 overflow-x-auto    ">
      <table className="w-full rounded-lg  table-auto text-left shadow-md">
        <thead>
          <tr className="text-xs ">
            <td className="px-4 py-2 border">#</td>
            <td
              className={`px-4 py-2 border text-nowrap relative ${
                activeFilters.paidAmount && "border-textColor border"
              }`}
            >
              <div
                ref={transaction_amountRef}
                className={`bg-secondary ${
                  transaction_amountModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer en le saisant </div>
                <div className="flex rounded-md bg-white py-1 px-2">
                  <input
                    type="number"
                    className=" outline-none placeholder:font-normal"
                    placeholder="Montant payé"
                    onChange={(e) => handleFilterChange(e, "paidAmount")}
                    ref={transaction_amountInputRef}
                  />
                  DA
                </div>
              </div>
              Montant Payé
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className={`inline-block ml-1 ${
                  activeFilters.paidAmount
                    ? "text-textColor cursor-pointer"
                    : "hidden"
                }`}
                onClick={() =>
                  activeFilters.paidAmount &&
                  clearFilter("paidAmount", transaction_amountInputRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal(transaction_amountModal, settransaction_amountModal);
                }}
              />
            </td>
            <td
              className={`px-4 py-2 border text-nowrap relative ${
                activeFilters.paymentDate && "border-textColor border"
              }`}
            >
              <div
                ref={paymentDateRef}
                className={`bg-secondary ${
                  paymentDateModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer en le saisant </div>
                <div className="flex rounded-md bg-white py-1 px-2">
                  <input
                    type="date"
                    className=" outline-none placeholder:font-normal"
                    placeholder="Date de paiement"
                    onChange={(e) => handleFilterChange(e, "paymentDate")}
                    ref={paymentDateInputRef}
                  />
                </div>
              </div>
              Date de paiement
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className={`inline-block ml-1 ${
                  activeFilters.paymentDate
                    ? "text-textColor cursor-pointer"
                    : "hidden"
                }`}
                onClick={() =>
                  activeFilters.paymentDate &&
                  clearFilter("paymentDate", paymentDateInputRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal(paymentDateModal, setPaymentDateModal);
                }}
              />
            </td>
          </tr>
        </thead>
        <tbody>
          {paimentsToDisplay.map((item) => (
            <tr
              key={item.id}
              className="text-xs border-b"
            >
              <td className="px-4 py-3 border">{item.id}</td>
              <td className="px-4 py-3 border">{item.transaction_amount}</td>
              <td className="px-4 py-3 border">{item.transaction_date.split("T")[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex gap-3 justify-start items-center mt-4">
          {currentPage > 1 && (
            <button
              onClick={goToPreviousPage}
              className="px-2 py-1 bg-btnSecondary text-white rounded-md"
            >
              <Icon
                icon="iconamoon:arrow-left-2-duotone"
                width="12"
                height="12"
              />
            </button>
          )}

          <div className="flex gap-2">
            {generatePaginationNumbers().map((pageNumber: number) => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pageNumber
                    ? "bg-primary text-white font-bold"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          {currentPage < totalPages && (
            <button
              onClick={goToNextPage}
              className="px-2 py-1 bg-btnSecondary text-white rounded-md"
            >
              <Icon
                icon="iconamoon:arrow-right-2-duotone"
                width="12"
                height="12"
              />
            </button>
          )}
          <div className="text-sm">/Pages</div>
        </div>
      )}
    </div>
  );
}

export default UnderPaymentBoard;