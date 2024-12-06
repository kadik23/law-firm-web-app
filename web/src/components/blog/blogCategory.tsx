"use client"
import { useState } from "react";

const BlogCategory = ({blogCategory}:{blogCategory:string}) => {
    const [activeCategory, setActiveCategory] = useState<number | null>(null);

    const categories: string[] = [
        "Droit administratif",
        "Droit des affaires",
        "Droit du travail",
        "Droit pénal",
        "Droit des assurances",
        "Droit immobilier"
    ];

    return (
        <div className="mb-4 overflow-x-auto py-3 flex items-center gap-6 md:justify-between w-full scrollbar-hidden">
            {categories.map((category, index) => (
                <div
                    key={index}
                    className="text-start min-w-fit cursor-pointer"
                >
                    <div className={`${category === blogCategory ? "text-primary font-bold" : ""}`}>
                        {category}
                    </div>
                    {/* Show the border if the category is active */}
                    <div
                        className={`w-4 h-[3px] rounded-lg bg-primary transition-all ${
                            category === blogCategory ? "opacity-100" : "opacity-0"
                        }`}
                    ></div>
                </div>
            ))}
        </div>
    );
};

export default BlogCategory;
