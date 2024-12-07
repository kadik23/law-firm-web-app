import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
const SearchSection = () => {
    return (
        <div className="pt-9 flex items-center justify-between gap-8 mb-4
        flex-col lg:flex-row  ">
                {/* search bar  */}
                <div className="bg-white lg:w-fit w-full px-4 py-2 rounded-lg border-[1px] border-black
                 flex items-center justify-between flex-1 shadow-md">
                    <input type="text"  
                    placeholder="Hinted search text" 
                    name="blog-search-bar" 
                    id="blog-search"
                    className="bg-white" />
                    {/* Search icon */}
                    <Icon
                        icon="mdi:search"
                        width={20}
                    />
                </div>

                {/* buttons for handling blogs */}
                <div className="w-full flex gap-2 items-center
                 md:justify-evenly justify-between flex-1">
                    
                    {/* Meilleur Blogs Btn */}
                    <button className="bg-btnSecondary text-white font-semibold px-4 py-3 rounded-md
                    flex items-center gap-1">
                        {/* plus icon */}
                        <Icon
                            icon="mdi:plus"
                            width={20}
                        />
                        Meilleurs Blogs
                    </button>

                    {/* Nouveaux Blogs Btn */}
                    <button className="bg-btnSecondary text-white font-semibold px-4 py-3 rounded-md
                    flex items-center gap-1">
                        {/* plus icon */}
                        <Icon
                            icon="mdi:plus"
                            width={20}
                        />
                        Nouveaux Blogs
                    </button>

                </div>
        </div>
    )
}

export default SearchSection;