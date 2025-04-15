"use client";
import { useState } from "react";
import FilterBar from "./filterBar";

interface BlogsHeaderProps {
    blogsPage: boolean;
    blogName?: string;
    onDeleteClick?: () => void;
    onAddClick?: () => void;
}

const BlogsHeader = ({ blogsPage, blogName, onDeleteClick, onAddClick }: BlogsHeaderProps) => {
    const categoryOptions = ["Derniers articles", "Actualités", "Évènements"];
    const timeOptions = [
      "Tous",
      "Aujourd'hui",
      "7 derniers jours",
      "30 derniers jours",
      "cette année (2025)",
      "cette année (2024)"
    ];
  
    const [categoryValue, setCategoryValue] = useState("Catégorie");
    const [timeValue, setTimeValue] = useState("Date de poste");
  
    return (
        <div className="flex flex-col gap-4 mb-9 lg:mb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 lg:gap-0">
                <div className="text-3xl font-bold text-adminTextHeader">Nos Blogs {blogName && `/ ${blogName}`}</div>
                {blogsPage && (
                    <div className="w-full lg:w-auto hidden lg:flex">
                       <FilterBar
                        categoryValue={categoryValue}
                        timeValue={timeValue}
                        categoryOptions={categoryOptions}
                        timeOptions={timeOptions}
                        onCategorySelect={setCategoryValue}
                        onTimeSelect={setTimeValue}
                        />
                    </div>
                )}
                <div className="flex items-center gap-8 md:gap-4 w-full md:w-auto">
                    <button 
                        className="bg-primary text-white px-5 py-3 rounded-md text-sm w-full md:w-auto"
                        onClick={onDeleteClick}
                    >
                        Supprimer un blog
                    </button>
                    <button
                        className="bg-primary text-white px-5 py-3 rounded-md text-sm w-full md:w-auto"
                        onClick={onAddClick}
                    >
                        Ajouter un blog
                    </button>
                </div>
            </div>
            {blogsPage && (
                <div className="flex lg:hidden">
                    <FilterBar
                        categoryValue={categoryValue}
                        timeValue={timeValue}
                        categoryOptions={categoryOptions}
                        timeOptions={timeOptions}
                        onCategorySelect={setCategoryValue}
                        onTimeSelect={setTimeValue}
                    />
                </div>
            )}
        </div>
    );
};

export default BlogsHeader;