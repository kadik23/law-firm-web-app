import React from "react";
import Image from "next/image";

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  iconAlt: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "success" | "warning" | "danger" | "info";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconAlt,
  trend,
  color = "primary"
}) => {
  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "bg-green-50 border-green-200 text-green-700";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "danger":
        return "bg-red-50 border-red-200 text-red-700";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-700";
      default:
        return "bg-primary/10 border-primary/20 text-primary";
    }
  };

  return (
    <div className={`p-6 rounded-lg border ${getColorClasses()} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs opacity-60 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <Image
            src={icon}
            alt={iconAlt}
            width={40}
            height={40}
            className="opacity-80"
          />
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 