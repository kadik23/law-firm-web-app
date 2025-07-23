import { useFavorites } from "@/hooks/clients/useFavourites";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useState } from "react";

export const Header = ({ 
    totalBlogs, 
    onSearch 
}: { 
    totalBlogs: number;
    onSearch: (query: string) => void;
}) => {
    const { removeAllFavorites } = useFavorites();
    const [searchQuery, setSearchQuery] = useState("");

    const handleDeleteAll = async () => {
        if (window.confirm("Are you sure you want to remove all favorites?")) {
            const success = await removeAllFavorites();
            if (success) {
                window.location.reload();
            }
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <img src="/images/Blogs.svg" alt="" />
                    <span className="text-secondary text-2xl md:text-3xl font-semibold">Vos blogs</span>
                </div>
                <div className="flex items-center text-secondary gap-2 font-semibold">
                    <img src="/images/Blogs.svg" width={25} alt="" />
                    <div className="flex items-center gap-1">
                        <span className="hidden md:flex">
                            Total de blogs : 
                        </span>
                        {totalBlogs >= 10 ? totalBlogs : "0"+ totalBlogs} 
                        <span className="flex md:hidden">
                            blog{totalBlogs > 1 ? "s" : ""} 
                        </span>
                    </div>
                </div>
            </div>
            <div className="pt-4 flex items-center justify-between gap-8 mb-4">
                <div className="bg-white lg:w-fit w-full px-4 py-1.5 rounded-lg border-[1px] border-black
                    flex items-center justify-between flex-1 shadow-md max-w-[400px]">
                    <input 
                        type="text"  
                        placeholder="Rechercher un blog" 
                        name="blog-search-bar" 
                        id="blog-search"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="bg-white w-full h-full outline-none"
                    />
                    <Icon
                        icon="mdi:search"
                        width={20}
                    />
                </div>

                <button 
                    onClick={handleDeleteAll}
                    className="bg-btnSecondary text-white hover:opacity-75 font-semibold px-4 py-1.5 rounded-md
                    flex items-center gap-1"
                >
                    <Icon
                        icon="mdi:delete"
                        width={20}
                    />
                    <span className="hidden md:flex">
                        Supprimer tous
                    </span>
                </button>
            </div>
        </div>
    );
};