"use client";
import { useForm } from "react-hook-form";

function useLawyerForm() {
  const form = useForm<LawyerFormData>({
    mode: "all",
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      linkedin_url: "",
      picture: "/images/avocatImg.png",
      certificats: [],
      status: "active"
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
    setValue("picture", imageUrl, { shouldValidate: true });
  };

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

export default useLawyerForm;