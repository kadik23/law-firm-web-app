"use client";
import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import FileUpload from "./FileUpload";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import useBlogForm from "@/hooks/hooksForms/useBlogForm";
import { DevTool } from "@hookform/devtools";
import useCategories from "@/hooks/useCategories";
import { base64ToFile } from "@/lib/utils/base64ToFile";
import { fileToBase64 } from "@/lib/utils/fileToBase64";

type AddBlogFormProps = {
  onSubmit: (data: BlogFormData) => void;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  isUpdate: boolean;
  blog?: Blog;
  setBlog?: Dispatch<SetStateAction<Blog | null | undefined>>;
};

export const AddBlogForm = ({
  setFile,
  file,
  onSubmit,
  blog,
  isUpdate,
  setBlog,
}: AddBlogFormProps) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const { categories } = useCategories();
  const { register, control, handleSubmit, errors, isValid, watch } = useBlogForm(
    isUpdate && blog ? {
      title: blog.title,
      readingDuration: blog.readingDuration,
      categoryId: blog.categoryId,
      body: blog.body,
      image: blog.image,
      likes: blog.likes,
      author: blog.author,
      name: categories.find(cat => cat.id === blog.categoryId)?.name || "",
      category: {
        id: blog.categoryId,
        name: categories.find(cat => cat.id === blog.categoryId)?.name || "",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      accepted: true,
      rejectionReason: null
    } : undefined
  );
  const isInitialLoad = useRef(true);
  const prevFileRef = useRef<File | null>(null);
  const oldBlogDataRef = useRef<Blog | null>(null);

  useEffect(() => {
    if (isUpdate && blog && isInitialLoad.current) {
      oldBlogDataRef.current = { ...blog };
      isInitialLoad.current = false;
    }
  }, [blog, isUpdate]);

  const formValues = watch();
  useEffect(() => {
    if (isUpdate) {
      const hasChanges = 
        formValues.title !== oldBlogDataRef.current?.title ||
        formValues.readingDuration !== oldBlogDataRef.current?.readingDuration ||
        formValues.categoryId !== oldBlogDataRef.current?.categoryId ||
        formValues.body !== oldBlogDataRef.current?.body ||
        file !== prevFileRef.current;

      setIsDisabled(!hasChanges);
    } else {
      setIsDisabled(!isValid || file == null);
    }
  }, [isValid, file, isUpdate, formValues]);

  useEffect(() => {
    const setImageFile = async () => {
      if (blog?.image && isInitialLoad.current) {
        try {
          const file = await base64ToFile(blog.image, "blog-image.jpg");
          setFile(file);
          prevFileRef.current = file;
          isInitialLoad.current = false;
        } catch (error) {
          console.error("Error converting base64 to file:", error);
        }
      }
    };
    setImageFile();
  }, [blog?.image, setFile]);

  useEffect(() => {
    const updateBlogImage = async () => {
      if (file && setBlog && blog && !isInitialLoad.current && file !== prevFileRef.current) {
        try {
          const base64String = await fileToBase64(file);
          setBlog(prev => prev ? { ...prev, image: base64String } : prev);
          prevFileRef.current = file;
        } catch (error) {
          console.error("Error converting file to base64:", error);
        }
      }
    };

    updateBlogImage();
  }, [file, blog, setBlog]);

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
            type="number"
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
          {...register("categoryId", {
            required: "Category is required",
          })}
          id="categoryId"
          defaultValue={isUpdate && blog ? blog.categoryId : ""}
          className="h-full w-full border border-white text-white bg-transparent 
                p-3 rounded focus:bg-white focus:text-black focus:outline-none"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id} selected={isUpdate && blog && blog.categoryId == category.id }>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="error">{errors.categoryId.message}</p>}

        <textarea
          {...register("body", {
            required: "Corps est requis",
          })}
          placeholder="Corps.."
          className="px-2 rounded-md py-1 bg-transparent border text-white focus:bg-white focus:text-black border-white min-h-[100px] max-h-[100px]"
          required
        />
        {errors.body && <p className="error">{errors.body.message}</p>}
      </div>
      {isUpdate ? (
        <button
          type="submit"
          disabled={isDisabled}
          className={`${
            isDisabled ? "btn_desabled active:scale-100" : "btn bg-textColor"
          } text-sm rounded-md p-2 btn font-semibold shadow-lg w-full mt-8`}
        >
          Mettre a jour
        </button>
      ) : (
        <button
          type="submit"
          disabled={isDisabled}
          className={`${
            isDisabled ? "btn_desabled active:scale-100" : "btn bg-textColor"
          } text-sm rounded-md p-2 btn font-semibold shadow-lg w-full mt-8`}
        >
          Ajouter
        </button>
      )}
    </form>
  );
};
