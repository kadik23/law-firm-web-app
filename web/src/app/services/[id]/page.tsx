"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import useCarousel from "@/hooks/useCarousel";
import ServiceCard from "@/components/ServiceCard";
import { motion } from "framer-motion";
import AvisCard from "@/components/AvisCard";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
import { useService } from "@/hooks/useService";
import { useParams } from "next/navigation";
import { useTestimonials } from "@/hooks/useTestimonials";

function Page() {
  const { id } = useParams(); 
  console.log("params id : ", id);
  const serviceId = id ? Number(id) : undefined;

  const { user: AuthUSER } = useAuth();
  const { testimonials, loading: testimonialsLoading, error: testimoniaError, refetchTestimonials } = useTestimonials();
  console.log("testimonials : ", testimonials);
  const { service, loading: serviceLoading, error: serviceError } = useService(serviceId);
  console.log("service loaded with id: ", serviceId , " service loaded: ", service);
  const { services, loading: servicesLoading, error: servicesError } = useServices();
  const avisItems = Array(12).fill(null);
  const CommentCount = avisItems.length;
  const [showCommentInput, setShowCommentInput] = useState(false);

  const {
    currentIndex: currentServiceIndex,
    handlePrev: handlePrevService,
    handleNext: handleNextService,
    handleIndicatorClick: handleServiceIndicatorClick,
    offset: serviceOffset,
    visibleItems: serviceVisibleItems,
  } = useCarousel(services.length, 3.5);

  const {
    currentIndex: currentAvisIndex,
    handlePrev: handlePrevAvis,
    handleNext: handleNextAvis,
    handleIndicatorClick: handleAvisIndicatorClick,
    offset: avisOffset,
    visibleItems: avisVisibleItems,
  } = useCarousel(avisItems.length, 3.5);

  const toggleComment = () => {
    if(AuthUSER){
      setShowCommentInput(!showCommentInput);
    } else {
      alert("Veuillez vous connecter pour commenter.");
    }
  }
  const ServiceLoadingChecker = () => {
    if (serviceLoading) return <h1 className="text-center text-6xl mt-6">Loading...</h1>;
    if (serviceError) return <h1 className="text-center text-6xl mt-6">Error: {serviceError}</h1>;
  }
  const ServicesLoadingChecker = () => {
    if (servicesLoading) return <h1 className="text-center text-6xl mt-6">Loading...</h1>;
    if (servicesError) return <h1 className="text-center text-6xl mt-6">Error: {servicesError}</h1>;
  }

  
  return (
    <div>
      
      <div className="bg-primary lg:h-screen flex flex-col gap-8 justify-center items-center px-4 py-8 md:px-16">
        <div className="text-white text-lg md:text-2xl font-semibold">
          Services/{service?.name}
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <Image
            src={service?.image ? service?.image : `/images/serviceImg.png`}
            alt="service"
            layout="responsive"
            width={32}
            height={32}
            className="rounded-lg"
            priority
          />
          <div className="bg-third rounded-lg p-4 md:p-8 flex flex-col gap-4 justify-between">
            <div className="font-semibold text-lg md:text-xl flex justify-between items-center">
              <div>Prix</div>
              <div>DA {service?.price}</div>
            </div>
            <div className="flex flex-col gap-4 md:gap-2">
              <div className="font-semibold text-lg md:text-xl">
                Documents à fournir
              </div>
                {service?.requested_files ?
                
                  <div className="grid grid-cols-1 md:grid-cols-2 text-sm md:text-base">
                    {service.requested_files.map((file, index) => <div>{index + 1} - {file}</div>)}
                  </div>

                :
                  <div className="grid grid-cols-1 md:grid-cols-2 text-sm md:text-base">
                    
                    <div>1- Documents à fournir</div>
                    <div>2- Documents à fournir</div>
                    <div>3- Documents à fournir</div>
                    <div>4- Documents à fournir</div>
                    <div>5- Documents à fournir</div>
                    <div>6- Documents à fournir</div>
                    <div>7- Documents à fournir</div>
                  </div>
                }
              <div className="text-sm md:text-base">
                {service?.description}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <button className="btn text-xs md:text-sm bg-primary text-white py-2 px-4 rounded-md">
                Commencer votre dossier
              </button>
              <button className="btn text-xs md:text-sm bg-primary text-white py-2 px-4 rounded-md">
                Consultaion initiale gratuite
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className="p-4 md:p-8 bg-[#dddddd]/30">
        <div className="relative transition-all duration-100">
          {/* comment Input */}
          {AuthUSER && showCommentInput && 
            <div className="w-full absolute top-0 bg-[#E9F4FE] border rounded-md p-4">
              <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
                <div className="flex items-center gap-1">
                  {/* profile image of the authenticated user */}
                  <button
                    className="bg-secondary w-10 h-10 rounded-full 
                    p-2 btn font-semibold text-white flex items-center justify-center"
                  >
                    {AuthUSER?.name[0]}
                  </button>
                  {/* user name  */}
                  <span className="font-semibold">
                    {AuthUSER?.name + ' ' + AuthUSER?.surname}
                  </span>
                </div>
                {/* close Icon */}
                <Icon icon="mdi:close" width={25} onClick={() => setShowCommentInput(false)}/>

              </div>
              <div className="flex flex-col md:flex-row items-center bg-[#E9F4FE] border rounded-md border-black p-2">
                <div className="flex-1 w-full">
                  <textarea
                    className="focus:outline-none resize-none w-full p-4 bg-[#E9F4FE]"
                    placeholder={`Commenter en tant que ${AuthUSER?.name}`}
                    
                  />
                  {/* emojis and files upload buttons */}
                  <div>
                    <Icon
                      icon="lucide:smile" 
                      width={18} 
                      className="rounded-full hover:text-white hover:bg-primary hover:rounded-full
                      transition duration-150 ease-in-out pl-4 mr-3"/>
                      <Icon 
                        icon="lucide:camera"
                        width={18}  
                        className="rounded-full hover:text-white hover:bg-primary hover:rounded-full
                        transition duration-150 ease-in-out" />

                  </div>
                </div>
                {/* Envoyer Button */}
                <button
                  className="self-end md:self-center text-white font-semibold px-4 py-2 rounded-md bg-primary hover:bg-secondary
                  hover:text-white hover:border-none"
                >
                  Envoyer
                </button>
              </div>
            </div>
          }
          <div className="flex items-center justify-between">
            <div className="text-primary font-bold text-3xl mb-4 text-center md:text-start">
              Avis de nos clients ({CommentCount})
            </div>
            <button
              onClick={toggleComment}
              className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md
                        flex items-center gap-1 hover:bg-secondary hover:text-white hover:border-none"
            >
              <Icon icon="mdi:comment" width={20} className="text-primary" />
              <span className="">Commenter</span>
            </button>
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
            {testimonials
            .filter((testimonial) => testimonial.serviceId === serviceId)
            .map((testimonial, index) => {
            const userObject = {name : testimonial.user.name}
            return (
              <AvisCard
                user={userObject}
                serviceId={testimonial.serviceId}
                userId={testimonial.userId}
                feedback={testimonial.feedback}
                image="serviceImg.png"
                createdAt={testimonial.createdAt}
                key={index}
              />
            );
          })}
          </motion.div>
        </div>
        <div className="flex justify-center items-center w-full gap-4 mt-8">
          <button onClick={handlePrevAvis} disabled={currentAvisIndex === 0}>
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
            disabled={currentAvisIndex >= services.length - 3.5}
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
            className="btn bg-[#C2E6F1] rounded-md py-1 px-4 text-primary font-semibold"
          >
            Voir plus{">"}
          </a>
        </div>
      </section>
      <section id="services" className="p-4 md:p-8 bg-third">
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
        {
          ServicesLoadingChecker() 
        }
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
            {services.map((service, index) => (
              <ServiceCard
                style="items-center bg-white text-textColor"
                isDescription={false}
                name={service.name}
                key={index}
                description={service.description}
                image={service.image ? service.image : `serviceImg.png`}
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
          {services.map((service, index) => (
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
