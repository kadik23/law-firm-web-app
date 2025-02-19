"use client";
import UnderPaymentModal from "@/components/dashboard/UnderPaymentModal";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useState } from "react";
import { underPayments } from "@/consts/payments";
import { useParams, useRouter } from "next/navigation";
import UnderPaymentBoard from "@/components/dashboard/UnderPaymentsBoard";

function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const navigateToPayments = () => {
    router.back();
  };
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
            Total de sous paiements: {underPayments.length}
            <span className="hidden md:flex">paiments</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        <div className="font-medium">
          {" "}
          Liste des Sous Paiements pour service: {id}
        </div>
        <div className="flex items-center gap-4 md:gap-2">
          <div className="border-[1.5px] py-1 px-2 flex items-center rounded-md gap-2">
            <Icon icon="iconamoon:search-thin" width="20" height="20" />
            <input
              type="text"
              placeholder="Rechercher un paiement"
              className="outline-none border-none text-sm placeholder:text-xs"
            />
          </div>
          <button className="border border-black hover:bg-black hover:text-white px-2 py-1 text-sm rounded-md">
            Filter
          </button>
        </div>
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
        <button
          className="bg-btnSecondary text-white hover:opacity-75 text-sm px-4 py-1.5 rounded-md
                    flex items-center gap-1"
        >
          <Icon icon="mdi:delete" width={16} />
          <span>Supprimer tous</span>
        </button>
      </div>
      <UnderPaymentModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <UnderPaymentBoard underPayments={underPayments} />
    </>
  );
}

export default Page;
