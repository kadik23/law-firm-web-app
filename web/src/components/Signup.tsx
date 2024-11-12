"use client";
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import useRegisterForm from "@/hooks/useRegisterForm";
import { DevTool } from "@hookform/devtools";
import {
  FieldErrors,
  useFieldArray,
} from "react-hook-form";
import axiosClient from "@/lib/utils/axiosClient";

interface SignupProps {
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUploadFiles: boolean;
}

function Signup({ isModalOpen, setModalOpen, isUploadFiles }: SignupProps) {
  const { register, control, handleSubmit, errors, watch } =
    useRegisterForm();

  const [formStep, setFormStep] = useState(0);

  useEffect(() => {
    const subscription = watch((value) => {
      console.log("Watched values:", value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const [isDisabled1, setIsDisabled1] = useState(true);
  const [isDisabled2, setIsDisabled2] = useState(true);
  const [isDisabled3, setIsDisabled3] = useState(true);

  const validateSteps = (stepName: 'stepOne' |'stepTwo' | 'stepThree', currentStep: number,toNextStep = false) => {
    const stepData = watch()[stepName];
    const stepErrors = errors[stepName] || {};
  
    const hasErrors = Object.values(stepErrors).some(error => error);
    const hasEmptyFields = Object.values(stepData).some(value => !value);
  
    if (stepName === "stepOne") {
      setIsDisabled1(hasErrors || hasEmptyFields);
    } else if (stepName === "stepTwo") {
      setIsDisabled2(hasErrors || hasEmptyFields);
    } else if (stepName === "stepThree") {
      setIsDisabled3(hasErrors || hasEmptyFields);
    }
  
    if (!hasErrors && !hasEmptyFields && toNextStep) {
      moveNewStep(currentStep, currentStep + 1);
    }
  
    return !hasErrors && !hasEmptyFields;
  };  

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stepThree.files",
  });

  const onError = (errors: FieldErrors<SignupformType>) => {
    console.log(errors);
  };

  const onsubmit = async (data: SignupformType) => {
    try{
      console.log("first submit ", data);
      const response = await axiosClient.post("/user/signup",{
        name: data.stepOne.name,
        surname: data.stepOne.surname,
        email: data.stepOne.email,
        password: data.stepOne.password,
        phone_number: data.stepTwo.nbr_tel,
        pays: data.stepTwo.pays,
        ville: data.stepTwo.ville,
        age: data.stepTwo.age,
        sex: data.stepTwo.gender == 'Femal' ? 'Femme' : 'Homme',
        terms_accepted: true,
      });
      if(response.status == 200){
        alert("Success sign in")
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        setModalOpen(false);
      }else {
        alert(response.data)
      }
    }catch(err){
      console.log(err)
    }
  };

  function moveNewStep(currentStep: number, nextStep: number) {
    setFormStep(nextStep);
  }

  useEffect(() => {
    if(formStep == 0){
      validateSteps('stepOne',formStep,false);
    }else if(formStep == 1){
      validateSteps('stepTwo',formStep,false);
    }else{
      validateSteps('stepThree',formStep,false);
    }
  }, [watch]);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      isNotStepOne={formStep !== 0}
    >
      {formStep == 0 && (
        <div className="flex flex-col items-start gap-4">
          {process.env.NODE_ENV === "development" && (
            <DevTool control={control} />
          )}
          {/* {JSON.stringify(watch(), null, 2)} */}
          <div className="text-xl">Crée un compte</div>
          <div>Entrer vos informations svp !</div>
          <div className="flex gap-4 md:gap-16 w-full">
            <div className="flex flex-col justify-start gap-2">
              <label
                htmlFor="name"
                className="text-textColor text-sm font-semibold"
              >
                Nom
              </label>
              <input
                type="text"
                id="name"
                {...register("stepOne.name", {
                  required: "nom est requis",
                })}
                placeholder="Enter votre nom"
                className="py-1 px-4 w-full outline-none text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
              />
              {errors.stepOne?.name && (
                <p className="error">{errors.stepOne.name.message}</p>
              )}
            </div>
            <div className="flex flex-col justify-start gap-2">
              <label
                htmlFor="surname"
                className="text-textColor text-sm font-semibold"
              >
                Prénom
              </label>
              <input
                type="text"
                id="surname"
                {...register("stepOne.surname", {
                  required: "prénom est requis",
                })}
                placeholder="Enter votre prénom"
                className="py-1 px-4 w-full outline-none text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
              />
              {errors.stepOne?.surname?.message && (
                <p className="error" style={{ color: "red" }}>
                  {errors.stepOne.surname.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-start gap-2 w-full">
            <label
              htmlFor="email"
              className="text-textColor text-sm font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("stepOne.email", {
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
              className="py-1 px-4 outline-none text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
            />
            {errors.stepOne?.email?.message && (
              <p className="error">{errors.stepOne?.email?.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-start gap-2 w-full">
            <label
              htmlFor="password"
              className="text-textColor text-sm font-semibold"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              {...register("stepOne.password", {
                required: "password est requis",
                minLength: {
                  value: 8,
                  message: "This input must exceed 8 characters",
                },
              })}
              placeholder="Enter votre mot de passe"
              className="py-1 px-4 outline-none text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
            />
            {errors.stepOne?.password && (
              <p className="error">{errors.stepOne?.password?.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-start gap-2 w-full">
            <label
              htmlFor="conpassword"
              className="text-textColor text-sm font-semibold"
            >
              Confirm Mot de passe
            </label>
            <input
              type="password"
              id="conpassword"
              {...register("stepOne.conpassword", {
                required: "Confirmation du mot de passe est requis",
                minLength: {
                  value: 8,
                  message: "Ce champ doit contenir au moins 8 caractères",
                },
                validate: (value) =>
                  value === watch("stepOne.password") ||
                  "Les mots de passe ne correspondent pas",
              })}
              placeholder="Confirmer votre mot de passe"
              className="py-1 px-4 outline-none text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
            />
            {errors.stepOne?.conpassword?.message && (
              <p className="error">{errors.stepOne?.conpassword?.message}</p>
            )}{" "}
          </div>
          <div className="flex flex-row items-center justify-between w-full gap-8">
            <button
              onClick={() => setModalOpen(false)}
              className="bg-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
            >
              Annuler
            </button>
            <button
              onClick={async () => {
                const isValid = await validateSteps('stepOne',0,true);
                if (isValid) {
                  moveNewStep(0, 1);
                } else {
                  console.log("Please fix the errors before proceeding.");
                }
              }}
              disabled={isDisabled1}
              className={`${
                isDisabled1
                  ? "btn_desabled active:scale-100"
                  : "btn bg-textColor"
              }  text-sm rounded-md p-2 btn font-semibold shadow-lg w-full `}
            >
              Suivant
            </button>
          </div>
          <div className="flex gap-2 items-center justify-center text-sm font-semibold w-full">
            Avez vous déja un compte?
            <div className="text-textColor underline ">Connectez</div>{" "}
          </div>
        </div>
      )}
      {formStep == 1 && (
        <form
          onSubmit={handleSubmit(onsubmit, onError)}
          className="flex flex-col items-start gap-4 md:w-[32rem]"
        >
          {process.env.NODE_ENV === "development" && (
            <DevTool control={control} />
          )}
          <div className="flex flex-col justify-start gap-2 w-full">
            <label
              htmlFor="nbr_tel"
              className="text-textColor text-sm font-semibold"
            >
              Numéro de téléphone
            </label>
            <input
              id="nbr_tel"
              type="number"
              placeholder="Enter votre numéro de téléphone"
              {...register("stepTwo.nbr_tel", {
                required: "Numéro de téléphone est requis",
                valueAsNumber: true,
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Format de téléphone invalide",
                },
              })}
              className="py-1 px-4 outline-none w-full text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
            />
            {errors.stepTwo?.nbr_tel?.message && (
              <p className="error">{errors.stepTwo.nbr_tel.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-start gap-2  w-full">
            <label
              htmlFor="pays"
              className="text-textColor text-sm font-semibold"
            >
              Pays
            </label>
            <input
              id="pays"
              type="text"
              placeholder="Enter votre pays"
              {...register("stepTwo.pays", {
                required: "pays est requis",
              })}
              className="py-1 px-4 outline-none w-full text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
            />{" "}
            {errors.stepTwo?.pays?.message && (
              <p className="error">{errors.stepTwo?.pays?.message}</p>
            )}{" "}
          </div>
          <div className="flex flex-col justify-start gap-2 w-full">
            <label
              htmlFor="ville"
              className="text-textColor text-sm font-semibold"
            >
              Ville
            </label>
            <input
              type="text"
              id="ville"
              placeholder="Enter votre ville"
              {...register("stepTwo.ville", {
                required: "ville est requis",
              })}
              className="py-1 px-4 outline-none w-full text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
            />{" "}
            {errors.stepTwo?.ville?.message && (
              <p className="error">{errors.stepTwo?.ville?.message}</p>
            )}{" "}
          </div>
          <div className="flex flex-col justify-start gap-2 w-full">
            <label
              htmlFor="age"
              className="text-textColor text-sm font-semibold"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              placeholder="Enter votre age"
              {...register("stepTwo.age", {
                required: "age est requis",
                valueAsNumber: true,
              })}
              className="py-1 px-4 outline-none w-full text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
            />
            {errors.stepTwo?.age?.message && (
              <p className="error">{errors.stepTwo?.age?.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-start gap-2 w-full">
            <div className="text-textColor text-sm font-semibold">Gender</div>
            <div className="flex items-center w-full gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("stepTwo.gender", {
                    required: "Sexe est requis",
                  })}
                  value="Male"
                />
                Homme
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("stepTwo.gender", {
                    required: "Sexe est requis",
                  })}
                  value="Female"
                />
                Femme
              </label>
            </div>
            {errors.stepTwo?.gender?.message && (
              <p className="error">{errors.stepTwo?.gender?.message}</p>
            )}{" "}
          </div>
          <div className="flex justify-start items-center gap-2 w-full">
            <input type="checkbox" required/>
            <div className="text-textColor text-sm font-semibold">
              J’accepte tout
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center justify-between w-full gap-8">
              <button
                onClick={() => moveNewStep(1, 0)}
                className="bg-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
              >
                Retour
              </button>
              {isUploadFiles ? (
                <button
                  onClick={() => validateSteps('stepTwo',1,true)}
                  className={`${
                    isDisabled2
                      ? "btn_desabled active:scale-100"
                      : "btn bg-textColor"
                  }  text-sm rounded-md p-2 btn font-semibold shadow-lg w-full `}
                  disabled={isDisabled2}
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isDisabled2}
                  className={`${
                    isDisabled2
                      ? "btn_desabled active:scale-100"
                      : "btn bg-textColor"
                  }  text-sm rounded-md p-2 btn font-semibold shadow-lg w-full `}
                >
                  Crée
                </button>
              )}
            </div>
          </div>
        </form>
      )}
      {formStep == 2 && (
        <form
          onSubmit={handleSubmit(onsubmit, onError)}
          className="flex flex-col justify-start gap-8 w-[32rem]"
        >
          {process.env.NODE_ENV === "development" && (
            <DevTool control={control} />
          )}
          {fields.map((item, index) => (
            <div
              className="flex flex-col justify-start gap-2 w-full"
              key={item.id}
            >
              <div className="text-textColor text-sm font-semibold">
                Fichiers
              </div>
              <input
                type="file"
                {...register(`stepThree.files.${index}`)}
                className="py-1 px-4 outline-none text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
              />
              {index > 0 && (
                <button type="button" onClick={() => remove(index)}>
                  Remove File
                </button>
              )}
              <button type="button" onClick={() => append({})}>
                Add File
              </button>
            </div>
          ))}
          <div className="hidden md:flex flex-col items-center justify-between gap-4 w-full">
            <div className="hidden md:flex items-center justify-between w-full gap-8">
              <button
                onClick={() => validateSteps('stepThree',2,true)}
                className="bg-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
              >
                Retour
              </button>
            </div>
            <button
              type="submit"
              className={`${
                isDisabled3
                  ? "btn_desabled active:scale-100"
                  : "btn bg-third text-textColor"
              }  text-sm rounded-md p-2 btn font-semibold shadow-lg w-full `}
              disabled={isDisabled3}
            >
              Crée
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default Signup;
