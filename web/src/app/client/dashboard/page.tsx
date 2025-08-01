"use client";
import ConsultationForm from "@/components/dashboard/client/consultationForm/ConsultationForm";
import RecentPayment from "@/components/dashboard/client/RecentPayment";
import Statistics from "@/components/dashboard/client/statistics";
import Modal from "@/components/Modal";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useState } from "react";
import { useConsultations } from "@/hooks/clients/useConsultations";
import Link from "next/link";

const Dashboard = () => {
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const { consultations, loading: consultationsLoading } = useConsultations();
  
  const handleReservationForm = () => {
    setShowConsultationForm(true);
  }

  return (
    <div className="flex flex-col gap-4 mx-8 md:mx-0">
      {/* Short list of consultations */}
      <div className="bg-white rounded-lg shadow p-4 mb-2">
        <div className="font-bold text-primary mb-2">Mes consultations à venir</div>
        {consultationsLoading ? (
          <div className="text-gray-500">Chargement...</div>
        ) : consultations.length === 0 ? (
          <div className="text-gray-500">Aucune consultation à venir.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {consultations.slice(0, 3).map((c: any) => (
              <li key={c.id} className="py-2 flex flex-col md:flex-row md:items-center md:gap-4">
                <span className="font-semibold text-sm text-primary">{c.date} {c.time}</span>
                <span className="text-sm flex-1">{c.problem_name || c.problem_description}</span>
                <span className={`text-xs px-2 py-1 rounded ${c.status === "Accepted" ? "bg-green-100 text-green-700" : c.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{c.status}</span>
                {c.mode === "online" && c.meeting_link && (
                  <a
                    href={c.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline ml-2 text-xs"
                  >
                    Rejoindre la réunion
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
        {consultations.length > 3 && (
          <div className="mt-2 text-right">
            <Link href="/client/dashboard/consultations" className="text-primary underline text-sm">Voir tout</Link>
          </div>
        )}
      </div>
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