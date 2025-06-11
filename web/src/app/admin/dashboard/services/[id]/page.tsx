"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import FormModal from "@/components/dashboard/admin/formModal";
import { useServicesM } from "@/hooks/useServicesM";
import { useService } from "@/hooks/useService";
import { AddServiceForm } from "@/components/dashboard/admin/services/AddServiceForm";

const ServiceOverview = () => {
  const { id } = useParams() as { id: string };
  const { service, setService, loading } = useService(parseInt(id));
  const { updateService, deleteServices, toggleSelect,file, setFile } = useServicesM();

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const [addModalOpen, setAddModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">Chargement...</h1>
      </div>
    );
  }

  if (!service)
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-7xl font-bold">Service introuvable !</h1>
      </div>
    );

  return (
    <div className="">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <span className="text-[#202224] font-bold text-2xl">Mes Services</span>
        <div className="flex justify-end gap-5">
          <button
            className="bg-primary text-white px-5 py-3 rounded-md text-sm w-full md:w-auto"
            onClick={() => setAddModalOpen(true)}
          >
            Mettre à jour
          </button>
        </div>
      </div>
      <div className="w-full flex md:flex-col flex-col-reverse mb-8">
        <div
          className="pb-4 my-4 w-full flex md:flex-row flex-col gap-3 justify-start items-center
          md:border-0 border-b-[1px] border-black"
        >
          <div className="text-xl font-medium text-gray-600">
            Nos services/{service.name}
          </div>
        </div>

        <div className="w-full">
          <div className="relative lg:w-[500px] lg:h-[250px] float-left mr-4">
            <img
              src={`${service.coverImage}`}
              alt={service.name}
              className="rounded-md w-full h-full object-cover"
            />
          </div>

          <div className="bg-third rounded-lg p-4 md:p-8 flex flex-col gap-8 justify-between">
            <div className="font-semibold text-lg md:text-xl flex justify-between items-center">
              <div>Prix</div>
              <div>DA {service?.price}</div>
            </div>
            <div className="flex flex-col gap-4 md:gap-2">
              <div className="font-semibold text-lg md:text-xl">
                Documents à fournir
              </div>
              {service?.requestedFiles && (
                <div className="grid grid-cols-1 md:grid-cols-2 text-sm md:text-base">
                  {service.requestedFiles.map((file, index) => (
                    <div key={index}>
                      <span className="font-semibold">{index + 1} </span> -{" "}
                      {file}
                    </div>
                  ))}
                </div>
              )}
              <div className="text-sm md:text-base">{service?.description}</div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <button
                onClick={()=>{
                    toggleSelect(parseInt(id))
                    deleteServices()
                }}
                className="btn text-xs md:text-sm bg-primary text-white py-2 px-4 rounded-md"
              >
                Supprimer
              </button>
              <button
                onClick={() => setAddModalOpen(true)}
                className="btn text-xs md:text-sm bg-primary text-white py-2 px-4 rounded-md"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      </div>
      <FormModal
        isOpen={addModalOpen}
        onClose={handleAddModalClose}
        isNotStepOne={true}
      >
        <div className="text-center text-white font-semibold text-xl">
          Mettre à jour
        </div>
        <AddServiceForm
          file={file}
          setFile={setFile}
          onSubmit={(data) => updateService(parseInt(id), data, service)}
          isUpdate={true}
          service={service}
          setService={setService}
        />
      </FormModal>
    </div>
  );
};

export default ServiceOverview;
