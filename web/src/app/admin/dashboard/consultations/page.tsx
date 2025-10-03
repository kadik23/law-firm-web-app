"use client";
import { useConsultations } from "@/hooks/admin/useConsultations";
import { useContext, useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { LoadingContext } from "@/contexts/LoadingContext";
import { statusTranslations } from "@/lib/utils/statusTranslations ";

const statusColors: Record<string, string> = {
  Accepted: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Canceled: "bg-red-100 text-red-700",
};

export default function AdminConsultationsPage() {
  const { consultations, loading, error, updateConsultation } = useConsultations();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await updateConsultation(id, status);
    } catch {}
    setUpdatingId(null);
  };

  const {setLoading} = useContext(LoadingContext);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-primary">Gestion des consultations</h1>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Problème</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Heure</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lien Rencontre</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {consultations.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    {c.client ? (
                      <>
                        {c.client.name} {c.client.surname}
                        {c.client.phone_number && (
                          <div className="text-xs text-gray-500">0{c.client.phone_number}</div>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2">{c.problem?.name || c.problem_name || c.problem_description}</td>
                  <td className="px-4 py-2">{c.date}</td>
                  <td className="px-4 py-2">{c.time}</td>
                  <td className="px-4 py-2 capitalize">{c.mode}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-nowrap text-xs font-semibold ${statusColors[c.status] || "bg-gray-200 text-gray-700"}`}>
                      {/* @ts-expect-error: status type not yet strictly enforced */}
                      {statusTranslations[c.status.toUpperCase()] || c.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {c.meeting_link ? (
                      <a href={c.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Lien Meet</a>
                    ) : c.status === "Accepted" && c.mode === "online" ? (
                      <span className="text-gray-400 text-xs">En attente...</span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="px-2 py-1 rounded bg-green-500 text-white text-xs font-bold disabled:opacity-50"
                      disabled={c.status === "Accepted" || updatingId === c.id || loading}
                      onClick={() => handleStatusChange(c.id, "Accepted")}
                    >
                      Accepter
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-yellow-500 text-white text-xs font-bold disabled:opacity-50"
                      disabled={c.status === "Pending" || updatingId === c.id || loading}
                      onClick={() => handleStatusChange(c.id, "Pending")}
                    >
                      En attente
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-500 text-white text-xs font-bold disabled:opacity-50"
                      disabled={c.status === "Canceled" || updatingId === c.id || loading}
                      onClick={() => handleStatusChange(c.id, "Canceled")}
                    >
                      Annuler
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 