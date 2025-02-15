import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useState } from "react";

function Statistics() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [statistics, setStatistics] = useState([
    {
      icon: "solar:wallet-money-bold",
      icon_bg: "bg-green-100",
      icon_text: "text-green-700",
      name: "Paiment",
      number: "33",
      border: "border-r border-dashed",
      container: 'justify-start'
    },
    {
      icon: "solar:verified-check-bold",
      icon_bg: "bg-orange-100",
      icon_text: "text-orange-700",
      name: "Services concernées",
      number: "8",
      border: "border-r border-dashed",
      container: 'justify-center'
    },
    {
      icon: "solar:bill-check-bold",
      icon_bg: "bg-purple-100",
      icon_text: "text-purple-700",
      name: "Saved Blogs",
      number: "25",
      container: 'justify-start'
    },
  ]);
  return (
    <div className=" border rounded-xl flex items-center">
      {statistics.map((stat) => (
        <div
          key={stat.name}
          className={`w-1/3 py-4 flex px-8 items-center gap-2 ${stat.container} ${stat?.border}`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-full ${stat.icon_bg}`}>
            <Icon
              icon={stat.icon}
              className={stat.icon_text}
              width="20"
              height="20"
            />
          </div>
          <div className="flex flex-col">
            <div className="text-lg">{stat.number}</div>
            <div className="opacity-50 text-xs">{stat.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Statistics;
