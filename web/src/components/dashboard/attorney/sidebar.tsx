"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify-icon/react";
import { useAuth } from "@/hooks/useAuth";

const routes = [
  { icon: "clarity:dashboard-line", label: "Dashboard", path: "/attorney/dashboard" },
  { icon: "material-symbols-light:article-outline-rounded", label: "Articles", path: "/attorney/dashboard/blogs" },
  { icon: "mdi:bell-outline", label: "Notifications", path: "/attorney/dashboard/notifications" },
  { icon: "mdi:account", label: "Compte", path: "/attorney/dashboard/compte" },
];


export default function AttorneySidebar() {
  const pathname = usePathname();
  const { logout, loading } = useAuth();

  return (
    <div className="bg-white text-black flex flex-col w-[240px] pb-10 sticky left-0 min-h-screen">
      <Link href="/">
        <img src="/images/Logo.png" alt="logo" className="mx-6 mt-4 w-40" />
      </Link>
      <ul className="mb-auto mx-6 mt-16">
        {routes.map(({ icon, label, path }) => (
          <li key={label} className={`mb-6 py-2 pl-3 rounded-md flex items-center gap-3 ${pathname === path ? "bg-primary text-white" : ""}`}>
            <Link href={path} className="flex items-center gap-3 font-semibold w-full">
              <Icon icon={icon} width="24" height="24" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
      <button disabled={loading} onClick={logout} className="flex items-center gap-3 font-semibold text-black py-2 px-3 hover:bg-primary hover:text-white rounded-md mx-6 transition-all duration-300">
        <Icon icon="ic:round-logout" width="24" height="24" />
        <span>Déconnexion</span>
      </button>
    </div>
  );
} 