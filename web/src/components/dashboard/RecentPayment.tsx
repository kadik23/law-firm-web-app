import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React from "react";
import PaymentBoard from "./PaymentBoard";

function RecentPayment() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="text-black/50 font-medium">Recent paiments</div>
        <div className="flex items-center gap-2">
          <div className="border-[1.5px] py-1 px-2 flex items-center rounded-md gap-2">
            <Icon icon="iconamoon:search-thin" width="20" height="20" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none border-none text-sm placeholder:text-sm"
            />
          </div>
          <button className="border border-black px-2 py-1 text-sm rounded-md">
            Filter
          </button>
        </div>
      </div>
      <PaymentBoard />
    </div>
  );
}

export default RecentPayment;
