"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";
import EditPersonalInfoModal from "@/components/dashboard/EditPersonalInfoModal";
import EditPasswordModal from "@/components/dashboard/EditPasswordModal";

const AdminAccount = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showEditInfo, setShowEditInfo] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  if (!user) {
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const infoToShow = [
    { label: "Nom", value: user?.surname },
    { label: "Prénom", value: user?.name },
    { label: "Sexe", value: user?.sex },
    { label: "Pays", value: user?.pays },
    { label: "Âge", value: user?.age },
    { label: "Ville", value: user?.ville },
    { label: "Numéro de téléphone", value: "0" + user?.phone_number },
  ];

  return (
    <div className="flex flex-col gap-10 w-full md:px-0 px-8">
      <div className="flex items-center gap-4">
        <button className="bg-secondary capitalize w-12 h-12 rounded-full text-center text-lg p-2 btn font-semibold shadow-lg">
          {user?.name[0]}
        </button>
        <div className="flex flex-col gap-1">
          <span className="font-semibold">
            {`${user?.name} ${user?.surname}`}
          </span>
          <span className="text-xs text-gray-500">{user?.email}</span>
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
        <div className="flex gap-4 mt-4">
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            onClick={() => setShowEditInfo(true)}
          >
            Modifier les informations personnelles
          </button>
          <button
            className="bg-gray-200 text-primary px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => setShowEditPassword(true)}
          >
            Modifier le mot de passe
          </button>
        </div>
      </div>
      {showEditInfo && (
        <EditPersonalInfoModal
          isOpen={showEditInfo}
          onClose={() => setShowEditInfo(false)}
          user={user as User}
        />
      )}
      {showEditPassword && (
        <EditPasswordModal
          isOpen={showEditPassword}
          onClose={() => setShowEditPassword(false)}
        />
      )}
    </div>
  );
};

export default AdminAccount;
