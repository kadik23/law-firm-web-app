"use client";
import UnderPaymentModal from "@/components/dashboard/client/UnderPaymentModal";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UnderPaymentBoard from "@/components/dashboard/client/UnderPaymentsBoard";
import useUnderPayments from "@/hooks/clients/useUnderPayments";

function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const {getCount, count} = useUnderPayments();

  const navigateToPayments = () => {
    router.back();
  };

  useEffect(() => {
    getCount(Number(id));
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="ic:twotone-payments" width="36" height="36" />
          <div className="text-xl font-extrabold">Sous paiements</div>
        </div>
        <div className="bg-secondary rounded-lg py-2 px-4 text-white flex gap-2 items-center w-full md:w-fit text-xs md:text-base">
          <Icon icon="ic:twotone-payments" width="24" height="24" />{" "}
          <div className="font-semibold flex gap-1">
            Total de sous paiements: {count}
            <span className="hidden md:flex">paiments</span>
          </div>
        </div>
      </div>
      <div className="font-medium">
        {" "}
        Liste des Sous Paiements pour service: {id}
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button
            onClick={() => navigateToPayments()}
            className="bg-btnSecondary w-full md:w-fit text-white hover:opacity-75 text-sm px-4 py-1.5 rounded-md"
          >
            <span>Retour</span>
          </button>
          <button
            className="bg-btnSecondary w-full md:w-fit text-white hover:opacity-75 text-sm px-4 py-1.5 rounded-md
                    flex items-center gap-1"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <Icon icon="material-symbols:add" width={16} />
            <span>Ajouter un SOUS PAIEMENT</span>
          </button>
        </div>
      </div>
      <UnderPaymentModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <UnderPaymentBoard />
    </>
  );
}

export default Page;
