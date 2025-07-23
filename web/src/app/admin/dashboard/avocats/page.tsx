"use client";
import { AddAvocatForm } from "@/components/dashboard/admin/AddAvocatForm";
import AvocatCard from "@/components/dashboard/admin/avocatCard";
import { DeleteConfirmation } from "@/components/dashboard/admin/DeleteConfirmation";
import FormModal from "@/components/dashboard/admin/formModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import Modal from "@/components/Modal";
import { useAvocats } from "@/hooks/admin/useLawyers";
import { useState } from "react";

const Avocats = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const {
    attorneys,
    selectAll,
    selectedAvocats,
    toggleSelect,
    toggleSelectAll,
    deleteAvocats,
    addAvocat,
    file,
    setFile,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
  } = useAvocats();

  const handlePageChange = (page: number) => {
    setCurrentPage?.(page);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedAvocats.length > 0) {
      setDeleteModalOpen(true);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <span className="text-[#202224] font-bold text-2xl">Mes Avocats</span>
        <div className="flex flex-wrap items-center gap-5">
          <label className="bg-[#34495E] text-white font-bold py-2 px-5 flex items-center gap-4 rounded-md cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="cursor-pointer"
            />
            Select All
          </label>

          <button
            onClick={confirmDelete}
            className="bg-[#34495E] text-white font-bold py-2 px-5 rounded-md text-sm"
          >
            Supprimer un avocat
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-[#34495E] text-white font-bold py-2 px-5 rounded-md text-sm"
          >
            Ajouter un avocat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attorneys &&
          attorneys.map((avocat) => (
            <AvocatCard
              key={avocat.id}
              avocat={avocat}
              toggleSelect={toggleSelect}
            />
          ))}
      </div>

      {attorneys.length === 0 && !loading && (
        <div className="flex items-center justify-center mt-8">
          <span className="text-gray-500">Aucun avocat trouvé</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center mt-8">
          <LoadingSpinner />
        </div>
      )}

      <div className="flex items-center justify-center mt-8">
        {totalPages > 1 && (
          <div className="flex gap-3 justify-center items-center mt-4">
            {/* Previous Button */}
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-btnSecondary text-white rounded-md"
              >
                Previous
              </button>
            )}

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 text-lg rounded-md ${
                      currentPage === pageNumber
                        ? "bg-primary text-white font-bold"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}
            </div>

            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-btnSecondary text-white rounded-md"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>

      <FormModal
        isOpen={addModalOpen}
        onClose={handleAddModalClose}
        isNotStepOne={true}
      >
        <div className="text-center text-white font-semibold text-xl">
          Ajouter le Avocat
        </div>
        <AddAvocatForm
          file={file}
          setFile={setFile}
          onSubmit={(data) => addAvocat(data, () => setAddModalOpen(false))}
        />
      </FormModal>

      <Modal
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        isNotStepOne={true}
      >
        <DeleteConfirmation
          selectedAvocats={selectedAvocats}
          onCancel={handleDeleteModalClose}
          onConfirm={() => {
            deleteAvocats();
            handleDeleteModalClose();
          }}
        />
      </Modal>
    </div>
  );
};

export default Avocats;
