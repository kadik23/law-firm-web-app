"use client";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import useLoginForm from "@/hooks/useLoginForm";
import { DevTool } from "@hookform/devtools";
import axiosClient from "@/lib/utils/axiosClient";

interface SigninProps {
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Signin({ isModalOpen, setModalOpen }: SigninProps) {
  const [isDisabled, setIsDisabled] = useState(true);
  const {
    register,
    control,
    handleSubmit,
    errors,
    isValid,
  } = useLoginForm(); 

  useEffect(() => {
    setIsDisabled(!isValid); 
  }, [isValid]); 

  const onSubmit = async (data: SigninformType) => {
    try {
      console.log("Submitting:", data);
      const response = await axiosClient.post("/user/signin", {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("Success sign in"); 
        setModalOpen(false)   
        window.location.href = `/${response.data.type}/dashboard`;
      } else {
        alert("Failed to sign in");
      }
    } catch (err) {
      alert("Failed to sign in");
      console.error("Error signing in:", err);
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
        {process.env.NODE_ENV === "development" && <DevTool control={control} />}
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
                message: "Invalid email format",
              },
            })}
            placeholder="Enter votre email"
            className="py-1 px-4 outline-none text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
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
                message: "Password must be at least 8 characters",
              },
            })}
            placeholder="Enter votre mot de passe"
            className="py-1 px-4 outline-none text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
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
        <div className="text-textColor underline">Inscrivez-vous</div>
      </div>
    </Modal>
  );
}

export default Signin;
