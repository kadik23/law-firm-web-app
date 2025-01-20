"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Signup from "./Signup";
import Signin from "./Signin";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<null | string>(null);
  const [isSigninModalOpen, setSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const links = [
    { name: "accueil", href: "#accueil" },
    { name: "services", href: "#services" },
    { name: "avocats", href: "#avocats" },
    { name: "blog", href: "#blog" },
    { name: "contact", href: "#contact" },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  const {user} = useAuth();

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

  return (
    <div className="flex flex-col w-full fixed top-0 left-0 z-50">
      <div className="hidden md:flex justify-between items-center w-full bg-[#4A84AA] py-2 px-4 md:px-8">
        <div className="flex items-center text-white font-semibold text-sm">
          <Icon icon="ic:outline-phone" width="20" height="20" className="mr-2" />
          0 26 45 23 45
        </div>
        <div className="flex gap-3 items-center text-white">
          <span className="text-sm">Social Media</span>
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
          isUploadFiles={false}
        />
        <Signin
          isModalOpen={isSigninModalOpen}
          setModalOpen={setSigninModalOpen}
        />
        <div className="hidden lg:flex items-center justify-between gap-4 cursor-pointer">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`uppercase text-sm text-primary hover:underline underline-offset-2 font-semibold transition duration-300 ${
                activeSection === link.href.substring(1) ? "underline" : ""
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        
        <div className="flex items-center gap-6">
          <div className="items-center gap-1 hidden md:flex text-primary">
              {/* Heart / Favorite */}
              <Icon
                icon="mdi:heart"
                width={20}
              />
              <div className="uppercase font-semibold text-sm">My blogs</div>
          </div>
          <div className={` items-center justify-between gap-4 ${user ? "hidden" : "hidden md:flex"}`}>
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
          <div className={` items-center justify-between gap-4 ${user ? "hidden md:flex" : "hidden"}`}>
            <button
              className="bg-primary rounded-md p-2 capitalize text-white btn font-semibold shadow-lg"
            >
              Bienvenu {user?.name}
            </button>
            <button
              className="bg-secondary w-11 h-11 rounded-full text-center text-lg p-2 btn font-semibold shadow-lg"
            >
              {user?.name[0]}
            </button>
          </div>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <div className="flex md:hidden items-center text-primary font-semibold text-sm">
            <Icon icon="ic:outline-phone" width="20" height="20" className="mr-2" />
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
          <div className="absolute top-14 right-4 bg-white text-primary rounded-md shadow-lg p-4 flex flex-col gap-2 lg:hidden">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`uppercase text-sm hover:underline text-primary font-semibold transition duration-300 ${
                  activeSection === link.href.substring(1) ? "underline" : ""
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col items-center mt-3 border-t pt-2">
              <div className="flex items-center gap-2 text-primary">
                  {/* Heart / Favorite */}
                  <Icon
                    icon="mdi:heart"
                    width={20}
                  />
                  <span className="uppercase font-semibold text-sm">My blogs</span>
              </div>
              <div className={`${user ? "hidden" : "flex"} flex-col gap-2 mt-4 `}>
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
              <div className={`${user ? "flex" : "hidden"} flex-col my-4 items-center justify-between gap-4 `}>
                <button
                  className="bg-primary rounded-md p-2 capitalize text-white btn font-semibold shadow-lg"
                >
                  Bienvenu {user?.name}
                </button>
                <button
                  className="bg-secondary w-11 h-11 rounded-full text-center text-lg p-2 btn font-semibold shadow-lg"
                >
                  {user?.name[0]}
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