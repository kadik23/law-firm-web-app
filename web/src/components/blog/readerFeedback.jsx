"use client";
import AvisCard from "@/components/AvisCard";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { motion } from "framer-motion";
import useCarousel from "@/hooks/useCarousel";


const ReaderFeedback = () => {
      const serviceItems = Array(6).fill(null);
      const avisItems = Array(12).fill(null);
      const {
        currentIndex: currentAvisIndex,
        handlePrev: handlePrevAvis,
        handleNext: handleNextAvis,
        handleIndicatorClick: handleAvisIndicatorClick,
        offset: avisOffset,
        visibleItems: avisVisibleItems,
      } = useCarousel(avisItems.length, 3.5);

    return (
        <div className="py-4 mb-8">
            <div className="w-full flex items-center justify-between py-4">
                <div className="font-bold text-3xl md:text-4xl text-center text-primary">
                    Avis des lecteurs de ce blog (255)
                </div>
                <button className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md
                        flex items-center gap-1">
                            {/* comment icon */}
                            <Icon
                                icon="mdi:comment"
                                width={20}
                                className="text-secondary outline-black"
                            />
                            <span className="">Commenter</span>
                </button>
            </div>
            <div className="overflow-hidden py-4">
            <motion.div
                className="flex gap-4"
                animate={{
                x: `-${(currentAvisIndex * avisOffset) / avisVisibleItems}%`,
                }}
                transition={{ type: "spring", stiffness: 50 }}
            >
                {avisItems.map((_, index) => (
                <AvisCard
                    name="Name of customer"
                    avis="It’s page very important for our users, take it tomorrow, plz and call me after this tasks"
                    image="serviceImg.png"
                    creationDate= {new Date()}
                    likes={350}
                    key={index}
                />
                ))}
            </motion.div>
            </div>
            <div className="flex justify-center items-center w-full gap-4 mt-8">
            <button onClick={handlePrevAvis} disabled={currentAvisIndex === 0}>
                <Icon icon="ep:arrow-left" width="24" height="24" className="btn" />
            </button>
            {serviceItems.map((_, index) => (
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
                disabled={currentAvisIndex >= serviceItems.length - 3.5}
            >
                <Icon
                icon="ep:arrow-right"
                width="24"
                height="24"
                className="btn"
                />
            </button>
            </div>
            <div className="flex justify-center mt-4 mb-8">
            <a
                href="#voirplus"
                className="flex items-center gap-1 btn bg-[#C2E6F1] rounded-md py-1 px-4 text-primary font-semibold"
            >
                Voir plus <span>{">"}</span>
            </a>
            </div>
        </div>
    )
}

export default ReaderFeedback;