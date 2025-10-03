"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { DevTool } from "@hookform/devtools";
import useServiceForm from "@/hooks/hooksForms/useServiceForm";
import FileUpload from "../FileUpload";
import ArrayInput from "./ArrayInput";
import { base64ToFile } from "@/lib/utils/base64ToFile";
import { fileToBase64 } from "@/lib/utils/fileToBase64";
import { arraysEqual } from "@/lib/utils/arrayEqual";

type AddServiceFormProps = {
  onSubmit: (data: ServiceFormData) => void;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  isUpdate: boolean;
  service?: serviceEntity;
  setService?: Dispatch<SetStateAction<serviceEntity | null>>;
  loading: boolean;
};

export const AddServiceForm = ({
  setFile,
  file,
  onSubmit,
  isUpdate,
  setService,
  service,
  loading
}: AddServiceFormProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const { register, control, handleSubmit, errors, isValid, setValue, watch } =
    useServiceForm(
      isUpdate && service
        ? {
            name: service.name,
            price: service.price,
            requestedFiles: service.requestedFiles,
            description: service.description,
            coverImage: service.coverImage,
          }
        : undefined
    );

  const requestedFiles = watch("requestedFiles") || [];

  const isInitialLoad = useRef(true);
  const prevFileRef = useRef<File | null>(null);
  const oldServiceDataRef = useRef<serviceEntity | null>(null);
  const formValues = watch();

  
  useEffect(() => {
    if (isUpdate && service && isInitialLoad.current) {
      oldServiceDataRef.current = { ...service };
      isInitialLoad.current = false;
    }
  }, [service, isUpdate]);

  const fileChanged = !!file;

  useEffect(() => {
    if (isUpdate) {
      const hasChanges =
        formValues.name !== oldServiceDataRef.current?.name ||
        formValues.price !==
          oldServiceDataRef.current?.price ||
        formValues.description !== oldServiceDataRef.current?.description ||
        !arraysEqual(formValues.requestedFiles, oldServiceDataRef.current?.requestedFiles) ||
        fileChanged;

      setIsDisabled(!hasChanges);
    } else {
      setIsDisabled(!isValid || file == null);
    }
  }, [isValid, file, isUpdate, formValues]);

  useEffect(() => {
    const setImageFile = async () => {
      if (service?.coverImage && isInitialLoad.current) {
        try {
          const file = await base64ToFile(service.coverImage, "service-image.jpg");
          setFile(file);
          prevFileRef.current = file;
          isInitialLoad.current = false;
        } catch (error) {
          console.error("Error converting base64 to file:", error);
        }
      }
    };
    setImageFile();
  }, [service?.coverImage, setFile]);
  
  useEffect(() => {
    const updateServiceImage = async () => {
      if (file && setService && service && !isInitialLoad.current && file !== prevFileRef.current) {
        try {
          const base64String = await fileToBase64(file);
          setService(prev => prev ? { ...prev, coverImage: base64String } : prev);
          prevFileRef.current = file;
        } catch (error) {
          console.error("Error converting file to base64:", error);
        }
      }
    };

    updateServiceImage();
  }, [file, service, setService]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start gap-4"
    >
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}

      <div className="w-full">
        <FileUpload previewSrc={service?.coverImage} file={file} setFile={setFile} />
      </div>

      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Nom</div>
        <input
          type="text"
          {...register("name", {
            required: "Nom est requis",
          })}
          placeholder="Entrer le nom"
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
        {errors.name && <p className="error">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Description</div>
        <input
          type="text"
          {...register("description", {
            required: "Description est requis",
          })}
          placeholder="Entrer le description"
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
        {errors.description && (
          <p className="error">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Prix</div>
        <input
          type="number"
          {...register("price", {
            required: "Prix est requis",
            pattern: {
              value: /^[0-9]+$/,
              message: "Format numérique invalide",
            },
          })}
          placeholder="Entrer le prix"
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
        {errors.price && <p className="error">{errors.price.message}</p>}
      </div>

      <ArrayInput
        values={requestedFiles}
        onChange={(values) =>
          setValue("requestedFiles", values, { shouldValidate: true })
        }
        placeholder="Entrer le nom du fichier demandé"
        label="Fichiers demandés"
      />
      {errors.requestedFiles && (
        <p className="error">{errors.requestedFiles.message}</p>
      )}
      {isUpdate ? (
        <button
          type="submit"
          disabled={isDisabled || loading}
          className={`${
            isDisabled || loading ? "btn_desabled active:scale-100" : "btn bg-textColor"
          } text-sm rounded-md p-2 btn font-semibold shadow-lg w-full`}
        >
          Mettre a jour
        </button>
      ) : (
        <button
          type="submit"
          disabled={isDisabled || loading}
          className={`${
            isDisabled || loading ? "btn_desabled active:scale-100" : "btn bg-textColor"
          } text-sm rounded-md p-2 btn font-semibold shadow-lg w-full`}
        >
          Ajouter
        </button>
      )}
    </form>
  );
};
