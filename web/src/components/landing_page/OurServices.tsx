"use client";
import useCarousel from "@/hooks/useCarousel";
import React from "react";
import ServiceCard from "../ServiceCard";
import { motion } from "framer-motion";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

function OurServices() {
  const serviceItems = Array(6).fill(null);
  const {
    currentIndex: currentServiceIndex,
    handlePrev: handlePrevService,
    handleNext: handleNextService,
    handleIndicatorClick: handleServiceIndicatorClick,
    offset: serviceOffset,
    visibleItems: serviceVisibleItems,
  } = useCarousel(serviceItems.length, 3.5);
  return (
    <section id="services" className="p-4 md:p-8 bg-[#dddddd]/30">
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
      <div className="overflow-hidden py-4">
        <motion.div
          className="flex gap-4"
          animate={{
            x: `-${
              (currentServiceIndex * serviceOffset) / serviceVisibleItems
            }%`,
          }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          {serviceItems.map((_, index) => (
            <ServiceCard
              title="Service Title"
              key={index}
              body="Preparation, review, and negotiation of contracts to ensure compliance and protection of business interests. This includes employment contracts, vendor agreements, non-disclosure agreements (NDAs)."
              image="serviceImg.png"
              isDescription
              style="items-start text-white bg-primary"
            />
          ))}
        </motion.div>
      </div>
      <div className="flex justify-center items-center w-full gap-4 mt-8">
        <button
          onClick={handlePrevService}
          disabled={currentServiceIndex === 0}
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
          disabled={currentServiceIndex >= serviceItems.length - 3.5}
        >
          <Icon icon="ep:arrow-right" width="24" height="24" className="btn" />
        </button>
      </div>
    </section>
  );
}

export default OurServices;
