"use client";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotificationContext();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between bg-white px-8 py-3 shadow-md z-50">
      <div className="flex items-center gap-3">
        <Image src="/images/Logo.png" alt="Law Firm Logo" width={40} height={40} />
        <span className="text-xl font-bold text-primary">Espace Avocat</span>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/attorney/dashboard/notifications" className="relative">
          <Icon icon="mdi:bell-outline" width={28} height={28} className="text-primary" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Link>
        {user && (
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-semibold"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              {user.name} {user.surname}
              <Icon icon="tabler:chevron-down" width={18} height={18} />
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg p-4 flex flex-col gap-2 z-50">
                <Link href="/attorney/dashboard/compte" className="text-primary font-semibold hover:underline" onClick={() => setProfileMenuOpen(false)}>
                  Mon Compte
                </Link>
                <button onClick={logout} className="text-red-600 font-semibold hover:underline text-left">
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 