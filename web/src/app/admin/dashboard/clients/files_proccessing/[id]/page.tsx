"use client";
import React, { useMemo, useEffect } from "react";
import { Icon } from "@iconify-icon/react";
import useReqFiles from "@/hooks/clients/useReqFiles";
import { useParams } from "next/navigation";
import { useFilesProccessing } from "@/hooks/admin/useFilesProccessing";
import LoadingSpinner from "@/components/LoadingSpinner";

function DossierClientPage() {
  const { id } = useParams() as { id: string };
  const { fetchFiles, files, setFiles, handleDownload } = useReqFiles();
  const {
    updateFileStatus,
    updateFolderStatus,
    loading,
    showAlert,
    pendingFolderStatus,
    setPendingFolderStatus,
    rejectingFileId,
    setRejectingFileId,
  } = useFilesProccessing();
  const [modalOpen, setModalOpen] = React.useState(false);

  useEffect(() => {
    fetchFiles(parseInt(id));
  }, [id]);

  const overallStatusToBackend = (status: string) => {
    if (status === "Approuvé") return "Completed";
    if (status === "Rejeté") return "Canceled";
    return "Pending";
  };

  const handleStatusChange = async (fileId: number, newStatus: FileStatus) => {
    setFiles(
      files.map((file) =>
        file.id === fileId
          ? {
              ...file,
              status: newStatus,
              rejection_reason:
                newStatus !== "Refused" ? "" : file.rejection_reason,
            }
          : file
      )
    );
    if (newStatus === "Refused") {
      setRejectingFileId(fileId);
      return;
    }
    await updateFileStatus(fileId, newStatus);
    // Recalculate overall status after file status change
    const updatedFiles = files.map((file) =>
      file.id === fileId ? { ...file, status: newStatus } : file
    );
    const isRejected = updatedFiles.every((file) => file.status === "Refused");
    const isAccepted = updatedFiles.every((file) => file.status === "Accepted");
    let newOverallStatus = "En cours de révision";
    if (isRejected) newOverallStatus = "Rejeté";
    else if (isAccepted) newOverallStatus = "Approuvé";
    await updateFolderStatus(
      parseInt(id),
      overallStatusToBackend(newOverallStatus)
    );
    fetchFiles(parseInt(id));
  };

  const handleReasonChange = (fileId: number, reason: string) => {
    setFiles(
      files.map((file) =>
        file.id === fileId ? { ...file, rejection_reason: reason } : file
      )
    );
  };

  const handleReasonSubmit = async (fileId: number, reason: string) => {
    if (!reason.trim()) {
      showAlert("error", "Erreur", "Rejet Motif est requis.");
      return;
    }
    await updateFileStatus(fileId, "Refused", reason);
    setRejectingFileId(null);
    // Recalculate overall status after file status change
    const updatedFiles = files.map((file) =>
      file.id === fileId ? { ...file, status: "Refused" } : file
    );
    const isRejected = updatedFiles.every((file) => file.status === "Refused");
    const isAccepted = updatedFiles.every((file) => file.status === "Accepted");
    let newOverallStatus = "En cours de révision";
    if (isRejected) newOverallStatus = "Rejeté";
    else if (isAccepted) newOverallStatus = "Approuvé";
    await updateFolderStatus(
      parseInt(id),
      overallStatusToBackend(newOverallStatus)
    );
    fetchFiles(parseInt(id));
  };

  const handleFolderStatusChange = (status: string) => {
    setPendingFolderStatus(status);
    setModalOpen(true);
  };

  const confirmFolderStatusChange = async () => {
    if (pendingFolderStatus) {
      await updateFolderStatus(
        parseInt(id),
        overallStatusToBackend(pendingFolderStatus)
      );
      fetchFiles(parseInt(id));
      setModalOpen(false);
      setPendingFolderStatus(null);
    }
  };

  const overallStatus = useMemo(() => {
    const isRejected = files.every((file) => file.status === "Refused");
    const isAccepted = files.every((file) => file.status === "Accepted");
    if (isRejected) return "Rejeté";
    if (isAccepted) return "Approuvé";
    return "En cours de révision";
  }, [files]);

  return (
    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg">
      <h1 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
        Dossier du Client
      </h1>
      <p className="text-gray-500 mb-6 text-sm md:text-base">ID de la demande : #{id}</p>
      {loading && <LoadingSpinner />}
      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-gray-50 border border-gray-200 p-4 rounded-lg transition-all"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => handleDownload(file.file_name, file.base64)}
              >
                <Icon
                  icon="solar:document-linear"
                  className="text-primary text-lg md:text-2xl group-hover:text-btnSecondary"
                />
                <span className="font-semibold text-sm md:text-base text-gray-700 transition group-hover:text-btnSecondary">
                  {file.file_name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-48">
                  <select
                    value={file.status}
                    onChange={(e) =>
                      handleStatusChange(file.id, e.target.value as FileStatus)
                    }
                    className="w-full text-sm md:text-base appearance-none py-2 px-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
                  >
                    <option value="Pending">En attente</option>
                    <option value="Accepted">Accepté</option>
                    <option value="Refused">Rejeté</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <Icon icon="mdi:chevron-down" className="text-gray-400" />
                  </span>
                </div>
              </div>
            </div>
            {rejectingFileId === file.id && (
              <div className="mt-4 pl-10 flex gap-4">
                <input
                  type="text"
                  placeholder="Motif du rejet..."
                  value={file.rejection_reason || ""}
                  onChange={(e) => handleReasonChange(file.id, e.target.value)}
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
                <button
                  onClick={() =>
                    handleReasonSubmit(file.id, file.rejection_reason || "")
                  }
                  className="bg-primary transition-all duration-200 active:scale-105 py-2 px-4 hover:opacity-75 text-white rounded-lg"
                  disabled={loading}
                >
                  Soumettre
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="md:text-lg font-bold text-gray-800">Statut du Dossier</h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Statut actuel :
          <span
            className={`font-semibold ml-2 ${
              overallStatus === "Approuvé"
                ? "text-green-600"
                : overallStatus === "Rejeté"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {overallStatus}
          </span>
        </p>
        <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
          <button
            className="bg-primary hover:opacity-80 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={overallStatus !== "Approuvé"}
            onClick={() => handleFolderStatusChange("Completed")}
          >
            Accepter le Dossier
          </button>
          <button
            className="border-red-600 border hover:bg-red-600 text-red-600 hover:text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={overallStatus !== "Rejeté"}
            onClick={() => handleFolderStatusChange("Canceled")}
          >
            Rejeter le Dossier
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirmer l{"'"}action</h3>
            <p className="mb-6">
              Êtes-vous sûr de vouloir{" "}
              {pendingFolderStatus === "Completed" ? "accepter" : "rejeter"} ce
              dossier ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setModalOpen(false)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 rounded bg-primary text-white hover:opacity-80"
                onClick={confirmFolderStatusChange}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DossierClientPage;
