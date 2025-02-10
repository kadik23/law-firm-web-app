import { paymentData } from "@/consts/payments";
import usePagination from "@/hooks/usePagination ";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useEffect, useState } from "react";

function PaymentBoard() {
  const paimentsPerPage = 6;
  const [filteredPaiments, setfilteredPaiments] = useState<paimentEntity[]>([]);
  const {
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    generatePaginationNumbers,
    setCurrentPage,
  } = usePagination(filteredPaiments.length, paimentsPerPage);

  useEffect(() => {
    setfilteredPaiments(paymentData);
  }, [paymentData]);

  const startIndex = (currentPage - 1) * paimentsPerPage;
  const endIndex = startIndex + paimentsPerPage;
  const paimentsToDisplay = filteredPaiments.slice(startIndex, endIndex);

  return (
    <div className="border shadow-md rounded-lg py-4 overflow-x-auto pl-2">
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="text-xs ">
            <td className="px-4 py-2 border">#</td>
            <td className="px-4 py-2 border">
              Montant total
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
            </td>
            <td className="px-4 py-2 border">
              Montant Payé
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
            </td>
            <td className="px-4 py-2 border">
              Solde restant
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
            </td>
            <td className="px-4 py-2 border">
              Date de paiement
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
            </td>
            <td className="px-4 py-2 border">
              Service
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
            </td>
            <td className="px-4 py-2 border">
              Status
              <Icon
                icon="solar:sort-linear"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
              <Icon
                icon="ri:filter-line"
                width="12"
                height="12"
                className="inline-block ml-1"
              />
            </td>
            <td className="px-4 py-2 border">Action</td>
          </tr>
        </thead>
        <tbody>
          {paimentsToDisplay.map((item) => (
            <tr key={item.id} className="text-xs border-b">
              <td className="px-4 py-3 border">{item.id}</td>
              <td className="px-4 py-3 border">{item.totalAmount}</td>
              <td className="px-4 py-3 border">{item.paidAmount}</td>
              <td className="px-4 py-3 border">
                {item.totalAmount - item.paidAmount}
              </td>
              <td className="px-4 py-3 border">{item.paymentDate}</td>
              <td className="px-4 py-3 border">
                <div className="border rounded-md py-1 px-2">
                  {item.service.title}
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
