"use client";

const BlogCategory = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}) => {
  return (
    <div className="mb-4 overflow-x-auto py-3 flex items-center gap-6 md:justify-between w-full scrollbar-hidden">
      <button
        className="text-start min-w-fit cursor-pointer"
        onClick={() => setSelectedCategory(null)}
      >
        <div
          className={`${
            selectedCategory === null ? "text-primary font-bold" : ""
          }`}
        >
          Toute
        </div>
        <div
          className={`w-4 h-[3px] rounded-lg bg-primary transition-all ${
            selectedCategory === null ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </button>
      {categories.map((category, index) => (
        <button
          key={index}
          className="text-start min-w-fit cursor-pointer"
          onClick={() => setSelectedCategory(category)}
        >
          <div
            className={`${
              category.id === selectedCategory?.id
                ? "text-primary font-bold"
                : ""
            }`}
          >
            {category.name}
          </div>
          <div
            className={`w-4 h-[3px] rounded-lg bg-primary transition-all ${
              category.id == selectedCategory?.id ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        </button>
      ))}
    </div>
  );
};

export default BlogCategory;
