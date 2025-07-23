"use client"
import Header from "@/components/dashboard/attorney/header";
import Sidebar from "@/components/dashboard/attorney/sidebar";
import { useState } from "react";
import classNames from "classnames";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showSideBar, setShowSideBar] = useState(true);
    
    return (
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
                <Header />
                <main className="py-7 px-4 md:px-8 flex-1">{children}</main>
            </div>
        </div>
    );
  }