"use client";
import { useForm } from "react-hook-form";

function useConsultationHForm() {
  const form = useForm({ mode: "onTouched" });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
    reset,
  } = form;

  return {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isValid },
    reset,
  };
}

export default useConsultationHForm;
