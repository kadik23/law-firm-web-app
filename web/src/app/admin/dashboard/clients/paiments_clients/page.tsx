"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useFilesProccessing } from "@/hooks/admin/useFilesProccessing";
import LoadingSpinner from "@/components/LoadingSpinner";

function PaymentsClients() {
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, clients, fetchClients } = useFilesProccessing();

  React.useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Historique des paiements des clients
      </h1>
      {loading && <LoadingSpinner />}
      {clients && clients.length === 0 && "Pas trouvé"}
      <div className="flex items-center justify-between mb-6 gap-6">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon
              icon="solar:minimalistic-magnifer-linear"
              className="text-gray-400"
            />
          </span>
          <input
            type="text"
            placeholder="Rechercher par nom ou prénom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left font-semibold text-gray-600">
                Nom
              </th>
              <th className="py-3 px-6 text-left font-semibold text-gray-600">
                Prénom
              </th>
              <th className="py-3 px-6 text-left font-semibold text-gray-600">
                Email
              </th>
              <th className="py-3 px-6 text-left font-semibold text-gray-600">
                Numéro De Telephone
              </th>
              <th className="py-3 px-6 text-center font-semibold text-gray-600">
                Ville
              </th>
              <th className="py-3 px-6 text-center font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-6">{client.name}</td>
                <td className="py-4 px-6">{client.surname}</td>
                <td className="py-4 px-6">{client.email}</td>
                <td className="py-4 px-6">0{client.phone_number}</td>
                <td className="py-4 px-6">{client.ville}</td>
                <td className="py-4 px-6 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <Link
                      href={`/admin/dashboard/clients/paiments_clients/${client.id}/payments`}
                      className="text-primary hover:opacity-70 font-semibold"
                    >
                      Payments
                    </Link>
                    <Link
                      href={`/admin/dashboard/clients/${client.id}`}
                      className="text-gray-600 text-sm hover:text-gray-800 font-semibold"
                    >
                      Voir le profil
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentsClients;