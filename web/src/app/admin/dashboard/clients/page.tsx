import Link from "next/link";
import React from "react";

function Clients() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-8 text-gray-800 text-center">Gestion des Clients</h1>
        <div className="flex flex-col gap-6">
          <Link
            href="clients/files_proccessing"
            className="block w-full text-center bg-primary hover:opacity-70 text-white font-semibold py-3 rounded-lg transition"
          >
            Traitement des dossiers clients
          </Link>
          <Link
            href="clients/paiments_clients"
            className="block w-full text-center bg-white border border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 rounded-lg transition"
          >
            Paiements des Clients
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Clients;