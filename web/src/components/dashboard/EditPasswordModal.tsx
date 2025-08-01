import React from "react";
import Modal from "@/components/Modal";
import { useAdminAccount } from "@/hooks/useAdminAccount";
import { useForm } from "react-hook-form";

interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormValues = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({ isOpen, onClose }) => {
  const { updatePassword, loadingPassword, errorPassword } = useAdminAccount();
  const { register, handleSubmit, formState: { errors, isValid }, reset, watch } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });
  const newPassword = watch("newPassword");

  const onSubmit = async (data: FormValues) => {
    await updatePassword(data.oldPassword, data.newPassword);
    if (!errorPassword) {
      onClose();
      reset();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isNotStepOne={true}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
        <h2 className="text-lg font-bold mb-2 text-white">Modifier le mot de passe</h2>
        <div>
          <input {...register("oldPassword", { required: "Ancien mot de passe requis" })} placeholder="Ancien mot de passe" className="border rounded px-3 py-2 w-full" type="password" />
          {errors.oldPassword && <span className="text-red-500 text-xs">{errors.oldPassword.message}</span>}
        </div>
        <div>
          <input {...register("newPassword", { required: "Nouveau mot de passe requis", minLength: { value: 8, message: "Le mot de passe doit contenir au moins 8 caractères" } })} placeholder="Nouveau mot de passe" className="border rounded px-3 py-2 w-full" type="password" />
          {errors.newPassword && <span className="text-red-500 text-xs">{errors.newPassword.message}</span>}
        </div>
        <div>
          <input {...register("confirmNewPassword", { required: "Confirmation requise", validate: value => value === newPassword || "Les mots de passe ne correspondent pas" })} placeholder="Confirmer le nouveau mot de passe" className="border rounded px-3 py-2 w-full" type="password" />
          {errors.confirmNewPassword && <span className="text-red-500 text-xs">{errors.confirmNewPassword.message}</span>}
        </div>
        {errorPassword && <div className="text-red-500">{errorPassword}</div>}
        <div className="flex gap-2 justify-end mt-4">
          <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Annuler</button>
          <button type="submit" className={`px-4 py-2 rounded bg-primary text-white ${!isValid || loadingPassword ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!isValid || loadingPassword}>{loadingPassword ? "Enregistrement..." : "Enregistrer"}</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPasswordModal; 