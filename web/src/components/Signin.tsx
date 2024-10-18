"use client";
import Modal from "./Modal";

interface SigninProps {
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Signin({ isModalOpen, setModalOpen }: SigninProps) {

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      isNotStepOne={isModalOpen}
    >
      <div className="flex flex-col items-start gap-4">
        <div className="text-xl">Re-bienvenue</div>
        <div>Entrer vos informations svp !</div>
        <div className="flex gap-16"></div>
        <div className="flex flex-col justify-start gap-2 w-full">
          <div className="text-textColor text-sm font-semibold">Email</div>
          <input
            type="email"
            placeholder="Enter votre email"
            className="py-1 px-4 outline-none text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
          />
        </div>
        <div className="flex flex-col justify-start gap-2 w-full">
          <div className="text-textColor text-sm font-semibold">
            Mot de passe
          </div>
          <input
            type="text"
            placeholder="Enter votre mot de passe"
            className="py-1 px-4 outline-none text-white rounded-lg border border-white placeholder:text-sm bg-transparent"
          />
        </div>
          <button
            className="bg-textColor text-sm rounded-md p-2 btn font-semibold shadow-lg w-full"
          >
            Se connectez
          </button>
        </div>
        <div className="flex gap-2 items-center justify-center mt-4 text-sm font-semibold w-full">
          Vous n{"'"}avez pas encore de compte ?
          <div className="text-textColor underline ">Inscrivez-vous</div>{" "}
        </div>
    </Modal>
  );
}

export default Signin;