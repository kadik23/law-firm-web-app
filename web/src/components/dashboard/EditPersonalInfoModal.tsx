import React from "react";
import Modal from "@/components/Modal";
import { useAdminAccount } from "@/hooks/useAdminAccount";
import { useForm } from "react-hook-form";

type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  phone_number?: string;
  pays?: string;
  ville?: string;
  age?: number;
  sex?: string;
  type: string;
};

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

type FormValues = {
  name: string;
  surname: string;
  email: string;
  phone_number?: string;
  pays?: string;
  ville?: string;
  age?: number | string;
  sex?: string;
};

const EditPersonalInfoModal: React.FC<EditPersonalInfoModalProps> = ({ isOpen, onClose, user }) => {
  const { updatePersonalInfo, loadingInfo, errorInfo } = useAdminAccount();
  const phoneRegex = /^\+?\d{8,15}$/;
  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      name: user.name || "",
      surname: user.surname || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      pays: user.pays || "",
      ville: user.ville || "",
      age: user.age || "",
      sex: user.sex || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    await updatePersonalInfo({ ...data, age: data.age ? Number(data.age) : undefined });
    onClose();
    reset(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isNotStepOne={true}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
        <h2 className="text-lg font-bold text-white mb-2">Modifier les informations personnelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input {...register("name", { required: "Prénom requis" })} placeholder="Prénom" className="border rounded px-3 py-2 w-full" />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
          </div>
          <div>
            <input {...register("surname", { required: "Nom requis" })} placeholder="Nom" className="border rounded px-3 py-2 w-full" />
            {errors.surname && <span className="text-red-500 text-xs">{errors.surname.message}</span>}
          </div>
          <div>
            <input {...register("email", { required: "Email requis", pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Email invalide" } })} placeholder="Email" className="border rounded px-3 py-2 w-full" type="email" />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>
          <div>
            <input {...register("phone_number", {
              required: "Numéro de téléphone requis",
              pattern: { value: phoneRegex, message: "Numéro de téléphone invalide" }
            })} placeholder="Numéro de téléphone" className="border rounded px-3 py-2 w-full" />
            {errors.phone_number && <span className="text-red-500 text-xs">{errors.phone_number.message}</span>}
          </div>
          <div>
            <input {...register("pays", { required: "Pays requis" })} placeholder="Pays" className="border rounded px-3 py-2 w-full" />
            {errors.pays && <span className="text-red-500 text-xs">{errors.pays.message}</span>}
          </div>
          <div>
            <input {...register("ville", { required: "Ville requise" })} placeholder="Ville" className="border rounded px-3 py-2 w-full" />
            {errors.ville && <span className="text-red-500 text-xs">{errors.ville.message}</span>}
          </div>
          <div>
            <input {...register("age", { required: "Âge requis", min: { value: 0, message: "Âge invalide" } })} placeholder="Âge" className="border rounded px-3 py-2 w-full" type="number" />
            {errors.age && <span className="text-red-500 text-xs">{errors.age.message}</span>}
          </div>
          <div>
            <select {...register("sex", { required: "Sexe requis", validate: (value) => value === "Homme" || value === "Femme" })} className="border rounded px-3 py-2 w-full">
              <option value="">Sexe</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>
        </div>
        {errorInfo && <div className="text-red-500">{errorInfo}</div>}
        <div className="flex gap-2 justify-end mt-4">
          <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Annuler</button>
          <button type="submit" className={`px-4 py-2 rounded bg-primary text-white ${!isValid || loadingInfo ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isValid || loadingInfo}>{loadingInfo ? "Enregistrement..." : "Enregistrer"}</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPersonalInfoModal; 