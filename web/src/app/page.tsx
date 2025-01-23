import AvisCard from "@/components/AvisCard";
import AvocatCard from "@/components/AvocatCard";
import Map from "@/components/Map";
import ServiceCard from "@/components/ServiceCard";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { motion } from "framer-motion";
import useCarousel from "@/hooks/useCarousel";
import Link from "next/link";
import useContactForm from "@/hooks/useContact";

export default function Home() {
  const directions = [
    { text: "Résoudre mon probèlme", link: "/trouver_ma_solution" },
    { text: "Enrichir ma culture juridique", link: "/" },
    { text: "Je veux être informé sur n'importe quelle question", link: "/" },
  ];
  const serviceItems = Array(6).fill(null);
  const avocatItems = Array(12).fill(null);
  const avisItems = Array(12).fill(null);
  const {
    currentIndex: currentServiceIndex,
    handlePrev: handlePrevService,
    handleNext: handleNextService,
    handleIndicatorClick: handleServiceIndicatorClick,
    offset: serviceOffset,
    visibleItems: serviceVisibleItems,
  } = useCarousel(serviceItems.length, 3.5);
  const { register, onsubmit, handleSubmit, errors, isDisabled, validateForm } =
    useContactForm();
  const {
    currentIndex: currentAvisIndex,
    handlePrev: handlePrevAvis,
    handleNext: handleNextAvis,
    handleIndicatorClick: handleAvisIndicatorClick,
    offset: avisOffset,
    visibleItems: avisVisibleItems,
  } = useCarousel(avisItems.length, 3.5);

  return (
    <div className="min-h-screen mt-8">
      <section
        id="accueil"
        className="bg-[url('/images/slide.png')] bg-cover bg-center h-screen p-4 md:p-8"
      >
        <div className="flex flex-col items-start my-8 text-white">
          <div className="font-semibold text-2xl mb-4 text-center md:text-start">
            Les solutions juridiques commencent ici
          </div>
          <div className="text-sm font-light text-center md:text-start text-opacity-50 mb-4">
            LowSite est la première source d{"'"}informations{" "}
            <br className="hidden md:block lg:hidden" /> et de ressources{" "}
            <br className="hidden lg:block" /> juridiques gratuites en ligne en
            Algérie.
          </div>
          <button className="bg-[#37526D] mb-4 rounded-md p-2 btn font-semibold shadow-lg">
            Réserver une consultation gratuite
          </button>
          <div className="bg-third p-2 mb-4 flex flex-col items-start rounded-md text-primary">
            <div className="m-2 text-xl font-semibold">Je veux...</div>
            <ul>
              {directions &&
                directions.map((direction, index) => (
                  <Link
                    href={direction.link}
                    key={index}
                    className="flex items-center hover:bg-primary cursor-pointer active:scale-105 transition-all duration-150 hover:text-white hover:border-white justify-between p-2 m-2 gap-4 text-sm font-semibold rounded-sm border border-primary"
                  >
                    <div>{direction.text}</div>
                    <div className="p-1 peer-hover:text-white hover:border-white flex justify-center items-center border border-primary rounded-sm">
                      <Icon
                        icon="solar:arrow-right-outline"
                        width="24"
                        height="24"
                      />
                    </div>
                  </Link>
                ))}
            </ul>
          </div>
        </div>
      </section>
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
            <Icon
              icon="ep:arrow-right"
              width="24"
              height="24"
              className="btn"
            />
          </button>
        </div>
      </section>
      <section id="avocats">
        <div className="flex flex-col items-start gap-2 p-4 md:p-8">
          <div className=" font-bold text-3xl">A propos</div>
          <div className="">
            Nos services en droit des sociétés assistent les entreprises de
            toutes tailles avec des conseils juridiques tout au long de leur
            cycle de vie. De la constitution aux fusions et acquisitions, nous
            proposons un accompagnement juridique complet adapté aux besoins
            spécifiques de votre entreprise.{" "}
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
      <section
        id="contact"
        className="md:bg-[url('/images/contactBg.png')] bg-primary lg:h-screen"
      >
        <div className="p-4 md:p-8">
          <div className=" font-bold text-3xl md:text-4xl text-center text-white py-4">
            Contactez Nous !
          </div>
          <div className="p-4 md:p-8 flex flex-col md:flex-row items-center gap-4 lg:gap-0 lg:justify-between">
            <Map />
            <form
              onSubmit={handleSubmit(onsubmit)}
              className="md:w-5/12 w-full flex flex-col gap-4 border border-white rounded-lg p-4"
            >
              <div className="flex flex-col justify-start gap-2">
                <div className="text-textColor text-sm font-semibold">Name</div>
                <input
                  type="text"
                  placeholder="Enter votre name"
                  className="py-1 px-4 outline-none text-white rounded-lg border border-white bg-transparent"
                  {...register("name", {
                    required: "nom est requis",
                  })}
                />
                {errors.name && <p className="error">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col justify-start gap-2">
                <div className="text-textColor text-sm font-semibold">
                  Surname
                </div>
                <input
                  type="text"
                  placeholder="Enter votre surname"
                  className="py-1 px-4 outline-none text-white rounded-lg border border-white bg-transparent"
                  {...register("surname", {
                    required: "prénom est requis",
                  })}
                />
                {errors?.surname?.message && (
                  <p className="error" style={{ color: "red" }}>
                    {errors?.surname.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col justify-start gap-2">
                <div className="text-textColor text-sm font-semibold">
                  Email
                </div>
                <input
                  type="email"
                  {...register("email", {
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Format d'email invalide",
                    },
                    validate: {
                      notAdmin: (fieldValue) => {
                        return (
                          fieldValue !== "admin@example.com" ||
                          "Enter a different email address"
                        );
                      },
                      notBlackListed: (fieldValue) => {
                        return (
                          !fieldValue.endsWith("baddomain.com") ||
                          "this Domain is not supported"
                        );
                      },
                    },
                  })}
                  placeholder="Enter votre email"
                  className="py-1 px-4 outline-none text-white rounded-lg border border-white bg-transparent"
                />
                {errors?.email?.message && (
                  <p className="error">{errors?.email.message}</p>
                )}
              </div>
              <div className="flex flex-col justify-start gap-2">
                <div className="text-textColor text-sm font-semibold">
                  Message
                </div>
                <textarea
                  placeholder="Enter votre message"
                  className="py-1 px-4 outline-none w-full text-white rounded-lg border border-white bg-transparent"
                  {...register("message", {
                    required: "message est requis",
                  })}
                />
                {errors?.message?.message && (
                  <p className="error" style={{ color: "red" }}>
                    {errors?.message.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => validateForm()}
                className={`${
                  isDisabled
                    ? "btn_desabled active:scale-100"
                    : "btn bg-textColor"
                } py-1 px-4 text-center rounded-md text-white`}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
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
            {avisItems.map((_, index) => (
              <AvisCard
                name="Name of customer"
                avis="It’s page very important for our users, take it tomorrow, plz and call me after this tasks"
                image="serviceImg.png"
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
            className="btn bg-[#C2E6F1] rounded-md py-1 px-4 text-primary font-semibold"
          >
            Voir plus{">"}
          </a>
        </div>
      </section>
    </div>
  );
}
