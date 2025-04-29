import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Image from "next/image"
import Link from "next/link";
import { useState } from "react";

export const Header = ({toggleSideBar}:{toggleSideBar:()=>void}) => {

    const {user, logout} = useAuth();
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    

    return(
        <div className="flex items-center justify-between bg-white px-8 py-3">
                <div className="flex items-center gap-3">
                  <Image 
                    src="/icons/dashboard/admin/menu.svg"
                    alt="Law Firm Logo"
                    width={20}
                    height={20}
                    onClick={toggleSideBar}
                    className="cursor-pointer"
                  />
                  {/* <div className="flex items-center gap-2 bg-[#F5F6FA] px-4 py-2 rounded-full border border-gray-300">
                    <Image 
                      src="/icons/dashboard/admin/search.svg"
                      alt="Law Firm Logo"
                      width={20}
                      height={20}
                    />
                    <input 
                      type="text" 
                      className="bg-[#F5F6FA] focus:outline-none placeholder:text-sm"
                      placeholder="Search"
                    />  
                  </div> */}
                </div>
                <div className="flex items-center gap-4">
                  <Image
                    src="/icons/dashboard/admin/notification.svg"
                    alt="Law Firm Logo"
                    width={20}
                    height={20}
                  />
                  {user && (
                    <div
                      className={` items-center justify-between gap-4 ${
                        user ? "hidden md:flex" : "hidden"
                      }`}
                    >
                      <button className="bg-secondary w-11 h-11 rounded-full text-center text-lg p-2 btn font-semibold shadow-lg">
                        {user?.name[0]}
                      </button>
                      <div className="relative">
                        <button
                          className="flex items-center gap-9"
                          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        >
                          <div className="flex flex-col items-start gap-1 text-sm font-semibold">
                            {user?.name}
                            <span className="text-xs font-normal">Admin</span>
                          </div>
                          <Icon
                            icon="tabler:chevron-down"
                            style={{ strokeWidth: 3 }}
                            width="17"
                            height="17"
                            className="ml-2"
                          />
                        </button>
                        {profileMenuOpen && (
                          <div
                            className="flex flex-col gap-3 items-end p-4 rounded-md 
                        absolute w-[200px] top-12 right-0 bg-primary text-white"
                          >
                            {/* Close icon */}
                            <Icon
                              icon="mdi:close"
                              style={{ strokeWidth: 3 }}
                              width="20"
                              height="20"
                              onClick={() => setProfileMenuOpen(false)}
                              className="hover:text-secondary cursor-pointer"
                            />
        
                            <div className="w-full flex flex-col gap-2">
                              <Link
                                href={`/client/dashboard/compte`}
                                className="bg-secondary rounded-md text-sm py-1 text-center font-semibold 
                              hover:text-primary"
                                onClick={() => setProfileMenuOpen(false)}
                              >
                                Voir mon compte
                              </Link>
                              <button
                                onClick={logout}
                                className="bg-secondary rounded-md text-sm py-1 text-center font-semibold
                                hover:text-primary"
                              >
                                Déconnectez
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                    </div>
                  )}
                </div>
              </div>
    )
}