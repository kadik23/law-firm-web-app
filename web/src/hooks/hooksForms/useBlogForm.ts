"use client";
import { useForm } from "react-hook-form";

function useBlogForm(initialValues?: BlogFormData) {
  const form = useForm<BlogFormData>({
    mode: "all",
    defaultValues: initialValues || {
      readingDuration: 3,
      title: "",
      categoryId: 0,
      likes: 0,
      author: "admin",
      body: "",
      image: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
    reset,
  } = form;

  const handleImageChange = (imageUrl: string) => {
    setValue("image", imageUrl, { shouldValidate: true });
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    isValid,
    isSubmitting,
    watch,
    setValue,
    reset,
    form,
    handleImageChange,
  };
}

export default useBlogForm;
