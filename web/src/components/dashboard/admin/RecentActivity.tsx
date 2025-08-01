import React from "react";
import Image from "next/image";

interface RecentActivityProps {
  title: string;
  items: Array<{
    id: number;
    title?: string;
    name?: string;
    clientName?: string;
    status?: string | boolean;
    date?: string;
    time?: string;
    createdAt: string;
  }>;
  type: "consultations" | "blogs" | "services";
}

const RecentActivity: React.FC<RecentActivityProps> = ({ title, items, type }) => {
  const getStatusColor = (status: string | boolean | undefined) => {
    if (status === undefined) return "bg-gray-100 text-gray-800";
    
    if (typeof status === "boolean") {
      return status ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
    }
    
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string | boolean | undefined) => {
    if (status === undefined) return "N/A";
    
    if (typeof status === "boolean") {
      return status ? "Published" : "Pending";
    }
    return status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getIcon = () => {
    switch (type) {
      case "consultations":
        return "/icons/dashboard/admin/consultation.svg";
      case "blogs":
        return "/icons/dashboard/admin/blog.svg";
      case "services":
        return "/icons/dashboard/admin/service.svg";
      default:
        return "/icons/dashboard/admin/default.svg";
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={getIcon()}
          alt={title}
          width={24}
          height={24}
        />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {item.title || item.name || item.clientName || `Item #${item.id}`}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(item.createdAt)}
                </p>
                {item.date && item.time && (
                  <p className="text-xs text-gray-400">
                    {item.date} à {item.time}
                  </p>
                )}
              </div>
              {type !== "services" && (
                <div className="flex-shrink-0">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity; 