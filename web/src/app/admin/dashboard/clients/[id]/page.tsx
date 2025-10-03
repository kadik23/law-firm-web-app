"use client";
import axiosClient from "@/lib/utils/axiosClient";
import { isAxiosError } from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { id } = useParams();
  const [client, setClient] = useState<User | null>(null);
  useEffect(()=>{
    const fetchClient = async () => {
        try {
            const response = await axiosClient.get(`/admin/assigned_services/client/${id}`);
            setClient(response.data);
        } catch (err: unknown) {
            if (isAxiosError(err) && err.response?.status === 401) {
                console.warn("Users not found");
            } else {
                console.error("An unexpected error occurred:", err);
            }
            setClient(null);
        }
    };
    fetchClient()
  },[id])

  const infoToShow = [
    { label: "Nom", value: client?.surname },
    { label: "Prénom", value: client?.name },
    { label: "Sexe", value: client?.sex },
    { label: "Pays", value: client?.pays },
    { label: "Âge", value: client?.age },
    { label: "Ville", value: client?.ville },
    { label: "Numéro de téléphone", value: "0" + client?.phone_number },
  ];

  return (
    <div className="flex flex-col gap-10 w-full md:px-0 px-8">
      <div className="flex items-center gap-4">
        <button className="bg-secondary capitalize w-12 h-12 rounded-full text-center text-lg p-2 btn font-semibold shadow-lg">
          {client?.name[0]}
        </button>
        <div className="flex flex-col gap-1">
          <span className="font-semibold">
            {`${client?.name} ${client?.surname}`}
          </span>
          <span className="text-xs text-gray-500">{client?.email}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoToShow.map((info, index) => (
            <div key={index} className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{info.label}</span>
              <div className="text-sm uppercase w-full bg-[#F9F9F9] py-3 px-4 rounded-lg">
                {info.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
