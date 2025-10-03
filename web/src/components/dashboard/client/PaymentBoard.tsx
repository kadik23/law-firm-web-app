"use client";
import usePagination from "@/hooks/usePagination";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import usePayments from "@/hooks/clients/usePayments";
import { statusTranslations } from "@/lib/utils/statusTranslations";
import { useAuth } from "@/hooks/useAuth";

function PaymentBoard() {
  const paimentsPerPage = 6;
  const { user } = useAuth();
  const param = useParams()
  const {
    filteredPaiments,
    filterValues,
    activeFilters,
    setFilterValues,
    setActiveFilters,
    handleFilterChange,
    loading,
  } = usePayments(user?.type == "admin" ? Number(param.id) : undefined);

  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    generatePaginationNumbers,
    setCurrentPage,
  } = usePagination(filteredPaiments.length, paimentsPerPage);

  const [total_amountModal, setTotal_amountModal] = useState(false);
  const [paid_amountModal, setPaid_amountModal] = useState(false);
  const [remainingAmountModal, setRemainingAmountModal] = useState(false);
  const [created_atModal, setcreated_atModal] = useState(false);
  const [serviceModal, setServiceModal] = useState(false);
  const [payment_statusModal, setpayment_statusModal] = useState(false);
  const total_amountRef = useRef<HTMLDivElement>(null);
  const paid_amountRef = useRef<HTMLDivElement>(null);
  const remainingAmountRef = useRef<HTMLDivElement>(null);
  const created_atRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const payment_statusRef = useRef<HTMLDivElement>(null);

  const total_amountInputRef = useRef<HTMLInputElement>(null);
  const paid_amountInputRef = useRef<HTMLInputElement>(null);
  const remainingAmountInputRef = useRef<HTMLInputElement>(null);
  const created_atInputRef = useRef<HTMLInputElement>(null);
  const serviceSelectRef = useRef<HTMLSelectElement>(null);
  const payment_statusSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        total_amountModal &&
        total_amountRef.current &&
        !total_amountRef.current.contains(event.target as Node)
      ) {
        setTotal_amountModal(false);
      }
      if (
        paid_amountModal &&
        paid_amountRef.current &&
        !paid_amountRef.current.contains(event.target as Node)
      ) {
        setPaid_amountModal(false);
      }
      if (
        remainingAmountModal &&
        remainingAmountRef.current &&
        !remainingAmountRef.current.contains(event.target as Node)
      ) {
        setRemainingAmountModal(false);
      }
      if (
        created_atModal &&
        created_atRef.current &&
        !created_atRef.current.contains(event.target as Node)
      ) {
        setcreated_atModal(false);
      }
      if (
        serviceModal &&
        serviceRef.current &&
        !serviceRef.current.contains(event.target as Node)
      ) {
        setServiceModal(false);
      }
      if (
        payment_statusModal &&
        payment_statusRef.current &&
        !payment_statusRef.current.contains(event.target as Node)
      ) {
        setpayment_statusModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    total_amountModal,
    paid_amountModal,
    remainingAmountModal,
    created_atModal,
    serviceModal,
    payment_statusModal,
  ]);

  const startIndex = (currentPage - 1) * paimentsPerPage;
  const endIndex = startIndex + paimentsPerPage;
  const paimentsToDisplay = filteredPaiments.slice(startIndex, endIndex);
  const router = useRouter();

  const navigateToUnderPayment = (id: number) => {
    router.push(`${user?.type == 'admin' ? `/admin/dashboard/clients/paiments_clients/${param.id}/payments` : '/client/dashboard/payments/'}/${id}`);
  };

  const toggleModal = (
    modalState: boolean,
    modalSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    closeAllModals();
    modalSetter(!modalState);
  };

  const closeAllModals = () => {
    setTotal_amountModal(false);
    setPaid_amountModal(false);
    setRemainingAmountModal(false);
    setcreated_atModal(false);
    setServiceModal(false);
    setpayment_statusModal(false);
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
      if (inputRef === payment_statusSelectRef) {
        inputRef.current.value = "Tous";
      } else if (inputRef === serviceSelectRef) {
        inputRef.current.value = "Tous les services";
      } else {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="pb-4 overflow-x-auto">
      <table className="w-full rounded-lg  table-auto text-left shadow-md">
        <thead>
          <tr className="text-xs ">
            <td className="px-4 py-2 border">#</td>
            <td
              className={`px-4 py-2 border text-nowrap relative ${
                activeFilters.total_amount && "border-textColor border"
              }`}
            >
              <div
                ref={total_amountRef}
                className={`bg-secondary ${
                  total_amountModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer en le saisant </div>
                <div className="flex rounded-md bg-white py-1 px-2">
                  <input
                    ref={total_amountInputRef}
                    type="number"
                    className=" outline-none placeholder:font-normal"
                    placeholder="Montant total"
                    onChange={(e) => handleFilterChange(e, "total_amount")}
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
                  activeFilters.total_amount
                    ? "text-textColor cursor-pointer"
                    : "hidden"
                }`}
                onClick={() =>
                  activeFilters.total_amount &&
                  clearFilter("total_amount", total_amountInputRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent outside click handler
                  toggleModal(total_amountModal, setTotal_amountModal);
                }}
              />
            </td>
            <td
              className={`px-4 py-2 border text-nowrap relative ${
                activeFilters.paid_amount && "border-textColor border"
              }`}
            >
              <div
                ref={paid_amountRef}
                className={`bg-secondary ${
                  paid_amountModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer en le saisant </div>
                <div className="flex rounded-md bg-white py-1 px-2">
                  <input
                    type="number"
                    className=" outline-none placeholder:font-normal"
                    placeholder="Montant payé"
                    onChange={(e) => handleFilterChange(e, "paid_amount")}
                    ref={paid_amountInputRef}
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
                  activeFilters.paid_amount
                    ? "text-textColor cursor-pointer"
                    : "hidden"
                }`}
                onClick={() =>
                  activeFilters.paid_amount &&
                  clearFilter("paid_amount", paid_amountInputRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal(paid_amountModal, setPaid_amountModal);
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
                activeFilters.created_at && "border-textColor border"
              }`}
            >
              <div
                ref={created_atRef}
                className={`bg-secondary ${
                  created_atModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer en le saisant </div>
                <div className="flex rounded-md bg-white py-1 px-2">
                  <input
                    type="date"
                    className=" outline-none placeholder:font-normal"
                    placeholder="Date de paiement"
                    onChange={(e) => handleFilterChange(e, "created_at")}
                    ref={created_atInputRef}
                  />
                </div>
              </div>
              Date de paiement
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className={`inline-block ml-1 ${
                  activeFilters.created_at
                    ? "text-textColor cursor-pointer"
                    : "hidden"
                }`}
                onClick={() =>
                  activeFilters.created_at &&
                  clearFilter("created_at", created_atInputRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal(created_atModal, setcreated_atModal);
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
                    new Set(filteredPaiments.map((p) => p.service.name))
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
                activeFilters.payment_status && "border-textColor border"
              }`}
            >
              <div
                ref={payment_statusRef}
                className={`bg-secondary ${
                  payment_statusModal ? "flex" : "hidden"
                } flex-col gap-2 p-2 absolute -bottom-16 left-0 z-10`}
              >
                <div className="text-white">Filtrer le payment_status </div>
                <select
                  className="outline-none rounded-md bg-white py-1 px-2"
                  ref={payment_statusSelectRef}
                  onChange={(e) => handleFilterChange(e, "payment_status")}
                >
                  <option value="">Tous</option>
                  <option value="COMPLETED">Terminé</option>
                  <option value="PENDING">En attente</option>
                  <option value="PROCESSING">En cours</option>
                  <option value="FAILED">Échoué</option>
                  <option value="CANCELLED">Annulé</option>
                </select>
              </div>
              payment_status
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className={`inline-block ml-1 ${
                  activeFilters.payment_status
                    ? "text-textColor cursor-pointer"
                    : "hidden"
                }`}
                onClick={() =>
                  activeFilters.payment_status &&
                  clearFilter("payment_status", payment_statusSelectRef)
                }
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1 cursor-pointer hover:text-btnSecondary"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleModal(payment_statusModal, setpayment_statusModal);
                }}
              />
            </td>
          </tr>
        </thead>
        {!loading && filteredPaiments.length == 0 ? (
          <div className="w-full text-center py-4">Pas de paiements trouvés</div>
        ) : (
          <tbody>
            {paimentsToDisplay.map((item) => (
              <tr
                onClick={() => navigateToUnderPayment(item.id)}
                key={item.id}
                className="text-xs border-b cursor-pointer hover:bg-gray-50 hover:scale-105 transition-all duration-200"
              >
                <td className="px-4 py-3 border">{item.id}</td>
                <td className="px-4 py-3 border">{item.total_amount}</td>
                <td className="px-4 py-3 border">{item.paid_amount}</td>
                <td className="px-4 py-3 border">
                  {item.total_amount - item.paid_amount}
                </td>
                <td className="px-4 py-3 border">
                  {item.created_at && item.created_at.split("T")[0]}
                </td>
                <td className="px-4 py-3 border">
                  <div className="border rounded-md py-1 px-2">
                    {item.service?.name || "—"}
                  </div>
                </td>
                <td className="px-4 py-3 border">
                  <div className="flex items-center gap-2 text-nowrap">
                    <div
                      className={`w-2 h-2 ${
                        item.payment_status == "COMPLETED"
                          ? "bg-green-400"
                          : "bg-black/55"
                      } rounded-full`}
                    />
                    {statusTranslations[item.payment_status] ||
                      item.payment_status}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        )}
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
