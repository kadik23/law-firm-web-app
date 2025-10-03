import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import useCreatePayment from "@/hooks/clients/useCreatePayment";
import { useRouter } from "next/navigation";
import { useAssignService } from "@/hooks/clients/useAssignService";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function PaymentModal({ isModalOpen, setIsModalOpen }: Props) {
  const router = useRouter();
  const { assignServices,fetchAssignService } = useAssignService();
  const { createPayment, loading } = useCreatePayment();

  const [requestServiceId, setRequestServiceId] = useState<number | "">("");
  const [paymentMethod, setPaymentMethod] = useState<"CIB" | "EDAHABIYA" | "">("");
  const [paymentType, setPaymentType] = useState<"FULL" | "PARTIAL" | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  const isDisabled = !requestServiceId || !paymentMethod || !paymentType || !amount || loading;

  const onSubmit = async () => {
    if (isDisabled) return;
    setError(null);
    try {
      const payload: {
        request_service_id: number;
        payment_method: "CIB" | "EDAHABIYA";
        payment_type: "FULL" | "PARTIAL";
        amount: number;
      } = {
        request_service_id: Number(requestServiceId),
        payment_method: paymentMethod as "CIB" | "EDAHABIYA",
        payment_type: paymentType as "FULL" | "PARTIAL",
        amount: Number(amount),
      };
      const data = await createPayment(payload);
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      setIsModalOpen(false);
      router.refresh();
    } catch (e: unknown) {
      type ApiError = { response?: { data?: { error?: string } } };
      const err = e as ApiError | Error;
      const apiError = (err as ApiError).response?.data?.error;
      const fallback = (err as Error).message;
      setError(apiError || fallback || "Erreur de paiement");
    }
  };

  useEffect(()=>{
    fetchAssignService()
  },[])

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      isNotStepOne={true}
    >
      <div className="px-8 py-8 md:py-4 flex flex-col items-center gap-4 rounded-md">
        <div className="text-white font-semibold">
          Ajouter votre paiement totale
        </div>
        <div className="flex items-center w-full text-white relative py-2 px-2 border rounded-sm border-white">
          <div className="bg-[#2C3E50] absolute text-xs -top-2 left-2">Montant</div>
          <input
            placeholder="Entrez le montant"
            type="number"
            className="bg-transparent py-2 w-full outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <div>DA</div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:gap-2 gap-4 w-full">
          <div className="w-full justify-between text-white relative py-2 px-2 border rounded-sm border-white">
            <div className="bg-[#2C3E50] absolute text-xs -top-2 left-2">Service Associé</div>
            <select
              className="bg-transparent w-full  py-2 cursor-pointer outline-none"
              value={requestServiceId}
              onChange={(e) => setRequestServiceId(e.target.value === "" ? "" : Number(e.target.value))}
            >
              <option className="text-primary" value="">Choisir un service</option>
              {assignServices.map((service) => (
                <option className="text-primary" key={service.request_service_id} value={service.request_service_id}>
                  {service.name} - {service?.price} DZD
                </option>
              ))}
            </select>
          </div>
          <div className="w-full justify-between text-white relative py-2 px-2 border rounded-sm border-white">
            <div className="bg-[#2C3E50] absolute text-xs -top-2 left-2">Méthode</div>
            <select
              className="bg-transparent w-full py-2 cursor-pointer outline-none"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as "CIB" | "EDAHABIYA")}
            >
              <option className="text-primary" value="">Choisir un Méthode</option>
              <option className="text-primary" value="CIB">CIB</option>
              <option className="text-primary" value="EDAHABIYA">EDAHABIYA</option>
            </select>
          </div>
          <div className="w-full justify-between text-white relative py-2 px-2 border rounded-sm border-white">
            <div className="bg-[#2C3E50] absolute text-xs -top-2 left-2">Type</div>
            <select
              className="bg-transparent w-full py-2 cursor-pointer outline-none"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as "FULL" | "PARTIAL")}
            >
              <option className="text-primary" value="">Choisir un type</option>
              <option className="text-primary" value="FULL">Total</option>
              <option className="text-primary" value="PARTIAL">Partiel</option>
            </select>
          </div>
        </div>
        {error && <div className="text-red-200 text-xs">{error}</div>}
        <div className="flex flex-col md:flex-row w-full gap-2">
          <button
            type="submit"
            className={`${
              isDisabled
                ? "btn_desabled active:scale-100"
                : "btn bg-third text-textColor"
            }  text-sm rounded-md p-2 btn font-semibold shadow-lg w-full flex items-center justify-center gap-2`}
            disabled={isDisabled}
            onClick={onSubmit}
          >
            <Icon icon="material-symbols:upload" width="24" height="24" />
            {loading ? "Traitement..." : "Payer / Enregistrer"}
          </button>
          <div className="flex items-center justify-between w-full gap-8">
            <button
              onClick={() => {
                setIsModalOpen(false);
              }}
              className="text-textColor bg-white text-sm rounded-md py-3 p-2 btn font-semibold shadow-lg w-full"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PaymentModal;
