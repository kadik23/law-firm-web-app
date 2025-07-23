import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React from "react";
import Modal from "../../Modal";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function UnderPaymentModal({ isModalOpen, setIsModalOpen }: Props) {
  const isDisabled= true;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      isNotStepOne={true}
    >
      <div className="px-8 md:py-4 py-8 flex flex-col items-center gap-4 rounded-md">
        <div className="text-white font-medium text-sm">
          Enregistrez votre paiement en remplissant ce formulaire
        </div>
        <div className="flex flex-col md:flex-row w-full items-center gap-2">
          <div className="flex items-center w-full text-white relative py-2 px-2 border rounded-sm border-white">
            <div className="bg-[#2C3E50] absolute text-xs -top-2 left-2">
              Montant payé
            </div>
            <input
              type="number"
              className="bg-transparent w-full py-2  outline-none"
            />
            <div>DA</div>
          </div>
          <div className="flex items-center w-full text-white relative py-2 px-2 border rounded-sm border-white">
            <div className="bg-[#2C3E50] absolute text-xs -top-2 left-2">
              Date de paiment
            </div>
            <style>
              {`
                /* Target the calendar button (works in Chrome/Edge) */
                input[type="date"]::-webkit-calendar-picker-indicator {
                  filter: invert(1);  /* Makes the icon white */
                  cursor: pointer;
                }

                /* For Firefox */
                input[type="date"]::-moz-calendar-picker-indicator {
                  filter: invert(1);
                }

                /* Remove the default calendar icon in some browsers */
                input[type="date"]::-webkit-inner-spin-button,
                input[type="date"]::-webkit-clear-button {
                  display: none;
                }
              `}
            </style>
            <input
              type="date"
              className="bg-transparent py-2 w-full outline-none"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 w-full">
          <div className="w-full justify-between text-white relative py-2 px-2 border rounded-sm border-white">
            <div className="bg-[#2C3E50] absolute text-xs -top-2 left-2">
              Service Associé
            </div>
            <select className="bg-transparent py-2 w-full cursor-pointer outline-none">
              <option value="service 1"> service 1</option>
            </select>
          </div>
          <div className="w-full justify-between text-white relative py-2 px-2 border rounded-sm border-white">
            <div className="bg-[#2C3E50] absolute text-xs -top-2 left-2">
              Statut
            </div>
            <select className="bg-transparent py-2 w-full cursor-pointer outline-none">
              <option value="service 1"> Fini</option>
              <option value="service 2"> Non fini</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-2">
          <button
            type="submit"
            className={`${
              isDisabled
                ? "btn_desabled active:scale-100"
                : "btn bg-third text-textColor"
            }  text-sm rounded-md text-nowrap p-2 btn font-semibold shadow-lg w-full flex items-center justify-center gap-2`}
            disabled={isDisabled}
          >
            <Icon icon="material-symbols:upload" width="24" height="24" />
            Payer avec baridi mob
          </button>
          <div className="items-center justify-between w-full gap-8">
            <button
              onClick={() => {
                setIsModalOpen(false);
              }}
              className="text-textColor bg-white text-sm rounded-md py-3 p-2 btn font-semibold shadow-lg w-full"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default UnderPaymentModal;
