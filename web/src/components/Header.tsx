"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Signup from "./Signup";
import Signin from "./Signin";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import {
  AccountIcon,
  BlogsIcon,
  DashboardIcon,
  LogoutIcon,
  NotificationIcon,
  PaymentsIcon,
  ServiceIcon,
} from "./dashboard/icons";
import { useNotificationContext } from "@/contexts/NotificationContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<null | string>(null);
  const [isSigninModalOpen, setSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [iconIsHover, setIconIsHover] = useState(false);
  const router = usePathname();
  const { unreadCount } = useNotificationContext();
  const links = [
    { name: "accueil", href: "/#accueil" },
    { name: "services", href: "/#services" },
    { name: "avocats", href: "/#avocats" },
    { name: "contact", href: "/#contact" },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const { user, logout } = useAuth();

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const Router = useRouter();

  const handleNavClick = (href: string) => {
    if (router === "/") {
      document.getElementById(href.substring(2))?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      Router.push(href);
    }
  };

  const routes = [
    { Icon: DashboardIcon, alt: "Dashboard", path: "/client/dashboard" },
    { Icon: AccountIcon, alt: "Compte", path: "/client/dashboard/compte" },
    { Icon: PaymentsIcon, alt: "Payments", path: "/client/dashboard/payments" },
    { Icon: ServiceIcon, alt: "Services", path: "/client/dashboard/services" },
    { Icon: BlogsIcon, alt: "Vos blogs", path: "/client/dashboard/vos-blogs" },
  ];

  if(router.includes("/admin") || router.includes("/attorney")){
    return;
  }

  return (
    <div className={`flex-col w-full top-0 fixed left-0 z-50 flex'}`}>
      <div className="hidden md:flex justify-between items-center w-full bg-[#4A84AA] py-2 px-4 md:px-8">
        <div className="flex items-center text-white font-semibold text-sm">
          <Icon
            icon="ic:outline-phone"
            width="20"
            height="20"
            className="mr-2"
          />
          0 26 45 23 45
        </div>
        <div className="flex gap-3 items-center text-white">
          <span className="text-sm">Réseaux sociaux</span>
          {/* Facebook */}
          <Icon
            icon="ic:outline-facebook"
            width={20}
            className="hover:text-blue-700"
          />
          {/* WhatsApp */}
          <Icon
            icon="mdi:whatsapp"
            width={20}
            className="hover:text-green-700"
          />
          {/* Linkedin */}
          <Icon
            icon="mdi:linkedin"
            width={20}
            className="hover:text-blue-900"
          />
        </div>
      </div>

      <div className="flex justify-between items-center w-full bg-third py-2 shadow-lg px-4 md:px-8 text-white">
        <Link href={"/"}>
          <Image
            src="/images/Logo.png"
            alt="logo"
            width={125}
            height={125}
            priority
          />
        </Link>
        <Signup
          isModalOpen={isSignupModalOpen}
          setModalOpen={setSignupModalOpen}
          setSingingModalOpen={setSigninModalOpen}
          assignService={undefined}
        />
        <Signin
          isModalOpen={isSigninModalOpen}
          setModalOpen={setSigninModalOpen}
          setSignupModalOpen={setSignupModalOpen}
          assignService={undefined}
        />
        <div className="hidden lg:flex items-center justify-between gap-4 cursor-pointer">
          {links.map((link, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(link.href)}
              className={`uppercase text-sm text-primary hover:underline underline-offset-2 font-semibold transition duration-300 ${
                activeSection === link.href.substring(1) ? "underline" : ""
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          {user && (
            <Link
              href={`/${user?.type}/dashboard/notifications`}
              onMouseEnter={() => setIconIsHover(true)}
              onMouseLeave={() => setIconIsHover(false)}
              className="items-center gap-2 hidden md:flex text-primary hover:text-secondary cursor-pointer
              transition duration-2000 ease-in-out relative"
            >
              {unreadCount > 0 && (
                <span className="absolute -top-2 left-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
              <NotificationIcon active={iconIsHover} Hover={iconIsHover} />
              <div className="uppercase font-semibold text-sm">Mes notifs</div>
            </Link>
          )}
          
          {!user && (
            <div
              className={` items-center justify-between gap-4 ${
                user ? "hidden" : "hidden md:flex"
              }`}
            >
              <button
                className="bg-primary rounded-md p-2 btn font-semibold shadow-lg"
                onClick={() => setSigninModalOpen(true)}
              >
                connexion
              </button>
              <button
                className="bg-secondary rounded-md p-2 btn font-semibold shadow-lg"
                onClick={() => setSignupModalOpen(true)}
              >
                inscription
              </button>
            </div>
          )}
          {user && (
            <div
              className={` items-center justify-between gap-4 ${
                user ? "hidden md:flex" : "hidden"
              }`}
            >
              <div className="relative">
                <button
                  className="flex items-center bg-primary rounded-md p-2 capitalize 
                text-white btn font-semibold shadow-lg"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  Bienvenu {user?.name}
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
                absolute w-full top-11 bg-primary text-white"
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
                        href={`/${user?.type}/dashboard/compte`}
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
              <button className="bg-secondary w-11 h-11 rounded-full text-center text-lg p-2 btn font-semibold shadow-lg">
                {user?.name[0]}
              </button>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <div className="flex md:hidden items-center text-primary font-semibold text-sm">
            <Icon
              icon="ic:outline-phone"
              width="20"
              height="20"
              className="mr-2"
            />
            0 26 45 23 45
          </div>

          <Icon
            icon="mingcute:menu-line"
            width="32"
            height="32"
            className="lg:hidden text-primary cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
        {/* Dropdown menu for small screens */}
        {menuOpen && (
          <div className="absolute top-12 right-4 bg-secondary text-white rounded-md shadow-lg py-8 px-4 flex flex-col gap-2 md:hidden">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`uppercase text-sm hover:underline text-white font-semibold transition duration-300 ${
                  activeSection === link.href.substring(1) ? "underline" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link
              href={`/${user?.type}/dashboard/notifications`}
              className="flex items-center justify-start gap-2 text-white hover:text-secondary cursor-pointer"
            >
              <span className="uppercase font-semibold text-sm">Mes notifs</span>
            </Link>
            <div className="flex flex-col items-center ">
              <div
                className={`${
                  user ? "hidden" : "flex"
                } flex-col justify-center items-center gap-2 mt-4 `}
              >
                <button
                  onClick={() => {
                    setSigninModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="bg-primary text-white rounded-md p-2 font-semibold shadow-lg"
                >
                  connexion
                </button>
                <button
                  className="bg-secondary rounded-md p-2 font-semibold shadow-lg"
                  onClick={() => {
                    setSignupModalOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  inscription
                </button>
              </div>
              <div
                className={`${
                  user ? "flex" : "hidden"
                } my-4 items-center justify-between gap-4 `}
              >
                <div className="relative">
                  <button
                    className="flex items-center bg-primary rounded-md p-2 capitalize 
                    text-white btn font-normal md:font-semibold text-sm md:text-base shadow-lg"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    Bienvenu {user?.name}
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
                    absolute w-full top-11 bg-primary text-white"
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
                          href={`/${user?.type}/dashboard`}
                          className="bg-secondary rounded-md text-sm py-1 text-center font-semibold 
                          hover:text-primary"
                        >
                          Voir mon compte
                        </Link>
                        <button
                          onClick={logout}
                          className="bg-secondary rounded-md text-sm py-1 text-center font-semibold
                          hover:text-primary"
                        >
                          déconnectez
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button className="bg-secondary w-11 h-11 rounded-full text-center text-lg p-2 btn font-semibold shadow-lg">
                  {user?.name[0]}
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {user && user.type !== "client" &&
                  routes.map((route) => (
                    <Link
                      href={route.path}
                      key={route.path}
                      className={`py-1.5 flex items-center px-4 rounded-md transition cursor-pointer ${
                        router === route.path
                          ? "text-textColor bg-white hover:bg-gray-200"
                          : "text-white"
                      }`}
                    >
                      <route.Icon />
                      <div className="ml-4">{route.alt}</div>
                    </Link>
                  ))}
                <button
                  className="flex items-center gap-2 py-2 px-3 bg-white text-textColor 
                font-semibold w-fit rounded-lg mx-6"
                  onClick={logout}
                >
                  <LogoutIcon className="text-textColor" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
