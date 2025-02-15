"use client";
import PaymentBoard from "@/components/dashboard/PaymentBoard";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { paymentData } from "@/consts/payments";
import PaymentModal from "@/components/dashboard/PaymentModal";
import { useState } from "react";
import UnderPaymentModal from "@/components/dashboard/UnderPaymentModal";

const Payments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnderPModalOpen, setIsUnderPModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="ic:twotone-payments" width="36" height="36" />
          <div className="text-xl font-extrabold">Paiements</div>
        </div>
        <div className="bg-secondary rounded-lg py-2 px-4 text-white flex gap-2 items-center">
          <Icon icon="ic:twotone-payments" width="24" height="24" />{" "}
          <div className="font-semibold">
            Total de paiements principaux: {paymentData.length} paiments
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="font-medium">Liste des Paiements Principaux</div>
        <div className="flex items-center gap-2">
          <div className="border-[1.5px] py-1 px-2 flex items-center rounded-md gap-2">
            <Icon icon="iconamoon:search-thin" width="20" height="20" />
            <input
              type="text"
              placeholder="Rechercher un paiement"
              className="outline-none border-none text-sm placeholder:text-xs"
            />
          </div>
          <button className="border border-black px-2 py-1 text-sm rounded-md">
            Filter
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="bg-btnSecondary text-white hover:opacity-75 text-sm px-4 py-1.5 rounded-md
                    flex items-center gap-1"
          >
            <Icon icon="material-symbols:add" width={16} />
            <span className="hidden md:flex">
              Ajouter un paiement principal
            </span>
          </button>
          <button
            className="bg-btnSecondary text-white hover:opacity-75 text-sm px-4 py-1.5 rounded-md
                    flex items-center gap-1"
            onClick={() => {
              setIsUnderPModalOpen(true);
            }}
          >
            <Icon icon="material-symbols:add" width={16} />
            <span className="hidden md:flex">Ajouter un SOUS PAIEMENT</span>
          </button>
        </div>
        <button
          className="bg-btnSecondary text-white hover:opacity-75 text-sm px-4 py-1.5 rounded-md
                    flex items-center gap-1"
        >
          <Icon icon="mdi:delete" width={16} />
          <span className="hidden md:flex">Supprimer tous</span>
        </button>
      </div>
      <PaymentModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <UnderPaymentModal
        isModalOpen={isUnderPModalOpen}
        setIsModalOpen={setIsUnderPModalOpen}
      />
      <PaymentBoard paymentData={paymentData} />
    </div>
  );
};

export default Payments;
