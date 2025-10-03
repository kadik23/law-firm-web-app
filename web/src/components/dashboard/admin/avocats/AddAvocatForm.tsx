"use client";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import FileUpload from "../FileUpload";
import { DevTool } from "@hookform/devtools";
import useLawyerForm from "@/hooks/hooksForms/useLawyerForm";

type AddAvocatFormProps = {
  onSubmit: (data: LawyerFormData) => void;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  loading: boolean;
};

export const AddAvocatForm = ({
  setFile,
  file,
  onSubmit,
  loading
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
      className="grid grid-cols-2 items-center gap-4"
    >
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}

      <div className="w-full col-span-2">
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

      <div className="flex flex-col justify-start gap-2 col-span-2 w-full">
        <div className="text-textColor text-sm font-semibold ">Email</div>
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
        <div className="text-textColor text-sm font-semibold col-span-1">Sexe</div>
        <div>
          <select {...register("sex", { required: "Sexe requis", validate: (value) => value === "Homme" || value === "Femme" })} className="border rounded px-3 py-2 w-full">
            <option value="">Sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
          </select>
        </div>
        {errors.sex && <p className="error">{errors.sex.message}</p>}
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
        <div className="text-textColor text-sm font-semibold">Téléphone</div>
        <input
          type="text"
          {...register("phone_number", {
            required: "Téléphone est requis",
          })}
          placeholder="Entrer le téléphone"
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
        {errors.phone_number && <p className="error">{errors.phone_number.message}</p>}
      </div>

      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Ville</div>
        <input
          type="text"
          {...register("ville", {
            required: "Ville est requis",
          })}
          placeholder="Entrer la ville"
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
        {errors.ville && <p className="error">{errors.ville.message}</p>}
      </div>

      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Âge</div>
        <input
          type="number"
          {...register("age", {
            required: "Âge est requis",
            min: {
              value: 18,
              message: "L'âge doit être au moins 18 ans"
            },
            max: {
              value: 100,
              message: "L'âge ne peut pas dépasser 100 ans"
            }
          })}
          placeholder="Entrer l'âge"
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
        {errors.age && <p className="error">{errors.age.message}</p>}
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
        disabled={isDisabled || loading}
        className={`${
          isDisabled || loading ? "btn_desabled active:scale-100" : "btn bg-textColor"
        } text-sm rounded-md p-2 btn font-semibold shadow-lg col-span-2 w-full`}
      >
        Ajouter
      </button>
    </form>
  );
};
