import React from "react";
import PaymentBoard from "./PaymentBoard";

function RecentPayment() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between">
        <div className="text-black/50 font-medium">Recent paiments</div>
      </div>
      <PaymentBoard/>
    </div>
  );
}

export default RecentPayment;
