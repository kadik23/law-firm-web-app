"use client";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import FileUpload from "./FileUpload";
import { set } from "react-hook-form";

type AddAvocatFormProps = {
  formData: {
    name: string;
    surname: string;
    password: string;
    email: string;
    linkedin_url: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUpload: (imageUrl: string) => void;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
};

export const AddAvocatForm = ({
  formData,
  setFile,
  file,
  onInputChange,
  onImageUpload,
  onSubmit,
  onClose,
}: AddAvocatFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(e);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="pb-4">
        <FileUpload
          onImageUpload={onImageUpload}
          setFile={setFile}
          file={file}
        />
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-white font-semibold text-sm">
          Enter lawyer information
        </span>
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={formData.name}
          onChange={onInputChange}
          className="px-2 rounded-md py-1 bg-transparent border border-white focus:bg-white"
          required
        />
        <input
          type="text"
          name="surname"
          placeholder="Prenom"
          value={formData.surname}
          onChange={onInputChange}
          className="px-2 rounded-md py-1 bg-transparent border border-white focus:bg-white"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onInputChange}
          className="px-2 rounded-md py-1 bg-transparent border border-white focus:bg-white"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onInputChange}
          className="px-2 rounded-md py-1 bg-transparent border border-white focus:bg-white"
          required
          minLength={8}
        />
        <input
          type="url"
          name="linkedin_url"
          placeholder="LinkedIn link"
          value={formData.linkedin_url}
          onChange={onInputChange}
          className="px-2 rounded-md py-1 bg-transparent border border-white focus:bg-white"
          required
        />
      </div>

      <div className="flex items-center pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="bg-[#F2F3F4] mr-3 w-full text-primary font-bold py-2 px-14 rounded-md text-sm"
        >
          Return
        </button>
        <button
          type="submit"
          className="bg-textColor text-white w-full font-bold py-2 px-14 rounded-md text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Ajouter"}
        </button>
      </div>
    </form>
  );
};
