"use client"
import { Header } from "@/components/dashboard/admin/header";
import Sidebar from "@/components/dashboard/admin/sidebar";
import { useState } from "react";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const [showSideBar, setShowSideBar] = useState(true);
    
    return (
        <div className="flex -mt-14">

            {/* Sidebar */}
            <div className="transform transition-all duration-300 ease-in-out">
              {showSideBar && <Sidebar />}
            </div>
            <div className="flex-1  bg-[#F5F6FA]">
              {/* Header */}
              <Header toggleSideBar={() => setShowSideBar(!showSideBar)} />
              <div className="py-7 px-8 flex-1">
                  {children}
              </div>
            </div>
        </div>
    );
  }