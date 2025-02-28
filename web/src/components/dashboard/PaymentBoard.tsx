"use client";
import usePagination from "@/hooks/usePagination ";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import usePayments from "@/hooks/usePayments";

function PaymentBoard({ paymentData }: { paymentData: paimentEntity[] }) {
  const paimentsPerPage = 6;
  const {
    filteredPaiments,
    filterValues,
    activeFilters,
    setFilterValues,
    setActiveFilters,
    handleFilterChange,
  } = usePayments(paymentData);
  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    generatePaginationNumbers,
    setCurrentPage,
  } = usePagination(filteredPaiments.length, paimentsPerPage);

  const [totalAmountModal, setTotalAmountModal] = useState(false);
  const [paidAmountModal, setPaidAmountModal] = useState(false);
  const [remainingAmountModal, setRemainingAmountModal] = useState(false);
  const [paymentDateModal, setPaymentDateModal] = useState(false);
  const [serviceModal, setServiceModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);

  const totalAmountRef = useRef<HTMLDivElement>(null);
  const paidAmountRef = useRef<HTMLDivElement>(null);
  const remainingAmountRef = useRef<HTMLDivElement>(null);
  const paymentDateRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const totalAmountInputRef = useRef<HTMLInputElement>(null);
  const paidAmountInputRef = useRef<HTMLInputElement>(null);
  const remainingAmountInputRef = useRef<HTMLInputElement>(null);
  const paymentDateInputRef = useRef<HTMLInputElement>(null);
  const serviceSelectRef = useRef<HTMLSelectElement>(null);
  const statusSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        totalAmountModal &&
        totalAmountRef.current &&
        !totalAmountRef.current.contains(event.target as Node)
      ) {
        setTotalAmountModal(false);
      }
      if (
        paidAmountModal &&
        paidAmountRef.current &&
        !paidAmountRef.current.contains(event.target as Node)
      ) {
        setPaidAmountModal(false);
      }
      if (
        remainingAmountModal &&
        remainingAmountRef.current &&
        !remainingAmountRef.current.contains(event.target as Node)
      ) {
        setRemainingAmountModal(false);
      }
      if (
        paymentDateModal &&
        paymentDateRef.current &&
        !paymentDateRef.current.contains(event.target as Node)
      ) {
        setPaymentDateModal(false);
      }
      if (
        serviceModal &&
        serviceRef.current &&
        !serviceRef.current.contains(event.target as Node)
      ) {
        setServiceModal(false);
      }
      if (
        statusModal &&
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setStatusModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    totalAmountModal,
    paidAmountModal,
    remainingAmountModal,
    paymentDateModal,
    serviceModal,
    statusModal,
  ]);

  const startIndex = (currentPage - 1) * paimentsPerPage;
  const endIndex = startIndex + paimentsPerPage;
  const paimentsToDisplay = filteredPaiments.slice(startIndex, endIndex);
  const router = useRouter();

  const navigateToUnderPayment = (id: number) => {
    router.push(`payments/${id}`);
  };

  const toggleModal = (
    modalState: boolean,
    modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    closeAllModals();
    modalSetter(!modalState);
  };

  const closeAllModals = () => {
    setTotalAmountModal(false);
    setPaidAmountModal(false);
    setRemainingAmountModal(false);
    setPaymentDateModal(false);
    setServiceModal(false);
    setStatusModal(false);
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
      if (inputRef === statusSelectRef) {
        inputRef.current.value = "Tous";
      } else if (inputRef === serviceSelectRef) {
        inputRef.current.value = "Tous les services";
      } else {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="pb-4 overflow-x-auto -mx-8">
      <table className="w-full rounded-lg  table-auto text-left shadow-md">
        <thead>
          <tr className="text-xs ">
            <td className="px-4 py-2 border">#</td>
            <td
              className={`px-4 py-2 border text-nowrap relative ${
                activeFilters.totalAmount && "border-textColor border"
              }`}
            >
              <div
                ref={totalAmountRef}
                className={`bg-secondary ${
                  totalAmountModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer en le saisant </div>
                <div className="flex rounded-md bg-white py-1 px-2">
                  <input
                    ref={totalAmountInputRef}
                    type="number"
                    className=" outline-none placeholder:font-normal"
                    placeholder="Montant total"
                    onChange={(e) => handleFilterChange(e, "totalAmount")}
                  />
                  DA
                </div>
              </div>
              Montant total
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className={`inline-block ml-1 ${
                  activeFilters.totalAmount
                    ? "text-textColor cursor-pointer"
                    : "hidden"
                }`}
                onClick={() =>
                  activeFilters.totalAmount &&
                  clearFilter("totalAmount", totalAmountInputRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent outside click handler
                  toggleModal(totalAmountModal, setTotalAmountModal);
                }}
              />
            </td>
            <td
              className={`px-4 py-2 border text-nowrap relative ${
                activeFilters.paidAmount && "border-textColor border"
              }`}
            >
              <div
                ref={paidAmountRef}
                className={`bg-secondary ${
                  paidAmountModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer en le saisant </div>
                <div className="flex rounded-md bg-white py-1 px-2">
                  <input
                    type="number"
                    className=" outline-none placeholder:font-normal"
                    placeholder="Montant payé"
                    onChange={(e) => handleFilterChange(e, "paidAmount")}
                    ref={paidAmountInputRef}
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
                  clearFilter("paidAmount", paidAmountInputRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal(paidAmountModal, setPaidAmountModal);
                }}
              />
            </td>
            <td
              className={`px-4 py-2 border text-nowrap relative ${
                activeFilters.remainingAmount && "border-textColor border"
              }`}
            >
              <div
                ref={remainingAmountRef}
                className={`bg-secondary ${
                  remainingAmountModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer en le saisant </div>
                <div className="flex rounded-md bg-white py-1 px-2">
                  <input
                    type="number"
                    className=" outline-none placeholder:font-normal"
                    placeholder="Montant restant"
                    ref={remainingAmountInputRef}
                    onChange={(e) => handleFilterChange(e, "remainingAmount")}
                  />
                  DA
                </div>
              </div>
              Solde restant
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className={`inline-block ml-1 ${
                  activeFilters.remainingAmount
                    ? "text-textColor cursor-pointer"
                    : "hidden"
                }`}
                onClick={() =>
                  activeFilters.remainingAmount &&
                  clearFilter("remainingAmount", remainingAmountInputRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal(remainingAmountModal, setRemainingAmountModal);
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
            <td
              className={`px-4 py-2 border text-nowrap relative ${
                activeFilters.service && "border-textColor border"
              }`}
            >
              <div
                ref={serviceRef}
                className={`bg-secondary ${
                  serviceModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer le service </div>
                <select
                  ref={serviceSelectRef}
                  className="outline-none bg-white py-1 px-2 rounded-md"
                  onChange={(e) => handleFilterChange(e, "service")}
                >
                  <option value="">Tous les services</option>
                  {Array.from(
                    new Set(paymentData.map((p) => p.service.name))
                  ).map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>
              </div>
              Service
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className={`inline-block ml-1 ${
                  activeFilters.service
                    ? "text-textColor cursor-pointer"
                    : "hidden"
                }`}
                onClick={() =>
                  activeFilters.service &&
                  clearFilter("service", serviceSelectRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal(serviceModal, setServiceModal);
                }}
              />
            </td>
            <td
              className={`px-4 py-2 border text-nowrap relative ${
                activeFilters.status && "border-textColor border"
              }`}
            >
              <div
                ref={statusRef}
                className={`bg-secondary ${
                  statusModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer le status </div>
                <select
                  className="outline-none rounded-md bg-white py-1 px-2"
                  ref={statusSelectRef}
                  onChange={(e) => handleFilterChange(e, "status")}
                >
                  <option value="">Tous</option>
                  <option value="finished">Fini</option>
                  <option value="pending">Non fini</option>
                </select>
              </div>
              Status
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className={`inline-block ml-1 ${
                  activeFilters.status
                    ? "text-textColor cursor-pointer"
                    : "hidden"
                }`}
                onClick={() =>
                  activeFilters.status && clearFilter("status", statusSelectRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal(statusModal, setStatusModal);
                }}
              />
            </td>
            <td className="px-4 py-2 border">Action</td>
          </tr>
        </thead>
        <tbody>
          {paimentsToDisplay.map((item) => (
            <tr
              onClick={() => navigateToUnderPayment(item.id)}
              key={item.id}
              className="text-xs border-b cursor-pointer hover:bg-gray-50 hover:scale-105 transition-all duration-200"
            >
              <td className="px-4 py-3 border">{item.id}</td>
              <td className="px-4 py-3 border">{item.totalAmount}</td>
              <td className="px-4 py-3 border">{item.paidAmount}</td>
              <td className="px-4 py-3 border">
                {item.totalAmount - item.paidAmount}
              </td>
              <td className="px-4 py-3 border">{item.paymentDate}</td>
              <td className="px-4 py-3 border">
                <div className="border rounded-md py-1 px-2">
                  {item.service.name}
                </div>
              </td>
              <td className="px-4 py-3 border">
                <div className="flex items-center gap-2 text-nowrap">
                  <div
                    className={`w-2 h-2 ${
                      item.status == "finished" ? "bg-green-400" : "bg-black/55"
                    } rounded-full`}
                  />
                  {item.status}
                </div>
              </td>
              <td className="px-4 py-3 border">
                <div className="flex items-center gap-2">
                  <button className="border border-black/30 flex items-center justify-center px-1 py-1 rounded">
                    <Icon
                      icon="ant-design:edit-outlined"
                      width="16"
                      height="16"
                      className="text-black"
                    />
                  </button>
                  <button className="border border-black/30 flex items-center justify-center px-1 py-1 rounded">
                    <Icon
                      icon="mingcute:delete-3-line"
                      width="16"
                      height="16"
                      className="text-black"
                    />
                  </button>
                </div>
              </td>
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

export default PaymentBoard;