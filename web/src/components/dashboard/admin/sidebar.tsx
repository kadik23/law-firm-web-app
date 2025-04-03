"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import {
  DashboardIcon,
  ServicesIcon,
  ContactIcon,
  SettingsIcon,
  AccountIcon,
  LogoutIcon
} from './icons';
import { useState } from "react";

const Sidebar = () => {
    const pathname = usePathname() || "";
    const [isNotificationHovered, setIsNotificationHovered] = useState(false);

    const topRoutes = [
        { Icon: DashboardIcon, alt: "Dashboard", path: "/admin/dashboard" },
        { Icon: ServicesIcon, alt: "Services", path: "/admin/dashboard/services" },
        { Icon: ServicesIcon, alt: "Blogs", path: "/admin/dashboard/blogs" },
    ];

    const bottomRoutes = [
        { Icon: ContactIcon, alt: "Contact", path: "/admin/dashboard/contact" },
        { Icon: AccountIcon, alt: "Avocats", path: "/admin/dashboard/avocats" },
        { Icon: SettingsIcon, alt: "Settings", path: "/admin/dashboard/settings" },
        { Icon: LogoutIcon, alt: "Logout", path: "/admin/dashboard/logout" },
    ];

    return (
        <div className="bg-white text-black hidden md:flex flex-col w-[240px] pt-20 pb-10 sticky left-0">
            <ul className="mb-20 mx-6">
                {topRoutes.map(({ Icon, alt, path }) => {
                    const isActive = pathname === path || (pathname.startsWith(path) && path !== "/admin/dashboard");

                    return (
                        <li
                            key={alt}
                            className={classNames(
                                "mb-6 py-2 pl-3 rounded-md group hover:bg-[#34495E] hover:text-white transition-all duration-0.5 flex items-center gap-3",
                                {
                                    "text-white bg-[#34495E]": isActive,
                                    "text-white text-sm": !isActive,
                                }
                            )}
                        >
                            <Link href={path} className="flex items-center gap-3 font-semibold">
                                {alt === "Notifications" ? (
                                    <div
                                        onMouseEnter={() => setIsNotificationHovered(true)}
                                        onMouseLeave={() => setIsNotificationHovered(false)}
                                    >
                                        <Icon
                                            className={classNames({
                                                "text-white": isActive,
                                                "text-black": !isActive,
                                            })}
                                            active={isActive}
                                            hover={isNotificationHovered}
                                        />
                                    </div>
                                ) : (
                                    <Icon
                                        className={classNames({
                                            "text-white": isActive,
                                            "text-black group-hover:text-white": !isActive,
                                        })}
                                    />
                                )}
                                <span className={classNames({
                                    "text-white": isActive,
                                    "text-black group-hover:text-white": !isActive,
                                })}>{alt}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <ul className="mb-20 mx-6">
                <div className="border-b text-xs text-gray-400 mb-8">PAGES</div>
                {bottomRoutes.map(({ Icon, alt, path }) => {
                    const isActive = pathname === path || (pathname.startsWith(path) && path !== "/admin/dashboard");

                    return (
                        <li
                            key={alt}
                            className={classNames(
                                "mb-6 py-2 pl-3 rounded-md group hover:bg-[#34495E] hover:text-white transition-all duration-0.5 flex items-center gap-3",
                                {
                                    "text-white bg-[#34495E]": isActive,
                                    "text-white text-sm": !isActive,
                                }
                            )}
                        >
                            <Link href={path} className="flex items-center gap-3 font-semibold">
                                {alt === "Notifications" ? (
                                    <div
                                        onMouseEnter={() => setIsNotificationHovered(true)}
                                        onMouseLeave={() => setIsNotificationHovered(false)}
                                    >
                                        <Icon
                                            className={classNames({
                                                "text-white": isActive,
                                                "text-black": !isActive,
                                            })}
                                            active={isActive}
                                            hover={isNotificationHovered}
                                        />
                                    </div>
                                ) : (
                                    <Icon
                                        className={classNames({
                                            "text-white": isActive,
                                            "text-black group-hover:text-white": !isActive,
                                        })}
                                    />
                                )}
                                <span className={classNames({
                                    "text-white": isActive,
                                    "text-black group-hover:text-white": !isActive,
                                })}>{alt}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Sidebar;