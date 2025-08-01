"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { Icon } from "@iconify-icon/react";
import { useAuth } from "@/hooks/useAuth";

const Sidebar = () => {
  const pathname = usePathname() || "";
  const { logout } = useAuth();

  const routes = [
    {
      Icon: "clarity:dashboard-line",
      alt: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      Icon: "mdi:account-group-outline",
      alt: "Avocats",
      path: "/admin/dashboard/avocats",
    },
    {
      Icon: "material-symbols-light:window-outline-sharp",
      alt: "Services",
      path: "/admin/dashboard/services",
    },
    {
      Icon: "material-symbols-light:article-outline-rounded",
      alt: "Articles",
      path: "/admin/dashboard/blogs",
    },
    {
        Icon: "solar:folder-with-files-line-duotone",
        alt: "Clientes",
        path: "/admin/dashboard/clients",
    },
    {
      Icon: "icon-park-outline:plan",
      alt: "Planification",
      path: "/admin/dashboard/planning",
    },
    {
      Icon: "mdi:video-outline",
      alt: "Consultations",
      path: "/admin/dashboard/consultations",
    },
    {
      Icon: "mdi:category-outline",
      alt: "Catégories",
      path: "/admin/dashboard/categories",
    },
    {
      Icon: "mdi:alert-circle-outline",
      alt: "Problèmes",
      path: "/admin/dashboard/problems",
    },
    {
      Icon: "mdi:account-outline",
      alt: "Compte",
      path: "/admin/dashboard/compte",
    },
  ];

  const renderRoutes = (routeList: typeof routes) => {
    return routeList.map(({ Icon: iconName, alt, path }) => {
      const isActive =
        pathname === path ||
        (pathname.startsWith(path) && path !== "/admin/dashboard");
      return (
        <li
          key={alt}
          className={classNames(
            "mb-6 py-2 pl-3 rounded-md group hover:bg-[#34495E] hover:text-white transition-all duration-300 flex items-center gap-3",
            {
              "text-white bg-[#34495E]": isActive,
              "text-black": !isActive,
            }
          )}
        >
          <Link
            href={path}
            className="flex items-center gap-3 font-semibold w-full"
          >
            <Icon
              icon={iconName}
              width="24"
              height="24"
              className={classNames({
                "text-white": isActive,
                "text-black group-hover:text-white": !isActive,
              })}
            />
            <span
              className={classNames({
                "text-white": isActive,
                "text-black group-hover:text-white": !isActive,
              })}
            >
              {alt}
            </span>
          </Link>
        </li>
      );
    });
  };

  return (
    <div className="bg-white text-black hidden md:flex flex-col w-[240px] pb-10 sticky left-0 min-h-screen">
      <Link href="/">
        <img src="/images/Logo.png" alt="logo" className="mx-6 mt-4 w-40" />
      </Link>
      <ul className="mb-auto mx-6 mt-16">{renderRoutes(routes.slice(0, 9))}</ul>
      <ul className="mx-6">
        <div className="border-b text-xs text-gray-400 mb-8">PAGES</div>
        {renderRoutes(routes.slice(9))}
      </ul>
      <button
        onClick={logout}
        className="flex items-center gap-3 font-semibold text-black py-2 px-3 hover:bg-[#34495E] hover:text-white rounded-md mx-6 transition-all duration-300"
      >
        <Icon icon="ic:round-logout" width="24" height="24" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
