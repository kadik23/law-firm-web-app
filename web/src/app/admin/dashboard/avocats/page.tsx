"use client";
import { AddAvocatForm } from "@/components/dashboard/admin/AddAvocatForm";
import AvocatCard from "@/components/dashboard/admin/avocatCard";
import { DeleteConfirmation } from "@/components/dashboard/admin/DeleteConfirmation";
import FormModal from "@/components/dashboard/admin/formModal";
import Modal from "@/components/Modal";
import Pagination from "@/components/Pagination";
import { useAvocats } from "@/hooks/useAvocats";
import usePagination from "@/hooks/usePagination ";
import { useState } from "react";

const Avocats = () => {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    
    const {
        attorneys,
        selectAll,
        formData,
        selectedAvocats,
        toggleSelect,
        toggleSelectAll,
        deleteAvocats,
        addAvocat,
        handleInputChange,
        handleImageUpload,
        resetForm,
        file,
        setFile
    } = useAvocats();

    const AvocatPerPage = 6;
    const {
      currentPage,
      totalPages,
      goToPreviousPage,
      goToNextPage,
      generatePaginationNumbers,
      setCurrentPage,
    } = usePagination(attorneys.length, AvocatPerPage);

    const handleAddModalClose = () => {
        setAddModalOpen(false);
        resetForm();
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
                        <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="cursor-pointer" />
                        Select All
                    </label>

                    <button onClick={confirmDelete} className="bg-[#34495E] text-white font-bold py-2 px-5 rounded-md text-sm">
                        Supprimer un avocat
                    </button>

                    <button onClick={() => setAddModalOpen(true)} className="bg-[#34495E] text-white font-bold py-2 px-5 rounded-md text-sm">
                        Ajouter un avocat
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {attorneys
                .slice(
                    (currentPage - 1) * AvocatPerPage,
                    currentPage * AvocatPerPage)
                .map(avocat => (
                    <AvocatCard key={avocat.id} avocat={avocat} toggleSelect={toggleSelect} />
                ))}
            </div>

            <div className="flex items-center justify-center mt-8">
                {totalPages > 1 && (
                    <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPreviousPage={goToPreviousPage}
                    goToNextPage={goToNextPage}
                    generatePaginationNumbers={generatePaginationNumbers}
                    setCurrentPage={setCurrentPage}
                    />
                )}
            </div>

            <FormModal isOpen={addModalOpen} onClose={handleAddModalClose} isNotStepOne={true}>
                <div className="text-center text-white font-semibold text-xl">
                    Add a Lawyer
                </div>
                <AddAvocatForm
                    formData={formData}
                    file= {file}
                    setFile= {setFile}
                    onInputChange={handleInputChange}
                    onImageUpload={handleImageUpload}
                    onSubmit={(e) => addAvocat(e, () => setAddModalOpen(false))}
                    onClose={() => setAddModalOpen(false)}
                />
            </FormModal>

            <Modal isOpen={deleteModalOpen} onClose={handleDeleteModalClose} isNotStepOne={true}>
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