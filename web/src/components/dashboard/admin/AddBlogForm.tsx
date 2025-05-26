"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import useBlogForm from "@/hooks/hooksForms/useBlogForm";
import { DevTool } from "@hookform/devtools";
import useCategories from "@/hooks/useCategories";

type AddBlogFormProps = {
  onSubmit: (data: BlogFormData) => void;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
};

export const AddBlogForm = ({ setFile, file, onSubmit }: AddBlogFormProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const { register, control, handleSubmit, errors, isValid } = useBlogForm();
  const { categories } = useCategories();
  useEffect(() => {
    setIsDisabled(!isValid || file == null);
  }, [isValid, file]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {process.env.NODE_ENV === "development" && <DevTool control={control} />}
      <div className="pb-4">
        <FileUpload file={file} setFile={setFile} />
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-white font-semibold text-sm">
          Enter Blog information
        </span>
        <div className="flex-1 relative">
          <label className="absolute left-2 -top-2 bg-[#2C3E50] px-2 text-sm font-medium text-white z-50">
            Choisir une Durrée de lecture
          </label>
          <input
            type="text"
            {...register("readingDuration", {
              required: "Reading Duration est requis",
            })}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full border border-white text-white bg-transparent p-3 rounded focus:bg-white 
                    focus:text-black focus:outline-none appearance-none pr-10 custom-input-date"
          />
          <Icon
            icon="mdi:clock-outline"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none 
                    ${isFocused ? "text-black" : "text-white"}`}
          />
          {errors.readingDuration && (
            <p className="error">{errors.readingDuration.message}</p>
          )}
        </div>
        <div className="flex-1 relative">
          <label className="absolute left-2 -top-2 bg-[#2C3E50] px-2 text-sm font-medium text-white z-50">
            Choisir un Titre
          </label>
          <input
            type="text"
            {...register("title", {
              required: "Titre est requis",
            })}
            placeholder="Titre.."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full border border-white text-white bg-transparent p-3 rounded focus:bg-white 
                    focus:text-black focus:outline-none appearance-none pr-10 custom-input-date"
          />

          <Icon
            icon="mdi:clock-outline"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none 
              ${isFocused ? "text-black" : "text-white"}`}
          />
          {errors.title && <p className="error">{errors.title.message}</p>}
        </div>
        <select
          {...register("name", {
            required: "Nom est requis",
          })}
          id="name"
          className="h-full w-full border border-white text-white bg-transparent 
                p-3 rounded focus:bg-white focus:text-black focus:outline-none"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.name && <p className="error">{errors.name.message}</p>}

        <textarea
          {...register("body", {
            required: "Corps est requis",
          })}
          placeholder="Corps.."
          className="px-2 rounded-md py-1 bg-transparent border border-white focus:bg-white min-h-[100px] max-h-[100px]"
          required
        />
        {errors.body && <p className="error">{errors.body.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className={`${
          isDisabled ? "btn_desabled active:scale-100" : "btn bg-textColor"
        } text-sm rounded-md p-2 btn font-semibold shadow-lg w-full mt-8`}
      >
        Ajouter
      </button>
    </form>
  );
};
