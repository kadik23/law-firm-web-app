"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import useCarousel from "@/hooks/useCarousel";
import ServiceCard from "@/components/ServiceCard";
import { motion } from "framer-motion";
import AvisCard from "@/components/AvisCard";
import { useAuth } from "@/hooks/useAuth";
import { useServices } from "@/hooks/useServices";
import { useService } from "@/hooks/useService";
import { useParams, useRouter } from "next/navigation";
import { useTestimonialsByService } from "@/hooks/useTestimonialsByService";
import { EmojiPicker } from "@/components/EmojiPicker";
import { useTestimony } from "@/hooks/clients/useTestimony";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAlert } from "@/contexts/AlertContext";
import Signup from "@/components/Signup";
import Signin from "@/components/Signin";
import { useAssignService } from "@/hooks/clients/useAssignService";
import Link from "next/link";
import { LoadingContext } from "@/contexts/LoadingContext";

function Page() {
  const { id } = useParams();
  const serviceId = id ? Number(id) : undefined;
  const [isSigninModalOpen, setSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [idEdit, setIdEdit] = useState<number | null>(null);
  const { user: AuthUSER } = useAuth();
  const {
    testimonials,
    loading: testimonialsLoading,
    error: testimonialError,
    fetchTestimonials,
    setTestimonials,
  } = useTestimonialsByService();
  const {
    service,
    loading: serviceLoading,
    error: serviceError,
  } = useService(serviceId);
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServices();
  const CommentCount = testimonials.length;
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const {
    comment,
    setComment,
    loading: testimonyLoading,
    testimony,
    newTestimonialObject,
    updateMyTestimonial,
    deleteMyTestimonial,
  } = useTestimony();

  const { assignService, loading } = useAssignService(parseInt(id as string));
  const router = useRouter();

  const addEmoji = (emoji: string) => {
    setComment((prev) => prev + emoji);
    setShowEmojis(false);
  };

    const {setLoading} = useContext(LoadingContext);
  
    useEffect(() => {
      setLoading(loading);
    }, [loading]);

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
  } = useCarousel(testimonials.length, 3.5);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (AuthUSER && AuthUSER.type === "admin") {
      showAlert(
        "warning",
        "Avertissement!",
        "Veuillez vous connecter pour commencer votre dossier ou consulter vos services."
      );
    }
  }, [AuthUSER]);

  const toggleComment = (id: number | null) => {
    if (AuthUSER) {
      if (id) {
        setComment(
          testimonials.find((testimonial) => testimonial.id === id)?.feedback ||
            ""
        );
        setIdEdit(id);
      }
      setShowCommentInput(!showCommentInput);
    } else {
      showAlert(
        "warning",
        "Avertissement!",
        "Veuillez vous connecter pour commenter."
      );
    }
  };
  const ServiceLoadingChecker = () => {
    if (serviceLoading) return <LoadingSpinner />;
    if (serviceError)
      return (
        <h1 className="text-center text-6xl mt-6 text-white">
          Error: {serviceError}
        </h1>
      );
    if (!serviceLoading && !service)
      return (
        <h1 className="text-center text-6xl mt-6 text-white">
          Service introuvable.
        </h1>
      );
  };
  useEffect(() => {
    fetchTestimonials(serviceId as number);
  }, []);

  useEffect(() => {
    setTestimonials((prev) => [
      ...prev,
      {
        ...newTestimonialObject,
        user: AuthUSER,
      } as avisEntity,
    ]);
  }, [newTestimonialObject]);

  const handleDelete = async (id: number) => {
    try {
      await deleteMyTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  const ServicesLoadingChecker = () => {
    if (servicesLoading) return <LoadingSpinner />;
    if (servicesError)
      return (
        <h1 className="text-center text-6xl mt-6">Error: {servicesError}</h1>
      );
    if (!servicesLoading && services.length == 0)
      return (
        <h1 className="text-center text-xl mt-6">Les services introuvable.</h1>
      );
  };

  return (
    <div>
      <div className="bg-primary flex flex-col gap-8 justify-center items-center px-4 py-8 md:px-16">
        <div className="text-white">
          <Signup
            isModalOpen={isSignupModalOpen}
            setModalOpen={setSignupModalOpen}
            setSingingModalOpen={setSigninModalOpen}
            assignService={assignService}
          />
          <Signin
            isModalOpen={isSigninModalOpen}
            setModalOpen={setSigninModalOpen}
            setSignupModalOpen={setSignupModalOpen}
            assignService={assignService}
          />
        </div>
        {ServiceLoadingChecker()}
        {service && (
          <div className="text-white text-lg md:text-2xl font-semibold">
            Services/{service?.name}
          </div>
        )}
        {service && (
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="md:w-1/2 w-full">
              <Image
                src={service?.coverImage || `/images/serviceImg.png`}
                alt="service"
                width={600}
                height={400}
                className="rounded-lg object-cover w-full h-auto"
                priority
              />
            </div>
            <div className="md:w-1/2 w-full bg-third rounded-lg p-4 md:p-8 flex flex-col gap-8 justify-between">
              <div className="font-semibold text-lg md:text-xl flex justify-between items-center">
                <div>Prix</div>
                <div>DA {service?.price}</div>
              </div>
              <div className="flex flex-col gap-4 md:gap-2">
                <div className="font-semibold text-lg md:text-xl">
                  Documents à fournir
                </div>
                {service?.requestedFiles && (
                  <div className="grid grid-cols-1 md:grid-cols-2 text-sm md:text-base">
                    {service.requestedFiles.map((file, index) => (
                      <div key={index}>
                        <span className="font-semibold">{index + 1} </span> - {file}
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-sm md:text-base">{service?.description}</div>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  onClick={() => {
                    if (AuthUSER && AuthUSER.type === "client") {
                      assignService();
                      setTimeout(
                        () =>
                          router.push(`/${AuthUSER.type}/dashboard/services`),
                        2100
                      );
                    } else if (AuthUSER && AuthUSER.type === "admin") {
                      showAlert(
                        "warning",
                        "Avertissement!",
                        "Veuillez vous connecter pour commencer votre dossier ou consulter vos services."
                      );
                    } else {
                      setSignupModalOpen(true);
                    }
                  }}
                  disabled={loading}
                  className="btn text-xs md:text-sm bg-primary text-white py-2 px-4 rounded-md"
                >
                  Commencer votre dossier
                </button>
                {!AuthUSER && (
                  <button
                    onClick={() => setSigninModalOpen(true)}
                    className="btn text-xs md:text-sm bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Consultation initiale gratuite
                  </button>
                )}
                {AuthUSER && AuthUSER.type === "client" && (
                  <Link
                    href={`/dashboard/${AuthUSER.type}/services`}
                    className="btn text-xs md:text-sm bg-primary text-white py-2 px-4 rounded-md"
                  >
                    Consultation initiale gratuite
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <section className="p-4 md:p-8 bg-[#dddddd]/30">
        <div className="relative transition-all duration-100">
          {/* comment Input */}
          {AuthUSER && showCommentInput && (
            <div className="w-full z-50 absolute top-0 border border-primary bg-[#E9F4FE] rounded-md p-4">
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
                    {AuthUSER?.name + " " + AuthUSER?.surname}
                  </span>
                </div>
                {/* close Icon */}
                <Icon
                  icon="mdi:close"
                  width={32}
                  onClick={() => setShowCommentInput(false)}
                  className="hover:text-textColor cursor-pointer"
                />
              </div>
              <div className="flex flex-col md:flex-row items-center bg-[#E9F4FE] border rounded-md border-black p-2">
                <div className="flex-1 w-full">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="focus:outline-none resize-none w-full p-4 bg-[#E9F4FE] placeholder:text-sm"
                    placeholder={`Commenter en tant que ${AuthUSER?.name}`}
                  />
                  <div className="relative">
                    <Icon
                      icon="lucide:smile"
                      width={24}
                      onClick={() => setShowEmojis((prev) => !prev)}
                      className="cursor-pointer hover:text-white hover:bg-primary p-2 rounded-full transition"
                    />
                    {showEmojis && <EmojiPicker onSelect={addEmoji} />}
                  </div>
                </div>
                {/* Envoyer Button */}
                <button
                  disabled={testimonialsLoading}
                  onClick={async () => {
                    if (comment == "")
                      showAlert(
                        "warning",
                        "Avertissement!",
                        "Veuillez remplir le champ d'entrée."
                      );
                    else {
                      if (idEdit) {
                        await updateMyTestimonial(idEdit);
                        testimonials.find(
                          (testimonial) => testimonial.id === idEdit
                        )!.feedback = comment;
                        setIdEdit(null);
                      } else {
                        testimony(serviceId as number);
                      }
                      setShowCommentInput(false);
                    }
                  }}
                  className="self-end md:self-center text-white font-semibold px-4 py-2 rounded-md bg-primary hover:bg-secondary
                  hover:text-white hover:border-none text-sm"
                >
                  {testimonyLoading ? <LoadingSpinner /> : <span>Envoyer</span>}
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-primary font-bold text-3xl mb-4 text-center md:text-start">
              Avis de nos clients ({CommentCount})
            </div>
            <button
              onClick={() => {
                if (AuthUSER && AuthUSER.type === "client") {
                  toggleComment(null);
                  setComment("");
                } else {
                  showAlert(
                    "warning",
                    "Avertissement!",
                    "Veuillez vous connecter en tant que client pour commenter ."
                  );
                }
              }}
              className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md
                        flex items-center gap-1 hover:bg-secondary hover:text-white hover:border-none"
            >
              <Icon icon="mdi:comment" width={20} className="text-primary" />
              <span className="">Commenter</span>
            </button>
          </div>
        </div>
        {testimonialError}
        <div className="overflow-hidden py-4">
          <motion.div
            className="flex gap-4"
            animate={{
              x: `-${(currentAvisIndex * avisOffset) / avisVisibleItems}%`,
            }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            {testimonialsLoading
              ? "Chargement des avis..."
              : testimonials.map((testimonial, index) => {
                  const userObject = { name: testimonial.user.name };
                  return (
                    <AvisCard
                      handleDelete={handleDelete}
                      toggleComment={toggleComment}
                      user={userObject}
                      id={testimonial.id}
                      userId={testimonial.userId}
                      feedback={testimonial.feedback}
                      createdAt={testimonial.createdAt}
                      key={index}
                    />
                  );
                })}
            {testimonials.length == 0 &&
              !testimonialsLoading &&
              "Testimonials introuvable."}
          </motion.div>
        </div>
        {testimonials.length > 0 && (
          <div className="flex justify-center items-center w-full gap-4 mt-8">
            <button
              onClick={handlePrevAvis}
              disabled={currentAvisIndex === 0}
              className="flex items-center"
            >
              <Icon
                icon="ep:arrow-left"
                width="24"
                height="24"
                className="btn"
              />
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
        )}
        {testimonials.length > 0 && (
          <div className="flex justify-center mt-4 mb-8">
            <button
              onClick={handleNextAvis}
              className="btn bg-[#C2E6F1] rounded-md py-1 px-4 text-primary font-semibold"
            >
              Voir plus{">"}
            </button>
          </div>
        )}
      </section>
      <section id="services" className="p-4 md:p-8 bg-third">
        <div className="">
          <div className=" font-bold text-3xl mb-4 text-center md:text-start">
            Nos Services
          </div>
          <div className="text-sm font-light text-center md:text-start text-opacity-50 mb-8">
            Nos services en droit des sociétés accompagnent les entreprises de toutes tailles
            avec des conseils juridiques tout au long de leur
            <br className="hidden md:block" />
            cycle de vie. De la création à la fusion-acquisition, nous offrons une assistance
            juridique complète
            <br className="hidden md:block" />
            adaptée aux besoins spécifiques de votre entreprise.
          </div>
        </div>
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
            {services.map((service, index) => (
              <ServiceCard
                style="items-center bg-white text-textColor w-64"
                isDescription={false}
                name={service.name}
                key={index}
                id={service.id as number}
                description={service.description}
                coverImage={service.coverImage}
              />
            ))}
          </motion.div>
        </div>
        <div className="flex justify-center items-center w-full gap-4 mt-8">
          <button
            className="flex items-center"
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
            className="flex items-center"
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
