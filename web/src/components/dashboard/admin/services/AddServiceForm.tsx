"use client";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { DevTool } from "@hookform/devtools";
import useServiceForm from "@/hooks/hooksForms/useServiceForm";
import FileUpload from "../FileUpload";
import ArrayInput from "./ArrayInput";

type AddServiceFormProps = {
  onSubmit: (data: ServiceFormData) => void;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
};

export const AddServiceForm = ({
  setFile,
  file,
  onSubmit,
}: AddServiceFormProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const {
    register,
    control,
    handleSubmit,
    errors,
    isValid,
    setValue,
    watch,
  } = useServiceForm();

  const requestedFiles = watch("requestedFiles") || [];

  useEffect(() => {
    setIsDisabled(!isValid || file == null);
  }, [isValid, file]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start gap-4"
    >
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}

      <div className="w-full">
        <FileUpload
          file={file}
          setFile={setFile}
        />
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
        {errors.description && <p className="error">{errors.description.message}</p>}
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
        onChange={(values) => setValue("requestedFiles", values, { shouldValidate: true })}
        placeholder="Entrer le nom du fichier demandé"
        label="Fichiers demandés"
      />
      {errors.requestedFiles && <p className="error">{errors.requestedFiles.message}</p>}

      <button
        type="submit"
        disabled={isDisabled}
        className={`${
          isDisabled ? "btn_desabled active:scale-100" : "btn bg-textColor"
        } text-sm rounded-md p-2 btn font-semibold shadow-lg w-full`}
      >
        Ajouter
      </button>
    </form>
  );
};
