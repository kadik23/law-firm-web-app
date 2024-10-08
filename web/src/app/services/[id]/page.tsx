"use client"
import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import useCarousel from '@/hooks/useCarousel';
import ServiceCard from '@/components/ServiceCard';
import { motion } from 'framer-motion';
import AvisCard from '@/components/AvisCard';

function page() {
    const serviceItems = Array(6).fill(null);
    const avisItems = Array(12).fill(null);

    const {
        currentIndex: currentServiceIndex,
        handlePrev: handlePrevService,
        handleNext: handleNextService,
        handleIndicatorClick: handleServiceIndicatorClick,
        offset: serviceOffset,
        visibleItems: serviceVisibleItems,
      } = useCarousel(serviceItems.length, 3.5);

      const {
        currentIndex: currentAvisIndex,
        handlePrev: handlePrevAvis,
        handleNext: handleNextAvis,
        handleIndicatorClick: handleAvisIndicatorClick,
        offset: avisOffset,
        visibleItems: avisVisibleItems,
      } = useCarousel(avisItems.length, 3.5);
  return (
    <div className='mt-14'>
        <div className='bg-primary lg:h-screen flex flex-col gap-8 justify-center items-center px-4 py-8 md:px-16'>
            <div className='text-white text-lg md:text-2xl font-semibold'>Services/Nom de service</div>
            <div className='flex flex-col md:flex-row gap-8 md:gap-16'>
                <Image
                    src={`/images/serviceImg.png`}
                    alt="service"
                    layout="responsive"
                    width={32}
                    height={32}
                    className='rounded-lg'
                    priority
                />
                <div className='bg-third rounded-lg p-4 md:p-8 flex flex-col gap-4 justify-between'>
                    <div className='font-semibold text-lg md:text-xl flex justify-between items-center'>
                        <div >Prix</div>
                        <div>DA 15000</div>
                    </div>
                    <div className='flex flex-col gap-4 md:gap-2'>
                        <div className='font-semibold text-lg md:text-xl'>Documents à fournir</div>
                        <div className='grid grid-cols-1 md:grid-cols-2 text-sm md:text-base'>
                            <div>1- Documents à fournir</div>
                            <div>2- Documents à fournir</div>
                            <div>3- Documents à fournir</div>
                            <div>4- Documents à fournir</div>
                            <div>5- Documents à fournir</div>
                            <div>6- Documents à fournir</div>
                            <div>7- Documents à fournir</div>
                        </div>
                        <div className='text-sm md:text-base'>lorem ipsum lorem ipsum lorem lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsu lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ips</div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-2'>
                        <button className='btn text-xs md:text-sm bg-primary text-white py-2 px-4 rounded-md'>Commencer votre dossier</button>
                        <button className='btn text-xs md:text-sm bg-primary text-white py-2 px-4 rounded-md'>Consultaion initiale gratuite</button>
                    </div>
                </div>
            </div>
        </div>
        <section id="services" className="p-4 md:p-8 bg-third">
            <div className="">
            <div className=" font-bold text-3xl mb-4 text-center md:text-start">Nos Services</div>
            <div className="text-sm font-light text-center md:text-start text-opacity-50 mb-8">
                Our corporate law services assist businesses of all sizes with legal guidance throughout their<br className="hidden md:block"/>
                lifecycle. From incorporation to mergers and acquisitions, we offer comprehensive legal<br className="hidden md:block"/>
                support tailored to the specific needs of your business.
            </div>
            </div>
            <div className="overflow-hidden py-4">
            <motion.div
                className="flex gap-4"
                animate={{ x: `-${(currentServiceIndex * serviceOffset) / serviceVisibleItems}%` }}
                transition={{ type: "spring", stiffness: 50 }}
            >
                {serviceItems.map((_, index) => (
                <ServiceCard title="Service Title" key={index} body="Preparation, review, and negotiation of contracts to ensure compliance and protection of business interests. This includes employment contracts, vendor agreements, non-disclosure agreements (NDAs)." image="serviceImg.png" />
                ))}
            </motion.div>
            </div>
            <div className="flex justify-center items-center w-full gap-4 mt-8">
            <button onClick={handlePrevService} disabled={currentServiceIndex === 0}>
                <Icon icon="ep:arrow-left" width="24" height="24" className="btn" />
            </button>
            {serviceItems.map((_, index) => (
                <div
                key={index}
                onClick={() => handleServiceIndicatorClick(index)}
                className={`w-4 h-4 rounded-full cursor-pointer ${
                    currentServiceIndex === index ? 'bg-primary' : 'bg-secondary'
                }`}
                ></div>
            ))}
            <button onClick={handleNextService} disabled={currentServiceIndex >= serviceItems.length - 3.5}>
                <Icon icon="ep:arrow-right" width="24" height="24" className="btn" />
            </button>
            </div>
        </section>
        <section className="p-4 md:p-8 bg-[#dddddd]/30">
        <div className="overflow-hidden py-4">
          <motion.div
            className="flex gap-4"
            animate={{ x: `-${(currentAvisIndex * avisOffset) / avisVisibleItems}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            {avisItems.map((_, index) => (
              <AvisCard name="Name of customer" avis="It’s page very important for our users, take it tomorrow, plz and call me after this tasks" image="serviceImg.png" key={index} />
            ))}
          </motion.div>
        </div>
        <div className="flex justify-center items-center w-full gap-4 mt-8">
          <button onClick={handlePrevAvis} disabled={currentAvisIndex === 0}>
            <Icon icon="ep:arrow-left" width="24" height="24" className="btn" />
          </button>
          {avisItems.map((_, index) => (
            <div
              key={index}
              onClick={() => handleAvisIndicatorClick(index)}
              className={`w-4 h-4 rounded-full cursor-pointer ${
                currentAvisIndex === index ? 'bg-primary' : 'bg-secondary'
              }`}
            ></div>
          ))}
          <button onClick={handleNextAvis} disabled={currentAvisIndex >= serviceItems.length - 3.5}>
            <Icon icon="ep:arrow-right" width="24" height="24" className="btn" />
          </button>
        </div>
        <div className="flex justify-center mt-4 mb-8">
          <a href="#voirplus" className="btn bg-[#C2E6F1] rounded-md py-1 px-4 text-primary font-semibold">Voir plus{'>'}</a>
        </div>
      </section>
    </div>
  )
}

export default page