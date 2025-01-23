"use client"
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

const Account = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg font-semibold">Chargement...</span>
      </div>
    );
  }

  const infoToShow = [
    { label: "Nom", value: user.surname },
    { label: "Prénom", value: user.name },
    { label: "Sexe", value: user.sex },
    { label: "Pays", value: user.pays },
    { label: "Âge", value: user.age },
    { label: "Ville", value: user.ville },
    { label: "Numéro de téléphone", value: user.phone_number },
  ];

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="flex items-center gap-4">
        <Image
          src={"/images/profile.png"}
          alt="Profile Picture"
          className="rounded-full"
          style={{ objectFit: "cover" }}
          width={50}
          height={50}
        />
        <div className="flex flex-col gap-1">
          <span className="font-semibold">
            {`${user.name} ${user.surname}`}
          </span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6">
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

export default Account;
