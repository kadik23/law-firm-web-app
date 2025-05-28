"use client";
import FilterBar from "./filterBar";
import useCategories from "@/hooks/useCategories";

interface BlogsHeaderProps {
  blogsPage: boolean;
  blogName?: string;
  onDeleteClick?: () => void;
  onAddClick?: () => void;
  onUpdateClick?: () => void;
  handleCategoryChange?: (category: string) => void;
  handleTimeChange?: (time: string) => void;
  selectedCategory?: string;
  selectedTime?: string;
}

const BlogsHeader = ({
  blogsPage,
  blogName,
  onDeleteClick,
  onAddClick,
  onUpdateClick,
  handleCategoryChange,
  handleTimeChange,
  selectedCategory,
  selectedTime,
}: BlogsHeaderProps) => {
  const { categories } = useCategories();

  const categoryOptions = [
    "Tous",
    ...categories.map((category: Category) => category.name),
  ];
  const timeOptions = [
    "Tous",
    "Aujourd'hui",
    "7 derniers jours",
    "30 derniers jours",
    "cette année (2025)",
    "cette année (2024)",
  ];

  return (
    <div className="flex flex-col gap-4 mb-9 lg:mb-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 lg:gap-0">
        <div className="text-3xl font-bold text-adminTextHeader">
          Nos Blogs {blogName && `/ ${blogName}`}
        </div>
        {blogsPage && (
          <div className="w-full lg:w-auto hidden lg:flex">
            <FilterBar
              categoryValue={selectedCategory as string}
              timeValue={selectedTime as string}
              categoryOptions={categoryOptions}
              timeOptions={timeOptions}
              onCategorySelect={
                handleCategoryChange as (category: string) => void
              }
              onTimeSelect={handleTimeChange as (time: string) => void}
            />
          </div>
        )}
        {blogsPage ? (
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
        ) : (
          <button
            className="bg-primary text-white px-5 py-3 rounded-md text-sm w-full md:w-auto"
            onClick={onUpdateClick}
          >
            Mettre à jour
          </button>
        )}
      </div>
      {blogsPage && (
        <div className="flex lg:hidden">
          <FilterBar
            categoryValue={selectedCategory as string}
            timeValue={selectedTime as string}
            categoryOptions={categoryOptions}
            timeOptions={timeOptions}
            onCategorySelect={
              handleCategoryChange as (category: string) => void
            }
            onTimeSelect={handleTimeChange as (time: string) => void}
          />
        </div>
      )}
    </div>
  );
};

export default BlogsHeader;
