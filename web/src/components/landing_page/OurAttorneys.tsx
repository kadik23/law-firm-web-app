"use client";
import React from "react";
import AvocatCard from "../AvocatCard";
import { motion } from "framer-motion";

function OurAttorneys() {
  const avocatItems = Array(12).fill(null);

  return (
    <section id="avocats">
      <div className="flex flex-col items-start gap-2 p-4 md:p-8">
        <div className=" font-bold text-3xl">A propos</div>
        <div className="">
          Nos services en droit des sociétés assistent les entreprises de toutes
          tailles avec des conseils juridiques tout au long de leur cycle de
          vie. De la constitution aux fusions et acquisitions, nous proposons un
          accompagnement juridique complet adapté aux besoins spécifiques de
          votre entreprise.{" "}
        </div>
      </div>
      <div className="mt-8 bg-third flex flex-col items-center py-8 p-4 md:p-8">
        <div className=" font-bold text-3xl">Nos Avocats</div>
        <div className="overflow-hidden py-8">
          <motion.div className="flex gap-4 flex-wrap justify-center">
            {avocatItems.map((_, index) => (
              <AvocatCard
                name="Frankie"
                image="avocatImg.png"
                linkedin="linkedin.com"
                date="2016"
                key={index}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default OurAttorneys;
