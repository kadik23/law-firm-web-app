"use client";
import ConsultationForm from "@/components/dashboard/consultationForm/ConsultationForm";
import RecentPayment from "@/components/dashboard/RecentPayment";
import Statistics from "@/components/dashboard/statistics";
import Modal from "@/components/Modal";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useState } from "react";

const Dashboard = () => {
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  
  const handleReservationForm = () => {
    setShowConsultationForm(true);
  }

  return (
    <div className="flex flex-col gap-4 mx-8 md:mx-0">
      <div className="flex flex-col md:flex-row gap-4 md:gap-4 justify-between">
        <div className="flex items-center gap-2">
          <Icon
            icon="material-symbols:dashboard-outline-rounded"
            width="36"
            height="36"
            className="text-secondary"
          />
          <div className="text-xl font-extrabold">Tableau de bord</div>
        </div>
        <button
          onClick={handleReservationForm} 
          className="bg-secondary w-fit rounded-lg py-2 px-4 text-white flex gap-2 items-center">
          <div className="font-semibold text-lg">Reserver Maitenant !</div>
          <Icon icon="ion:calendar-sharp" width="24" height="24" />
        </button>
        {showConsultationForm && (
          <Modal 
            isOpen={showConsultationForm} 
            onClose={() => setShowConsultationForm(false)} 
            isNotStepOne={true}
          >
            <ConsultationForm />
          </Modal>
        )}
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
export default Dashboard