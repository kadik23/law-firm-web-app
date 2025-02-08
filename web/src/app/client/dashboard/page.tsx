"use client";
import RecentPayment from "@/components/dashboard/RecentPayment";
import Statistics from "@/components/dashboard/Statistics";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols:dashboard-outline-rounded"
            width="36"
            height="36"
            className="text-secondary"
          />
          <div className="text-xl font-extrabold">Tableau de bord</div>
        </div>
        <div className="bg-secondary rounded-lg py-2 px-4 text-white flex gap-2 items-center">
          <div className="font-semibold text-lg">Reserver Now !</div>
          <Icon icon="ion:calendar-sharp" width="24" height="24" />
        </div>
      </div>
      <div className="font-semibold text-sm">
        Pour assurer un bon traitement de votre dossier vous pouvez réserver une
        consultation en cliquant sur réserver{" "}
      </div>
      <Statistics />
      <RecentPayment/>
    </div>
  );
};

export default Dashboard;