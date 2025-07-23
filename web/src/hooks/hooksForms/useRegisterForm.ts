"use client";
import { useForm } from "react-hook-form";

function useRegisterForm() {
  const form = useForm<SignupformType>({
    mode: "all",
    defaultValues: {
      stepOne: {
        name: "",
        surname: "",
        email: "",
        password: "",
        conpassword: "",
      },
      stepTwo: {
        nbr_tel: "",
        pays: "",
        ville: "",
        age: "",
        gender: "",
      },
      stepThree: {
        files: [],
      },
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

export default useRegisterForm;
