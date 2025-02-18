import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React from "react";
import PaymentBoard from "./PaymentBoard";
import { paymentData } from "@/consts/payments";

function RecentPayment() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
        <div className="text-black/50 font-medium">Recent paiments</div>
        <div className="flex items-center gap-2">
          <div className="border-[1.5px] py-1 px-2 flex items-center rounded-md gap-2">
            <Icon icon="iconamoon:search-thin" width="20" height="20" />
            <input
              type="text"
              placeholder="Rechercher un paiement"
              className="outline-none border-none text-sm placeholder:text-xs"
            />
          </div>
          <button className="border border-black hover:bg-black hover:text-white px-2 py-1 text-sm rounded-md">
            Filter
          </button>
        </div>
      </div>
      <PaymentBoard paymentData={paymentData}/>
    </div>
  );
}

export default RecentPayment;
