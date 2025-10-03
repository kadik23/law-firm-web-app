"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import ServiceCard from "@/components/ServiceCard";
import useCarousel from "@/hooks/useCarousel";
import useCategories from "@/hooks/useCategories";
import { useProblems } from "@/hooks/useProblems";
import { useServices } from "@/hooks/useServices";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { motion } from "framer-motion";
import React, { useState } from "react";

function Page() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedProblem, setSelectedProblem] = useState("Tous");

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    fetchServicesByProblem,
  } = useServices();
  const {
    problems,
    loading: problemsLoading,
    error: problemsError,
    fetchProblemsByCategory,
  } = useProblems();
  const { categories, loading: categoriesLoading } = useCategories();

  const {
    currentIndex: currentServiceIndex,
    handlePrev: handlePrevService,
    handleNext: handleNextService,
    handleIndicatorClick: handleServiceIndicatorClick,
    offset: serviceOffset,
    visibleItems: serviceVisibleItems,
  } = useCarousel(services.length, 3.5);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    fetchProblemsByCategory(categoryId !== "Tous" ? Number(categoryId) : 0);
    setSelectedProblem("Tous");
  };

  const handleProblemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const problemId = event.target.value;
    setSelectedProblem(problemId);
  };

  const handleFindServices = () => {
    fetchServicesByProblem(
      selectedProblem !== "Tous" ? Number(selectedProblem) : 0
    );
  };

  return (
    <div className="bg-[#E8E9EA]">
      <div className="flex flex-col items-center mx-auto gap-4 md:gap-8 pt-16 pb-8 w-full md:w-2/3 px-8">
        <div className="flex flex-col justify-start gap-2 w-full">
          <div className="text-black text-sm md:text-lg font-semibold">
            Choisir la catégorie de votre problème
          </div>
          {categoriesLoading && <LoadingSpinner/>}
          {categories.length === 0 && <div>Categories introuvables.</div>}
          <select
            className="py-2 px-4 outline-none shadow-lg bg-white text-sm md:text-base text-black rounded-lg border border-black"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="Tous">Tous</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-start gap-2 w-full">
          <div className="text-black text-sm md:text-lg font-semibold">
            Choisir votre problème
          </div>
          {problemsLoading &&  <LoadingSpinner/>}
          {problemsError && <div>{problemsError}</div>}
          {problems.length === 0 && <div>Problems introuvables.</div>}
          <select
            className="py-2 px-4 outline-none shadow-lg bg-white text-sm md:text-base text-black rounded-lg border border-black"
            value={selectedProblem}
            onChange={handleProblemChange}
          >
            <option value="Tous">Tous</option>
            {problems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handleFindServices}
            disabled={
              servicesLoading || problemsLoading || problems.length === 0
            }
            className={`${
              problems.length == 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary btn"
            } text-sm md:text-base text-white rounded-md px-8 py-2 font-semibold shadow-lg`}
          >
            Trouver ma solution
          </button>
        </div>
      </div>

      <section id="services" className="p-4 md:p-8">
        <div>
          <div className="font-bold text-3xl mb-4 text-center md:text-start">
            Nos Services
          </div>
          <div className="text-sm font-light text-center md:text-start text-opacity-50 mb-8">
            Nos services de droit des sociétés accompagnent les entreprises de toutes tailles tout au long de leur cycle de vie. De la création d{"'"}entreprise aux fusions et acquisitions, nous offrons un accompagnement juridique complet et adapté aux besoins spécifiques de votre entreprise.
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
            {servicesLoading && <LoadingSpinner/>}
            {servicesError && <div>{servicesError}</div>}
            {services.length === 0 && <div>Services introuvables.</div>}
            {services.map((service, index) => (
              <ServiceCard
                id={service.id as number}
                name={service.name}
                key={index}
                description={service.description}
                coverImage={service.coverImage || "/images/serviceImg.png"}
                style="items-center bg-white"
                isDescription={false}
              />
            ))}
          </motion.div>
        </div>

        <div className="flex justify-center items-center w-full gap-4 mt-8">
          <button
            onClick={handlePrevService}
            disabled={currentServiceIndex === 0}
            className="flex items-center"
          >
            <Icon icon="ep:arrow-left" width="24" height="24" className="btn" />
          </button>
          {services.map((_, index) => (
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
            disabled={currentServiceIndex >= services.length - 3.5}
            className="flex items-center"
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

export default Page;
