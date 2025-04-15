"use client"
import { FormEvent, useState } from "react";
import FileUpload from "./FileUpload";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

type AddBlogFormProps = {
    formData: {
        nom: string;
        prenom: string;
        password: string;
        email: string;
        linkedin: string;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImageUpload: (imageUrl: string) => void;
    onSubmit: (e: FormEvent) => void;
    onClose: () => void;
};

export const AddBlogForm = ({
    onImageUpload,
    onSubmit,
    onClose
}: AddBlogFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

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
                <FileUpload onImageUpload={onImageUpload} />
            </div>
            <div className="flex flex-col gap-4">
                <span className="text-white font-semibold text-sm">Enter Blog information</span>
            <div className="flex-1 relative">
                <label className="absolute left-2 -top-2 bg-[#2C3E50] px-2 text-sm font-medium text-white z-50">
                    Choisir une Durrée de lecture
                </label>
                <input
                    type="number"
                    name="Duree"
                    value="3"
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
            </div>
            <select 
                name="category" 
                value="Category" 
                id="category"
                className="h-full w-full border border-white text-white bg-transparent 
                p-3 rounded focus:bg-white focus:text-black focus:outline-none">
                <option value="category-1">category 1</option>
                <option value="">category 1</option>
                <option value="">category 1</option>
                <option value="">category 1</option>
            </select>
            <textarea 
                name="Body" 
                placeholder="Body" 
                className="px-2 rounded-md py-1 bg-transparent border border-white focus:bg-white min-h-[100px] max-h-[100px]"    
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
                    {isSubmitting ? 'Adding...' : 'Ajouter'}
                </button>
            </div>
        </form>
    );
};