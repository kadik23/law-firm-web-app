"use client";
import { useForm } from "react-hook-form";

function useServiceForm(initialValues?: ServiceFormData) {
  const form = useForm<ServiceFormData>({
    mode: "all",
    defaultValues: initialValues || {
      name: "",
      description: "",
      price: 0,
      requestedFiles: [],
      coverImage: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset
  } = form;

  const handleImageChange = (imageUrl: string) => {
    setValue("coverImage", imageUrl, { shouldValidate: true });
  };

  const validateRequestedFiles = (value: string[] | undefined) => {
    if (!value || value.length === 0) {
      return "Au moins un fichier est requis";
    }
    return true;
  };

  // Register the validation
  register("requestedFiles", {
    validate: validateRequestedFiles
  });

  return {
    register,
    control,
    handleSubmit,
    errors,
    isValid,
    watch,
    setValue,
    reset,
    form,
    handleImageChange
  };
}

export default useServiceForm;