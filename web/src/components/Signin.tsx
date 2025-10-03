"use client";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import useLoginForm from "@/hooks/hooksForms/useLoginForm";
import { DevTool } from "@hookform/devtools";
import axiosClient from "@/lib/utils/axiosClient";
import { useAlert } from "@/contexts/AlertContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface SigninProps {
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSignupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assignService: (() => void) | undefined;
}

function Signin({
  isModalOpen,
  setModalOpen,
  setSignupModalOpen,
  assignService,
}: SigninProps) {
  const [isDisabled, setIsDisabled] = useState(true);
  const { register, control, handleSubmit, errors, isValid, reset } = useLoginForm();
  const { showAlert } = useAlert();
  const router = useRouter();
  const { fetchUser, setLoading } = useAuth();
  useEffect(() => {
    setIsDisabled(!isValid);
  }, [isValid]);

  const onSubmit = async (data: SigninformType) => {
    try {
      setLoading(true);
      console.log("Submitting:", data);
      const response = await axiosClient.post(
        "/user/signin",
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        showAlert(
          "success",
          "Connexion réussie",
          "Vous avez lu avec succès ce message important."
        );
        fetchUser();
        reset()
        if (assignService) {
          assignService();
          if (response.data.type === "client") {
            setTimeout(() => {
              router.push(`/${response.data.type}/dashboard/services`);
              setLoading(false);
            }, 2100);
          }
        } else {
          setTimeout(
            () => {             
              router.push(`/${response.data.type}/dashboard`)
              setModalOpen(false);
            }, 2100)
          ;
        }
      } else {
        showAlert(
          "error",
          "Oh claquement !",
          "Modifiez quelques éléments et réessayez de soumettre."
        );
      }
    } catch (err) {
      showAlert(
        "error",
        "Oh claquement !",
        "Modifiez quelques éléments et réessayez de soumettre."
      );
      console.error("Error signing in:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      isNotStepOne={isModalOpen}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-4"
      >
        {process.env.NODE_ENV === "development" && (
          <DevTool control={control} />
        )}
        <div className="text-xl">Re-bienvenue</div>
        <div>Entrer vos informations svp !</div>
        <div className="flex gap-16"></div>
        <div className="flex flex-col justify-start gap-2 w-full">
          <div className="text-textColor text-sm font-semibold">Email</div>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Format d'e-mail invalide",
              },
            })}
            placeholder="Enter votre email"
            className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col justify-start gap-2 w-full">
          <div className="text-textColor text-sm font-semibold">
            Mot de passe
          </div>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Le mot de passe doit comporter au moins 8 caractères",
              },
            })}
            placeholder="Enter votre mot de passe"
            className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isDisabled} // Use `isDisabled` state
          className={`${
            isDisabled ? "btn_desabled active:scale-100" : "btn bg-textColor"
          } text-sm rounded-md p-2 btn font-semibold shadow-lg w-full`}
        >
          Se connectez
        </button>
      </form>
      <div className="flex gap-2 items-center justify-center mt-4 text-sm font-semibold w-full">
        Vous n{"'"}avez pas encore de compte ?
        <div
          className="text-textColor underline cursor-pointer hover:opacity-75"
          onClick={() => {
            setModalOpen(false);
            setSignupModalOpen(true);
          }}
        >
          Inscrivez-vous
        </div>
      </div>
    </Modal>
  );
}

export default Signin;
