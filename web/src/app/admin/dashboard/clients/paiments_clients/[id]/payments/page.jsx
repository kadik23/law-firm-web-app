"use client";
import PaymentBoard from "@/components/dashboard/client/PaymentBoard";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useEffect } from "react";
import usePayments from "@/hooks/clients/usePayments";

const Page = () => {
    const { count, getCount } = usePayments();

    useEffect(() => {
        getCount();
    }, [])

    return (
        <>
            <div className="flex flex-col md:flex-row gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <Icon icon="ic:twotone-payments" width="36" height="36" />
                    <div className="text-xl font-extrabold">Paiements</div>
                </div>
                <div className="bg-primary rounded-lg py-2 px-4 text-white flex gap-2 items-center w-full md:w-fit text-xs md:text-base">
                    <Icon icon="ic:twotone-payments" width="24" height="24" />{" "}
                    <div className="font-semibold flex gap-1">
                        Total de paiements principaux: {count}{" "}
                        <span className="hidden md:flex">paiments</span>
                    </div>
                </div>
            </div>
            <div className="font-medium mb-4">Liste des Paiements Principaux</div>
            <PaymentBoard />
        </>
    );
};

export default Page;
