"use client";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Link from "next/link";
import dynamic from "next/dynamic";
const OurServices = dynamic(() => import("@/components/landing_page/OurServices"), { ssr: false });
const OurTestimonials = dynamic(() => import("@/components/landing_page/OurTestimonials"), { ssr: false });
const OurAttorneys = dynamic(() => import("@/components/landing_page/OurAttorneys"), { ssr: false });
const ContactUs = dynamic(() => import("@/components/landing_page/ContactUs"), { ssr: false });

export default function Home() {
  const directions = [
    { text: "Résoudre mon probèlme", link: "/trouver_ma_solution" },
    { text: "Enrichir ma culture juridique", link: "/" },
    { text: "Je veux être informé sur n'importe quelle question", link: "/" },
  ];
  return (
    <div className="min-h-screen mt-8">
      <section
        id="accueil"
        className="bg-[url('/images/slide.png')] bg-cover bg-center md:h-screen p-4 md:p-8"
      >
        <div className="flex flex-col items-start my-8 text-white">
          <div className="font-semibold text-2xl mb-4 text-center md:text-start">
            Les solutions juridiques commencent ici
          </div>
          <div className="text-sm font-light text-center md:text-start text-opacity-50 mb-4">
            LowSite est la première source d{"'"}informations{" "}
            <br className="hidden md:block lg:hidden" /> et de ressources{" "}
            <br className="hidden lg:block" /> juridiques gratuites en ligne en
            Algérie.
          </div>
          <button className="bg-[#37526D] mb-4 rounded-md p-2 btn font-semibold shadow-lg">
            Réserver une consultation gratuite
          </button>
          <div className="bg-third p-2 mb-4 flex flex-col items-start rounded-md text-primary">
            <div className="m-2 text-xl font-semibold">Je veux...</div>
            <ul>
              {directions &&
                directions.map((direction, index) => (
                  <Link
                    href={direction.link}
                    key={index}
                    className="flex items-center hover:bg-primary cursor-pointer active:scale-105 transition-all duration-150 hover:text-white hover:border-white justify-between p-2 m-2 gap-4 text-xs font-semibold rounded-sm border border-primary"
                  >
                    <div>{direction.text}</div>
                    <div className="p-1 peer-hover:text-white hover:border-white flex justify-center items-center border border-primary rounded-sm">
                      <Icon
                        icon="solar:arrow-right-outline"
                        width="24"
                        height="24"
                      />
                    </div>
                  </Link>
                ))}
            </ul>
          </div>
        </div>
      </section>
      <OurServices />
      <OurAttorneys />
      <ContactUs />
      <OurTestimonials />
    </div>
  );
}
