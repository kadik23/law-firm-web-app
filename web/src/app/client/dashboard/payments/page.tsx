"use client";
import PaymentBoard from "@/components/dashboard/client/PaymentBoard";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import PaymentModal from "@/components/dashboard/client/PaymentModal";
import { useEffect, useState } from "react";
import UnderPaymentModal from "@/components/dashboard/client/UnderPaymentModal";
import usePayments from "@/hooks/clients/usePayments";

const Payments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnderPModalOpen, setIsUnderPModalOpen] = useState(false);
  const { count, getCount } = usePayments();

  useEffect(()=>{
    getCount();
  },[])

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="ic:twotone-payments" width="36" height="36" />
          <div className="text-xl font-extrabold">Paiements</div>
        </div>
        <div className="bg-secondary rounded-lg py-2 px-4 text-white flex gap-2 items-center w-full md:w-fit text-xs md:text-base">
          <Icon icon="ic:twotone-payments" width="24" height="24" />{" "}
          <div className="font-semibold flex gap-1">
            Total de paiements principaux: {count}{" "}
            <span className="hidden md:flex">paiments</span>
          </div>
        </div>
      </div>
      <div className="font-medium">Liste des Paiements Principaux</div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="bg-btnSecondary w-full md:w-fit text-white hover:opacity-75 text-sm px-4 py-1.5 rounded-md
                    flex items-center gap-1"
          >
            <Icon icon="material-symbols:add" width={16} />
            <span>Ajouter un paiement principal</span>
          </button>
          <button
            className="bg-btnSecondary w-full md:w-fit text-white hover:opacity-75 text-sm px-4 py-1.5 rounded-md
                    flex items-center gap-1"
            onClick={() => {
              setIsUnderPModalOpen(true);
            }}
          >
            <Icon icon="material-symbols:add" width={16} />
            <span>Ajouter un SOUS PAIEMENT</span>
          </button>
        </div>
      </div>
      <PaymentModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <UnderPaymentModal
        isModalOpen={isUnderPModalOpen}
        setIsModalOpen={setIsUnderPModalOpen}
      />
      <PaymentBoard/>
    </>
  );
};

export default Payments;
