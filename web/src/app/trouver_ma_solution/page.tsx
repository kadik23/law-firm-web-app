"use client";
import ServiceCard from "@/components/ServiceCard";
import useCarousel from "@/hooks/useCarousel";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { motion } from "framer-motion";
import React from "react";

function page() {
  const serviceItems = Array(6).fill(null);

  const {
    currentIndex: currentServiceIndex,
    handlePrev: handlePrevService,
    handleNext: handleNextService,
    handleIndicatorClick: handleServiceIndicatorClick,
    offset: serviceOffset,
    visibleItems: serviceVisibleItems,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useCarousel(serviceItems.length, 3.5);
  return (
    <div className="bg-[#E8E9EA]">
      <div className="flex flex-col items-center mx-auto gap-4 md:gap-8 py-10 w-full md:w-2/3 px-8">
        <div className="flex flex-col justify-start gap-2 w-full">
          <div className="text-black text-sm md:text-lg font-semibold">
            Choisir votre problème
          </div>
          <select
            name=""
            id=""
            className="py-2 px-4 outline-none shadow-lg bg-white text-sm md:text-base text-black rounded-lg border border-black bg-transparent"
          >
            <option value="" selected>
              Value
            </option>
            <option value="" selected>
              Value1
            </option>
            <option value="" selected>
              Value2
            </option>
          </select>
        </div>

        <div className="flex flex-col justify-start gap-2 w-full">
          <div className="text-black text-sm md:text-lg font-semibold">
            Choisir la catégorie de votre problème{" "}
          </div>
          <select
            name=""
            id=""
            className="py-2 px-4 outline-none shadow-lg bg-white text-sm md:text-base text-black rounded-lg border border-black bg-transparent"
          >
            <option value="" selected>
              Value
            </option>
            <option value="" selected>
              Value1
            </option>
            <option value="" selected>
              Value2
            </option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-4">
          <button className="bg-primary text-sm md:text-base text-white rounded-md px-8 py-2 btn font-semibold shadow-lg">
            Trouver ma solution
          </button>
        </div>
      </div>
      <section id="services" className="p-4 md:p-8">
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
            support tailored to the specific needs of your business.
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
                id={1}
                name="Service Title"
                key={index}
                description="Preparation, review, and negotiation of contracts to ensure compliance and protection of business interests. This includes employment contracts, vendor agreements, non-disclosure agreements (NDAs)."
                coverImage="serviceImg.png"
                style="items-center bg-primary text-white"
                isDescription={false}
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
            <Icon
              icon="ep:arrow-right"
              width="24"
              height="24"
              className="btn"
            />
          </button>
        </div>
      </section>
    </div>
  );
}

export default page;
