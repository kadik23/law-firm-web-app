"use client";
import React, { useState } from "react";
import Modal from "./Modal";

interface SignupProps {
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUploadFiles: boolean;
}

function Signup({ isModalOpen, setModalOpen, isUploadFiles }: SignupProps) {
  const [steps, setSteps] = useState([
    {
      component: (
        <StepOne setModalOpen={setModalOpen} moveNewStep={moveNewStep} />
      ),
      isTrue: true,
    },
    {
      component: (
        <StepTwo
          setModalOpen={setModalOpen}
          moveNewStep={moveNewStep}
          isUploadFiles={isUploadFiles}
        />
      ),
      isTrue: false,
    },
    {
      component: (
        <StepThree setModalOpen={setModalOpen} moveNewStep={moveNewStep} />
      ),
      isTrue: false,
    },
  ]);

  function moveNewStep(currentStep: number, nextStep: number) {
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      isTrue: index === nextStep - 1,
    }));
    setSteps(updatedSteps);
  }
  const currentStep = steps.find((step) => step.isTrue);
  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      isNotStepOne={!steps[0].isTrue}
    >
      {currentStep?.component}
    </Modal>
  );
}

export default Signup;

function StepOne({
  setModalOpen,
  moveNewStep,
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  moveNewStep: (currentStep: number, nextStep: number) => void;
}) {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="text-xl">Crée un compte</div>
      <div>Entrer vos informations svp !</div>
      <div className="flex gap-4 md:gap-16 w-full">
        <div className="flex flex-col justify-start gap-2">
          <div className="text-textColor text-sm font-semibold">Name</div>
          <input
            type="text"
            placeholder="Enter votre name"
            className="py-1 px-4 w-full outline-none text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
          />
        </div>
        <div className="flex flex-col justify-start gap-2">
          <div className="text-textColor text-sm font-semibold">Surname</div>
          <input
            type="text"
            placeholder="Enter votre surname"
            className="py-1 px-4 w-full outline-none text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
          />
        </div>
      </div>
      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Email</div>
        <input
          type="email"
          placeholder="Enter votre email"
          className="py-1 px-4 outline-none text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
      </div>
      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Mot de passe</div>
        <input
          type="text"
          placeholder="Enter votre mot de passe"
          className="py-1 px-4 outline-none text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
      </div>
      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Mot de passe</div>
        <input
          type="text"
          placeholder="Confirmer votre mot de passe"
          className="py-1 px-4 outline-none text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
      </div>
      <div className="flex flex-row items-center justify-between w-full gap-8">
        <button
          onClick={() => setModalOpen(false)}
          className="bg-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
        >
          Annuler
        </button>
        <button
          onClick={() => moveNewStep(1, 2)}
          className="bg-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
        >
          Suivant
        </button>
      </div>
      <div className="flex gap-2 items-center justify-center text-sm font-semibold w-full">
        Avez vous déja un compte?{" "}
        <div className="text-textColor underline ">Connectez</div>{" "}
      </div>
    </div>
  );
}

function StepTwo({
  setModalOpen,
  moveNewStep,
  isUploadFiles,
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  moveNewStep: (currentStep: number, nextStep: number) => void;
  isUploadFiles: boolean;
}) {
  return (
    <div className="flex flex-col items-start gap-4 md:w-[32rem]">
      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">
          Numéro de telephone
        </div>
        <input
          type="text"
          placeholder="Entre votre numéro de telephone"
          className="py-1 px-4 outline-none w-full text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
      </div>
      <div className="flex flex-col justify-start gap-2  w-full">
        <div className="text-textColor text-sm font-semibold">Pays</div>
        <input
          type="text"
          placeholder="Enter votre pays"
          className="py-1 px-4 outline-none w-full text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
      </div>
      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Ville</div>
        <input
          type="text"
          placeholder="Enter votre ville"
          className="py-1 px-4 outline-none w-full text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
      </div>
      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Age</div>
        <input
          type="text"
          placeholder="Enter votre age"
          className="py-1 px-4 outline-none w-full text-sm md:text-base text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
      </div>
      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Sex</div>
        <div className="flex items-center w-full justify-center text-sm md:text-base gap-4">
          <div className="flex items-center gap-2">
            <div>Home</div>
            <input type="radio" name="gender" />
          </div>
          <div className="flex items-center gap-2">
            <div>Femme</div>
            <input type="radio" name="gender" />
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center gap-2 w-full">
        <input type="checkbox" />
        <div className="text-textColor text-sm font-semibold">
          J’accepte tout
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center justify-between w-full gap-8">
          <button
            onClick={() => moveNewStep(2, 1)}
            className="bg-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
          >
            Retour
          </button>
          {isUploadFiles ? (
            <button
              onClick={() => moveNewStep(2, 3)}
              className="bg-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
            >
              Suivant
            </button>
          ) : (
            <button
              onClick={() => setModalOpen(false)}
              className="bg-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
            >
              Crée
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepThree({
  setModalOpen,
  moveNewStep,
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  moveNewStep: (currentStep: number, nextStep: number) => void;
}) {
  return (
    <div className="flex flex-col justify-start gap-8 w-[32rem]">
      <div className="flex flex-col justify-start gap-2 w-full">
        <div className="text-textColor text-sm font-semibold">Fichiers</div>
        <input
          type="file"
          className="py-1 px-4 outline-none text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
        />
      </div>
      <div className="hidden md:flex flex-col items-center justify-between gap-4 w-full">
        <div className="hidden md:flex items-center justify-between w-full gap-8">
          <button
            onClick={() => moveNewStep(2, 1)}
            className="bg-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
          >
            Retour
          </button>
        </div>
        <button
          onClick={() => setModalOpen(false)}
          className="bg-third text-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
        >
          Crée
        </button>
      </div>
    </div>
  );
}
