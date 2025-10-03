"use client";
import { useAlert } from "@/contexts/AlertContext";
import axiosClient from "@/lib/utils/axiosClient";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function useContactForm() {
  const [isDisabled, setIsDisabled] = useState(true);
  const {showAlert} = useAlert();
  const form = useForm<ContactUs>({
    mode: "all",
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      message: "",
    },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = form;
  const onsubmit = async (data: ContactUs) => {
    setIsDisabled(true);
    try {
      console.log("first submit ", data);
      const response = await axiosClient.post("/admin/contactus", {
        name: data.name,
        surname: data.surname,
        email: data.email,
        message: data.message,
      });
      if (response.status == 200) {
        showAlert("success", "Soumis avec succès!", "Votre demande a été soumise avec succès.")
      } else {
        alert(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsDisabled(false);
    }
  };
  const validateForm = () => {
    if (
      errors.email ||
      errors.surname ||
      errors.name ||
      errors.message ||
      !watch().email ||
      !watch().message ||
      !watch().surname ||
      !watch().name
    ) {
      console.log(errors);
      setIsDisabled(true);
      return false;
    }
    setIsDisabled(false);
    return true;
  };
  useEffect(() => {
    validateForm();
  }, [isValid]);
  return {
    register,
    control,
    handleSubmit,
    errors,
    isValid,
    watch,
    form,
    onsubmit,
    isDisabled,
    validateForm,
  };
}

export default useContactForm;
