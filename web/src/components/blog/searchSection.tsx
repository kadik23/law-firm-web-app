"use client";
import { useBlogs } from "@/hooks/useBlogs";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { MouseEventHandler, useEffect } from "react";

const SearchSection = () => {
  const {
    getFilteredBlogs,
    searchInput,
    setSearchInput,
    sort,
    setSort,
    setSelectedCategory,
  } = useBlogs();

  useEffect(() => {
    getFilteredBlogs();
  }, [sort]);

  const onSubmit: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    getFilteredBlogs();
  };

  const resetAll: MouseEventHandler<HTMLElement> = () => {
    setSort(null);
    setSearchInput("");
    setSelectedCategory(null);
    getFilteredBlogs();
  };

  return (
    <div
      className="pt-9 flex items-center justify-between gap-8 mb-4
        flex-col lg:flex-row  "
    >
      {/* search bar  */}
      <div
        className="bg-white lg:w-fit w-full px-4 rounded-lg border-[1px] border-black
                 flex items-center justify-between flex-1 shadow-md"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Hinted search text"
          name="blog-search-bar"
          id="blog-search"
          className="bg-white w-full outline-none py-2"
        />
        {/* Search icon */}
        <Icon
          onClick={onSubmit}
          icon="mdi:search"
          width={20}
          className="cursor-pointer hover:text-secondary"
        />
      </div>

      <div
        className="w-full flex gap-2 items-center
                 md:justify-evenly justify-between flex-1"
      >
        <button
          onClick={() => setSort("best")}
          className={` ${
            sort == "best"
              ? "bg-btnSecondary hover:bg-primary"
              : "bg-primary hover:bg-btnSecondary"
          } hover:bg-primary text-white font-semibold px-4 py-2.5 rounded-md text-sm
                    flex items-center gap-1`}
        >
          <Icon icon="mdi:plus" width={16} />
          Meilleurs Blogs
        </button>

        <button
          onClick={() => setSort("new")}
          className={` ${
            sort == "new"
              ? "bg-btnSecondary hover:bg-primary"
              : "bg-primary hover:bg-btnSecondary"
          } hover:bg-primary text-white font-semibold px-4 py-2.5 rounded-md  text-sm
                    flex items-center gap-1`}
        >
          <Icon icon="mdi:plus" width={20} />
          Nouveaux Blogs
        </button>

        <button
          onClick={resetAll}
          className={` ${
            sort == null
              ? "bg-btnSecondary hover:bg-primary"
              : "bg-primary hover:bg-btnSecondary"
          } hover:bg-primary text-white font-semibold px-4 py-2.5 rounded-md  text-sm
                    flex items-center gap-1`}
        >
          <Icon icon="grommet-icons:power-reset" width={20} />
          Reset all
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
