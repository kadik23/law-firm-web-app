import { Icon } from "@iconify-icon/react/dist/iconify.mjs"

export const Header = ({ totalBolgs }: { totalBolgs: number }) => {
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
                        {totalBolgs >= 10 ? totalBolgs : "0"+totalBolgs} 
                        <span className="flex md:hidden">
                            blog{totalBolgs > 1 ? "s" : ""} 
                        </span>
                    </div>
                </div>
            </div>
            <div className="pt-4 flex items-center justify-between gap-8 mb-4">
                {/* search bar  */}
                <div className="bg-white lg:w-fit w-full px-4 py-2 rounded-lg border-[1px] border-black
                    flex items-center justify-between flex-1 shadow-md max-w-[400px]">
                    <input type="text"  
                    placeholder="Rechercher un blog" 
                    name="blog-search-bar" 
                    id="blog-search"
                    className="bg-white w-full h-full outline-none"
                    />
                    {/* Search icon */}
                    <Icon
                        icon="mdi:search"
                        width={20}
                    />
                </div>

                {/* buttons for handling blogs */}
                    {/* Nouveaux Blogs Btn */}
                <button className="bg-btnSecondary text-white font-semibold px-4 py-3 rounded-md
                flex items-center gap-1">
                    {/* plus icon */}
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
    )
}
