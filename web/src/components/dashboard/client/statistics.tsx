import axiosClient from "@/lib/utils/axiosClient";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useEffect, useState } from "react";

function Statistics() {
  const [statistics, setStatistics] = useState([
    {
      icon: "solar:wallet-money-bold",
      icon_bg: "bg-green-100",
      icon_text: "text-green-700",
      name: "Paiments",
      number: "0",
      border: "md:border-r border-t md:border-t-0 border-dashed",
      container: 'justify-start'
    },
    {
      icon: "solar:verified-check-bold",
      icon_bg: "bg-orange-100",
      icon_text: "text-orange-700",
      name: "Services concernées",
      number: "0",
      border: "md:border-r border-t md:border-t-0 border-dashed",
      container: 'justify-center'
    },
    {
      icon: "solar:bill-check-bold",
      icon_bg: "bg-purple-100",
      icon_text: "text-purple-700",
      name: "Blogs enregistrés",
      number: "0",
      container: 'justify-start'
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosClient.get('user/dashboard/stats');
        const data = response.data;
        setStatistics((prevStats) =>
          prevStats.map((stat) => {
            if (stat.name === "Paiments") {
              return { ...stat, number: data.totalPayments ?? 0 };
            }
            if (stat.name === "Services concernées") {
              return { ...stat, number: data.totalServices ?? 0 };
            }
            if (stat.name === "Blogs enregistrés") {
              return { ...stat, number: data.totalFavorites ?? 0 };
            }
            return stat;
          })
        );
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="w-fit md:w-full border rounded-xl flex flex-col md:flex-row items-start md:items-center">
      {statistics.map((stat) => (
        <div
          key={stat.name}
          className={`md:w-1/3 py-4 flex px-8 items-center gap-2 ${stat.container} ${stat?.border}`}
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
