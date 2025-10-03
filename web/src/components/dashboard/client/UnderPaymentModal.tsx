import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import React, { useState, useEffect } from "react";
import Modal from "../../Modal";
import usePartialPayments from "@/hooks/clients/usePartialPayments";
import useAddTransaction from "@/hooks/clients/useAddTransaction";
import { useParams, useRouter } from "next/navigation";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function UnderPaymentModal({ isModalOpen, setIsModalOpen }: Props) {
  const params = useParams();
  const router = useRouter();
  const paymentId = Number(params?.id);
  const { partialPayments, fetchPartialPayments, fetchAllPartialPayments  } = usePartialPayments();
  const { addTransaction, loading } = useAddTransaction();
  const [paymentMethod, setPaymentMethod] = useState<"CIB" | "EDAHABIYA" | "">("");

  const [amount, setAmount] = useState<number | "">("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isModalOpen && paymentId) {
      fetchPartialPayments(paymentId);
    } else {
      fetchAllPartialPayments();
    }
  }, [isModalOpen, paymentId]);

  const isDisabled = !amount || !paymentMethod || !selectedPaymentId;

  const onSubmit = async () => {
    if (isDisabled) return;
    setError(null);
    try {
      // Get the selected payment details
      const selectedPayment = partialPayments.find(p => p.id === selectedPaymentId);
      if (!selectedPayment) {
        setError("Payment not found");
        return;
      }

      // Add transaction to existing payment
      const result = await addTransaction(selectedPayment.id, Number(amount), paymentMethod);
      
      // If there's a checkout URL, redirect to payment
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
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

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      isNotStepOne={true}
    >
      <div className="px-8 md:py-4 py-8 flex flex-col items-center gap-4 rounded-md">
        <div className="text-white font-medium text-sm">
          {partialPayments.length > 0 
            ? "Sélectionnez un paiement partiel à compléter ou créez un nouveau"
            : "Enregistrez votre paiement en remplissant ce formulaire"
          }
        </div>
        
        {partialPayments.length > 0 && (
          <div className="w-full text-white relative py-2 px-2 border rounded-sm border-white">
            <div className="bg-[#2C3E50] absolute text-xs -top-2 left-2">
              Paiements partiels existants
            </div>
            <select 
              className="bg-transparent w-full py-2 cursor-pointer outline-none"
              value={selectedPaymentId || ""}
              onChange={(e) => setSelectedPaymentId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Choisir un paiement partiel</option>
              {partialPayments.map((payment) => (
                <option key={payment.id} value={payment.id} className="text-primary">
                  Paiement #{payment.id} - {payment.service?.name} - Restant: {payment.remaining_balance} DZD
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row w-full items-center gap-2">
          <div className="flex items-center w-full text-white relative py-2 px-2 border rounded-sm border-white">
            <div className="bg-[#2C3E50] absolute text-xs -top-2 left-2">
              Montant payé
            </div>
            <input
              type="number"
              placeholder="Entrez le montant"
              className="bg-transparent w-full py-2  outline-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <div>DA</div>
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
        </div>
        {error && <div className="text-red-200 text-xs">{error}</div>}
        <div className="flex flex-col md:flex-row w-full gap-2">
          <button
            type="submit"
            className={`${
              isDisabled
                ? "btn_desabled active:scale-100"
                : "btn bg-third text-textColor"
            }  text-sm rounded-md text-nowrap p-2 btn font-semibold shadow-lg w-full flex items-center justify-center gap-2`}
            disabled={isDisabled}
            onClick={onSubmit}
          >
            <Icon icon="material-symbols:upload" width="24" height="24" />
            {loading ? "Traitement..." : selectedPaymentId ? "Ajouter la transaction" : "Créer un nouveau paiement"}
          </button>
          <div className="items-center justify-between w-full gap-8">
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

export default UnderPaymentModal;
