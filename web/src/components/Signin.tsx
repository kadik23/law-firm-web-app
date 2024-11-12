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
  const { register, control, handleSubmit, errors, watch } = useLoginForm();
  const validate = () => {
    if (
      errors.email ||
      errors.password ||
      !watch().email ||
      !watch().password
    ) {
      console.log(errors);
      setIsDisabled(true);
      return false;
    }
    setIsDisabled(false);
    return true;
  };

  const onsubmit = async (data: SigninformType) => {
    try {
      console.log("first submit ", data);
      const response = await axiosClient.post("/user/signin", {
        email: data.email,
        password: data.password,
      });
      if (response.status == 200) {
        alert("Success sign in");
        const token = response.data.token;
        console.log("Token:", token);
        localStorage.setItem("authToken", token);
        setModalOpen(false);
      } else {
        alert(response);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
      validate();
  }, [watch]);
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      isNotStepOne={isModalOpen}
    >
      <form
        onSubmit={handleSubmit(onsubmit)}
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
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Format d'email invalide",
              },
              validate: {
                notAdmin: (fieldValue) => {
                  return (
                    fieldValue !== "admin@example.com" ||
                    "Enter a different email address"
                  );
                },
                notBlackListed: (fieldValue) => {
                  return (
                    !fieldValue.endsWith("baddomain.com") ||
                    "this Domain is not supported"
                  );
                },
              },
            })}
            placeholder="Enter votre email"
            className="py-1 px-4 outline-none text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
          />
        </div>
        <div className="flex flex-col justify-start gap-2 w-full">
          <div className="text-textColor text-sm font-semibold">
            Mot de passe
          </div>
          <input
            type="password"
            placeholder="Enter votre mot de passe"
            {...register("password", {
              required: "password est requis",
              minLength: {
                value: 8,
                message: "This input must exceed 8 characters",
              },
            })}
            className="py-1 px-4 outline-none text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>
        <button
          className={`${
            isDisabled ? "btn_desabled active:scale-100" : "btn bg-textColor"
          }
          text-sm rounded-md p-2 btn font-semibold shadow-lg w-full`}
        >
          Se connectez
        </button>
      </form>
      <div className="flex gap-2 items-center justify-center mt-4 text-sm font-semibold w-full">
        Vous n{"'"}avez pas encore de compte ?
        <div className="text-textColor underline ">Inscrivez-vous</div>{" "}
      </div>
    </Modal>
  );
}

export default Signin;
