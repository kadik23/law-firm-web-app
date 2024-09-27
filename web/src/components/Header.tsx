"use client"
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false); 
    const [activeSection, setActiveSection] = useState<null | string>(null);
    const links = [
        { name: "accueil", href: "#accueil" },
        { name: "services", href: "#services" },
        { name: "avocats", href: "#avocats" },
        { name: "blog", href: "#blog" },
        { name: "contact", href: "#contact" },
    ];

    // Function to handle the menu toggle
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

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
        <div className='flex justify-between items-center fixed top-0 left-0 w-full z-50 bg-third py-2 shadow-lg px-4 md:px-8 text-white'>
            <Image
                src="/images/Logo.png"
                alt="logo"
                width={125}
                height={125}
                priority
            />
            <div className='hidden lg:flex items-center justify-between gap-4 cursor-pointer'>
                {links.map((link, index) => (
                    <a 
                        key={index} 
                        href={link.href} 
                        className={`uppercase text-sm text-primary hover:underline underline-offset-2 font-semibold transition duration-300 ${
                            activeSection === link.href.substring(1) ? 'underline' : ''
                        }`}
                    >
                        {link.name}
                    </a>
                ))}
            </div>

            <div className='flex items-center text-primary font-semibold text-sm'>
                <Icon icon="ic:outline-phone" width="20" height="20" className='mr-2' />
                0 26 45 23 45
            </div>

            <div className='hidden md:flex items-center justify-between gap-4'>
                <button className='bg-primary rounded-md p-2 btn font-semibold shadow-lg'>
                    connexion
                </button>
                <button className="bg-secondary rounded-md p-2 btn font-semibold shadow-lg">
                    inscription
                </button>
            </div>

            <Icon
                icon="mingcute:menu-line"
                width="32"
                height="32"
                className='lg:hidden text-primary cursor-pointer'
                onClick={toggleMenu} 
            />

            {/* Dropdown menu for small screens */}
            {menuOpen && (
                <div className='absolute top-14 right-4 bg-white text-primary rounded-md shadow-lg p-4 flex flex-col gap-2 lg:hidden'>
                    {links.map((link, index) => (
                        <a 
                            key={index} 
                            href={link.href} 
                            className={`uppercase text-sm hover:underline text-primary font-semibold transition duration-300 ${
                                activeSection === link.href.substring(1) ? 'underline' : ''
                            }`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className='flex flex-col gap-2 mt-4'>
                        <button className='bg-primary text-white rounded-md p-2 font-semibold shadow-lg'>
                            connexion
                        </button>
                        <button className="bg-secondary rounded-md p-2 font-semibold shadow-lg">
                            inscription
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;
