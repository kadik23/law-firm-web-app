"use client"
import { Header } from "@/components/dashboard/admin/header";
import Sidebar from "@/components/dashboard/admin/sidebar";
import { useState } from "react";
import classNames from "classnames";
import DashboardAuthWrapper from "@/components/DashboardAuthWrapper";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    const [showSideBar, setShowSideBar] = useState(true);
    
    return (
        <DashboardAuthWrapper requiredType="admin">
            <div className="flex -mt-14 bg-[#F5F6FA] min-h-screen">

                <div
                    className={classNames(
                        "transition-all duration-300 ease-in-out overflow-hidden",
                        {
                            "w-[240px]": showSideBar,
                            "w-0": !showSideBar,
                        }
                    )}
                >
                    <Sidebar />
                </div>

                <div className="flex-1 flex flex-col">
                    <Header toggleSideBar={() => setShowSideBar(!showSideBar)} />
                    <main className="py-7 px-4 md:px-8 flex-1">{children}</main>
                </div>
            </div>
        </DashboardAuthWrapper>
    );
  }