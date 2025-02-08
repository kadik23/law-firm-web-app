import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React from "react";

const paymentData = [
  {
    id: 1,
    totalAmount: "70000DA",
    paidAmount: "70000DA",
    remainingBalance: "0DA",
    paymentDate: "06/18/2024",
    service: "Service1",
    status: "confirmé",
    statusColor: "bg-green-500",
  },
  {
    id: 2,
    totalAmount: "50000DA",
    paidAmount: "25000DA",
    remainingBalance: "25000DA",
    paymentDate: "07/01/2024",
    service: "Service2",
    status: "en attente",
    statusColor: "bg-black/75",
  },
];

function PaymentBoard() {
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
          {paymentData.map((item) => (
            <tr key={item.id} className="text-xs border-b">
              <td className="px-4 py-3 border">{item.id}</td>
              <td className="px-4 py-3 border">{item.totalAmount}</td>
              <td className="px-4 py-3 border">{item.paidAmount}</td>
              <td className="px-4 py-3 border">{item.remainingBalance}</td>
              <td className="px-4 py-3 border">{item.paymentDate}</td>
              <td className="px-4 py-3 border">
                <div className="border rounded-md py-1 px-2">
                  {item.service}
                </div>
              </td>
              <td className="px-4 py-3 border">
                <div className="flex items-center gap-2 text-nowrap">
                  <div className={`w-2 h-2 ${item.statusColor} rounded-full`} />
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
      <div className="flex items-center mt-8 gap-2">
        <div className="border cursor-pointer hover:border-black rounded-md flex items-center justify-center bg-gray-200 w-8 h-8 p-2">
          <Icon
            icon="iconamoon:arrow-left-2-duotone"
            width="12"
            height="12"
          />
        </div>
        <div className="border cursor-pointer hover:border-black border-black rounded-md flex items-center justify-center p-2 w-8 h-8">1</div>
        <div className="border cursor-pointer hover:border-black rounded-md flex items-center justify-center p-2 w-8 h-8">2</div>
        <div className="border cursor-pointer hover:border-black rounded-md flex items-center justify-center p-2 w-8 h-8">3</div>
        <div className="border cursor-pointer hover:border-black rounded-md flex items-center justify-center p-2 w-8 h-8">4</div>
        <div className="border cursor-pointer hover:border-black rounded-md flex items-center justify-center p-2 w-8 h-8">
          <Icon
            icon="iconamoon:arrow-right-2-duotone"
            width="12"
            height="12"
          />
        </div>
        <div className="border cursor-pointer hover:border-black hover:text-black rounded-md p-2 flex gap-16 items-center h-8">
          10
          <Icon icon="fe:arrow-down" className="text-gray-300" width="12" height="12" />
        </div>
        <div className="text-xs">

        /Page
        </div>
      </div>
    </div>
  );
}

export default PaymentBoard;
