"use client";
import useCarousel from "@/hooks/useCarousel";
import { motion } from "framer-motion";
import React from "react";
import AvisCard from "../AvisCard";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useTestimonials } from "@/hooks/useTestimonials";

function OurTestimonials() {
  const {
    testimonials,
    loading: testimonialsLoading,
  } = useTestimonials();
  const {
    currentIndex: currentAvisIndex,
    handlePrev: handlePrevAvis,
    handleNext: handleNextAvis,
    handleIndicatorClick: handleAvisIndicatorClick,
    offset: avisOffset,
    visibleItems: avisVisibleItems,
  } = useCarousel(testimonials.length, 3.5);

  return (
    <section className="p-4 md:p-8 bg-[#dddddd]/30">
      <div className="">
        <div className=" font-bold text-3xl md:text-4xl text-center text-primary py-4">
          L’Avis de nos clients
        </div>
      </div>
      <div className="overflow-hidden py-4">
        <motion.div
          className="flex gap-4"
          animate={{
            x: `-${(currentAvisIndex * avisOffset) / avisVisibleItems}%`,
          }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          {testimonialsLoading
            ? "Chargement..."
            : testimonials.map((testimonial, index) => (
                <AvisCard
                  feedback={testimonial.feedback}
                  user={testimonial.user}
                  serviceId={testimonial.serviceId}
                  createdAt={testimonial.createdAt}
                  userId={testimonial.userId}
                  key={index}
                />
              ))}
          {testimonials.length == 0 &&
            !testimonialsLoading &&
            "Testimonials introuvable."}
        </motion.div>
      </div>
      <div className="flex justify-center items-center w-full gap-4 mt-8">
        <button
          onClick={handlePrevAvis}
          disabled={currentAvisIndex === 0}
          className="flex items-center"
        >
          <Icon icon="ep:arrow-left" width="24" height="24" className="btn" />
        </button>
        {testimonials.map((_, index) => (
          <div
            key={index}
            onClick={() => handleAvisIndicatorClick(index)}
            className={`w-4 h-4 rounded-full cursor-pointer ${
              currentAvisIndex === index ? "bg-primary" : "bg-secondary"
            }`}
          ></div>
        ))}
        <button
          onClick={handleNextAvis}
          disabled={currentAvisIndex >= testimonials.length - 3.5}
          className="flex items-center"
        >
          <Icon icon="ep:arrow-right" width="24" height="24" className="btn" />
        </button>
      </div>
      <div className="flex justify-center mt-4 mb-8">
        <button
          onClick={handleNextAvis}
          className="btn bg-[#C2E6F1] rounded-md py-1 px-4 text-primary font-semibold"
        >
          Voir plus{">"}
        </button>
      </div>
    </section>
  );
}

export default OurTestimonials;
