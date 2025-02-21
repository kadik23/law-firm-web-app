"use client";
import useCarousel from "@/hooks/useCarousel";
import React from "react";
import ServiceCard from "../ServiceCard";
import { motion } from "framer-motion";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useServices } from "@/hooks/useServices";
import Link from "next/link";

function OurServices() {
  const { services, loading, error } = useServices();
  const serviceItems = Array(6).fill(null);

  const {
    currentIndex: currentServiceIndex,
    handlePrev: handlePrevService,
    handleNext: handleNextService,
    handleIndicatorClick: handleServiceIndicatorClick,
    offset: serviceOffset,
    visibleItems: serviceVisibleItems,
  } = useCarousel(serviceItems.length, 3.5);

  const ServicesLoadingChecker = () => {
    if (loading)
      return <h1 className="text-center text-6xl mt-6">Chargement...</h1>;
    if (error)
      return <h1 className="text-center text-6xl mt-6">Error: {error}</h1>;
  };
  console.log("services loaded", services);

  return (
    <section id="services" className="p-4 md:p-8 bg-[#dddddd]/30">
      {/* services title & description */}
      <div className="">
        <div className=" font-bold text-3xl mb-4 text-center md:text-start">
          Nos Services
        </div>
        <div className="text-sm font-light text-center md:text-start text-opacity-50 mb-8">
          Our corporate law services assist businesses of all sizes with legal
          guidance throughout their
          <br className="hidden md:block" />
          lifecycle. From incorporation to mergers and acquisitions, we offer
          comprehensive legal
          <br className="hidden md:block" />
          support tailored to the specific needs of votre business.
        </div>
      </div>

      {/* services grid */}
      {ServicesLoadingChecker()}
      <div className="overflow-hidden py-4">
        <motion.div
          className="flex gap-8"
          animate={{
            x: `-${
              (currentServiceIndex * serviceOffset) / serviceVisibleItems
            }%`,
          }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          {services.map((service) => (
            <ServiceCard
              name={service.name}
              id={service.id as number}
              key={service.id}
              description={service.description}
              coverImage={service.coverImage || "serviceImg.png"}
              isDescription
              style="items-start text-black bg-white h-full"
            />
          ))}
        </motion.div>
      </div>

      {/* carousel indicators */}
      <div className="flex justify-center items-center w-full gap-4 mt-8">
        <button
          onClick={handlePrevService}
          disabled={currentServiceIndex === 0}
          className="flex items-center"
        >
          <Icon icon="ep:arrow-left" width="24" height="24" className="btn" />
        </button>
        {serviceItems.map((_, index) => (
          <div
            key={index}
            onClick={() => handleServiceIndicatorClick(index)}
            className={`w-4 h-4 rounded-full cursor-pointer ${
              currentServiceIndex === index ? "bg-primary" : "bg-secondary"
            }`}
          ></div>
        ))}
        <button
          onClick={handleNextService}
          className="flex items-center"
          disabled={currentServiceIndex >= serviceItems.length - 4}
        >
          <Icon icon="ep:arrow-right" width="24" height="24" className="btn" />
        </button>
      </div>
    </section>
  );
}

export default OurServices;
