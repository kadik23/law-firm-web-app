"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useFilesProccessing } from "@/hooks/admin/useFilesProccessing";
import LoadingSpinner from "@/components/LoadingSpinner";

const getStatusColor = (status: string) => {
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

function FilesProcessing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const { loading, assignedServices } = useFilesProccessing();

  const uniqueServices = useMemo(() => {
    const services = assignedServices.map((d) => d.service?.name).filter(Boolean);
    return [...new Set(services)];
  }, [assignedServices]);

  const filteredDossiers = useMemo(() => {
    return assignedServices.filter((dossier) => {
      const clientName = `${dossier.User?.name ?? ""} ${dossier.User?.surname ?? ""}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = clientName.includes(searchLower);
      const matchesService = selectedService
        ? dossier.service?.name === selectedService
        : true;
      return matchesSearch && matchesService;
    });
  }, [searchTerm, assignedServices, selectedService]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Traitement des Dossiers Clients
      </h1>
      {loading && <LoadingSpinner />}
      {assignedServices && assignedServices.length === 0 && "Pas trouvé"}
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
        <div className="relative min-w-[250px]">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full appearance-none py-2 px-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
          >
            <option value="">Tous les services</option>
            {uniqueServices.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon icon="mdi:chevron-down" className="text-gray-400" />
          </span>
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
                Pays
              </th>
              <th className="py-3 px-6 text-left font-semibold text-gray-600">
                Service
              </th>
              <th className="py-3 px-6 text-center font-semibold text-gray-600">
                Statut
              </th>
              <th className="py-3 px-6 text-center font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredDossiers.map((dossier) => (
              <tr
                key={dossier.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-4 px-6">{dossier.User?.name}</td>
                <td className="py-4 px-6">{dossier.User?.surname}</td>
                <td className="py-4 px-6">{dossier.User?.pays}</td>
                <td className="py-4 px-6">{dossier.service?.name}</td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-3 py-1 text-xs text-nowrap font-semibold rounded-full ${getStatusColor(dossier.status)}`}>
                    {dossier.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <Link
                      href={`/admin/dashboard/clients/files_proccessing/${dossier.id}`}
                      className="text-primary hover:opacity-70 font-semibold"
                    >
                      Fichiers
                    </Link>
                    <Link
                      href={`/admin/dashboard/clients/${dossier.User?.id}`}
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

export default FilesProcessing;
