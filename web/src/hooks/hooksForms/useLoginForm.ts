"use client";
import { useForm } from "react-hook-form";

function useLoginForm() {
  const form = useForm<SigninformType>({
    mode: "all",
    defaultValues: {
      email:'',
      password:''
    },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    reset,
  } = form;
  
  return {
    register,
    control,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    watch,
    reset,
    form
  };
}

export default useLoginForm;
