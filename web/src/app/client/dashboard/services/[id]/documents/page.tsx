"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAlert } from "@/contexts/AlertContext";
import { useAssignService } from "@/hooks/useAssignService";
import useReqFiles from "@/hooks/useReqFiles";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Documents = () => {
  const { id } = useParams();
  const serviceId = id ? Number(id) : undefined;
  const { showAlert } = useAlert();

  useEffect(() => {
    showAlert(
      "warning",
      "Remarque importante",
      "Vous pouvez télécharger les fichiers requis en même temps, ou remplacer les fichiers que vous souhaitez remplacer en les supprimant puis en les ajoutant à nouveau, ou en les supprimant tous et en les téléchargeant à nouveau."
    );
  }, [serviceId]);

  const {
    service,
    loading: serviceLoading,
    fetchServiceAssignDetails,
  } = useAssignService(serviceId);
  const {
    fetchFiles,
    files,
    handleDownload,
    uploadedFiles,
    setUploadedFiles,
    saveLoading,
    validateFiles,
    saveFiles,
    handleDelete,
    handleDeleteByOne,
    setIsDeleteByOne,
    isUploadingState,
    setIsUploadingState,
  } = useReqFiles();

  useEffect(() => {
    if (serviceId) {
      fetchServiceAssignDetails();
    }
  }, [serviceId]);

  useEffect(() => {
    if (service?.request_service_id) {
      fetchFiles(service.request_service_id);
    }
  }, [service]);

  if (serviceLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col md:gap-8 gap-6 md:pt-2 relative">
      <div className="flex justify-between w-full px-2">
        <div className="flex gap-2 items-center text-primary">
          <Icon icon="solar:document-outline" width={32} height={32} />
          <div className="md:font-extrabold font-semibold md:text-xl">
            Documents
          </div>
        </div>
        <div className=" gap-2 items-center md:flex hidden text-white bg-secondary  py-2 md:px-4 rounded-lg">
          <Icon icon="tdesign:service-filled" />
          <div className="font-semibold text-lg">
            Total de documents :{" "}
            {(service?.requestedFiles?.length as number) < 10
              ? `0${service?.requestedFiles?.length}`
              : service?.requestedFiles?.length}{" "}
          </div>
        </div>
        <div className="text-secondary md:hidden">
          {(service?.requestedFiles?.length as number) < 10
            ? `0${service?.requestedFiles?.length}`
            : service?.requestedFiles?.length}{" "}
          documents
        </div>
      </div>
      <div className=" rounded-2xl bg-white md:shadow-md">
        <div className="border-b border-gray-400/25 pb-4 md:py-4 md:px-8 font-semibold md:text-lg w-full px-2">
          Voici les documents que vous allez ajouter pour le “{service?.name}”
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 md:px-8 text-sm px-2">
          {service?.requestedFiles?.map((file, index) => (
            <div key={index} className="flex gap-1">
              <div className="font-bold">{index + 1}-</div> {file}{" "}
            </div>
          ))}
        </div>
        <div className="bg-[#4A84AA] bg-opacity-25 rounded-b-2xl px-8 py-4">
          <input
            type="file"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                const newFiles = Array.from(e.target.files).map((file) => ({
                  file,
                  name: file.name,
                }));
                if (uploadedFiles.length !== service?.requestedFiles?.length && isUploadingState) {
                  alert('Ooh')
                  setIsDeleteByOne(false);
                  setIsUploadingState(true);
                }
                setUploadedFiles([...uploadedFiles, ...newFiles]);
              }
            }}
            className=" bg-transparent cursor-pointer border-2 p-2 rounded-2xl w-full border-dashed border-[#4A84AA] "
          />
        </div>
      </div>
      <div className="border-b">
        <div className="flex justify-between items-center">
          <div className="border-b border-gray-400/25 md:py-4 md:px-8 text-primary font-semibold md:text-lg w-full px-2">
            Voici les documents que vous allez ajouter pour le “{service?.name}”
          </div>
          <div
            onClick={handleDelete}
            className="shadow-md md:flex gap-2 items-center hidden cursor-pointer text-secondary hover:text-white hover:bg-secondary transition-all duration-200 bg-white px-4 py-1 rounded-xl"
          >
            <Icon icon="material-symbols:delete" width="24" height="24" />
            <div className="font-semibold text-nowrap">Supprimer tous </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 text-sm gap-4 py-4 md:px-8  px-2">
          {files.length === 0 && uploadedFiles.length === 0 && (
            <div className="text-center text-gray-500">
              Aucun fichier trouvé
            </div>
          )}
          {files.map((file, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div
                onClick={() => handleDeleteByOne(file.id)}
                className="font-bold border hover:border-red-500 hover:text-red-500 cursor-pointer border-primary text-primary rounded-full w-8 h-8 flex items-center justify-center"
              >
                <Icon icon="material-symbols:delete" width="24" height="24" />
              </div>{" "}
              <div
                onClick={() => handleDownload(file.file_name, file.base64)}
                className="hover:text-secondary cursor-pointer text-xs"
              >
                {file.file_name}{" "}
              </div>
            </div>
          ))}
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div
                onClick={() => handleDeleteByOne(file)}
                className="font-bold border hover:border-red-500 hover:text-red-500 cursor-pointer border-primary text-primary rounded-full w-8 h-8 flex items-center justify-center"
              >
                <Icon icon="material-symbols:delete" width="24" height="24" />
              </div>{" "}
              <div
                onClick={() => handleDownload(file.name, file.file)}
                className="hover:text-secondary cursor-pointer text-xs"
              >
                {file.name}{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="shadow-md cursor-pointer w-fit mx-auto md:mx-0 md:ml-auto flex gap-2 items-center text-secondary hover:text-white hover:bg-secondary transition-all duration-200 bg-white px-8 py-2 rounded-xl">
        <button
          onClick={() => {
            if (!validateFiles(service?.requestedFiles?.length as number)) {
              return;
            }
            saveFiles(
              service?.request_service_id as number,
              service?.requestedFiles?.length as number
            );
          }}
          className="font-semibold text-nowrap"
          disabled={saveLoading}
        >
          {saveLoading ? <LoadingSpinner /> : "Souvegarder"}
        </button>
      </div>
      <div
        onClick={handleDelete}
        className="font-bold absolute md:hidden bottom-20 right-4 border shadow-md hover:text-secondary transition-all duration-200 bg-primary text-white rounded-xl w-12 h-10 flex items-center justify-center"
      >
        <Icon icon="material-symbols:delete" width="24" height="24" />
      </div>
    </div>
  );
};

export default Documents;
