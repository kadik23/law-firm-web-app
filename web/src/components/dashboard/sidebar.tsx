"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import {
  DashboardIcon,
  AccountIcon,
  PaymentsIcon,
  ServiceIcon,
  BlogsIcon,
  NotificationIcon,
  LogoutIcon
} from './icons';
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const Sidebar = () => {
    const pathname = usePathname() || "";
    const { logout } = useAuth();
    const [isNotificationHovered, setIsNotificationHovered] = useState(false);

    const routes = [
        { Icon: DashboardIcon, alt: "Dashboard", path: "/client/dashboard" },
        { Icon: AccountIcon, alt: "Compte", path: "/client/dashboard/compte" },
        { Icon: PaymentsIcon, alt: "Payments", path: "/client/dashboard/payments" },
        { Icon: ServiceIcon, alt: "Services", path: "/client/dashboard/services" },
        { Icon: BlogsIcon, alt: "Vos blogs", path: "/client/dashboard/vos-blogs" },
        { Icon: NotificationIcon, alt: "Notifications", path: "/client/dashboard/notifications" },
    ];

    return (
        <div className="bg-secondary hidden md:flex flex-col max-w-[320px] pt-20 pb-10 sticky left-0">
            <ul className="mb-20 ml-6">
                {routes.map(({ Icon, alt, path }) => {
                    const isActive = pathname === path || (pathname.startsWith(path) && path !== "/client/dashboard");

                    return (
                        <li
                            key={alt}
                            className={classNames(
                                "mb-6 py-2 pl-3 rounded-s-full group hover:bg-white hover:text-textColor transition-all duration-0.5 flex items-center gap-3",
                                {
                                    "text-textColor bg-white": isActive,
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
                                                "text-textColor": isActive,
                                                "text-white": !isActive,
                                            })}
                                            active={isActive}
                                            Hover={isNotificationHovered}
                                        />
                                    </div>
                                ) : (
                                    <Icon
                                        className={classNames({
                                            "text-textColor": isActive,
                                            "text-white group-hover:text-textColor": !isActive,
                                        })}
                                    />
                                )}
                                <span>{alt}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <button 
                className="flex items-center gap-2 py-2 px-3 bg-white text-textColor 
                font-semibold w-fit rounded-lg mx-6 hover:opacity-90"
                onClick={logout}
            >
                <LogoutIcon className="text-textColor" />
                <span>Déconnexion</span>
            </button>
        </div>
    );
};

export default Sidebar;