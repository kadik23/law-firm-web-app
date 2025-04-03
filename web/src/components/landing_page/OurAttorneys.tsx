"use client";
import React from "react";
import AvocatCard from "../AvocatCard";
import { motion } from "framer-motion";
import { useAttorneys } from "@/hooks/useAttorneys";
import LoadingSpinner from "../LoadingSpinner";

function OurAttorneys() {
  const { attorneys, loading } = useAttorneys();
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
          {loading && <LoadingSpinner />}
          {attorneys.length > 0 && !loading ? (
            <motion.div className="flex gap-4 flex-wrap justify-center">
              {attorneys.map((attorney, index) => (
                <AvocatCard
                  attorney={attorney}
                  key={index}
                  attorneyNbr={attorneys.length}
                />
              ))}
            </motion.div>
          ) : (
            "Il n'y a pas d'avocats"
          )}
        </div>
      </div>
    </section>
  );
}

export default OurAttorneys;
