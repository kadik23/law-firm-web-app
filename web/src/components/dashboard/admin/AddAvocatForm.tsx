"use client";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import FileUpload from "./FileUpload";
import { DevTool } from "@hookform/devtools";
import useLawyerForm from "@/hooks/hooksForms/useLawyerForm";

type AddAvocatFormProps = {
  onSubmit: (data: LawyerFormData) => void;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
};

export const AddAvocatForm = ({
  setFile,
  file,
  onSubmit,
}: AddAvocatFormProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const {
    register,
    control,
    handleSubmit,
    errors,
    isValid,
  } = useLawyerForm();

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
        <div className="text-textColor text-sm font-semibold">Prénom</div>
        <input
          type="text"
          {...register("surname", {
            required: "Prénom est requis",
          })}
          placeholder="Entrer le prénom"
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
        {errors.surname && <p className="error">{errors.surname.message}</p>}
      </div>

      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Email</div>
        <input
          type="email"
          {...register("email", {
            required: "Email est requis",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Format email invalide",
            },
          })}
          placeholder="Entrer l'email"
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Mot de passe</div>
        <input
          type="password"
          {...register("password", {
            required: "Mot de passe est requis",
            minLength: {
              value: 8,
              message: "Le mot de passe doit contenir au moins 8 caractères",
            },
          })}
          placeholder="Entrer le mot de passe"
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">LinkedIn</div>
        <input
          type="url"
          {...register("linkedin_url", {
            required: "Lien LinkedIn est requis",
          })}
          placeholder="Entrer le lien LinkedIn"
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
        {errors.linkedin_url && (
          <p className="error">{errors.linkedin_url.message}</p>
        )}
      </div>

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
  );onClose
};
