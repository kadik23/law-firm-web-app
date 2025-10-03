"use client";
import useContactForm from "@/hooks/useContact";
import React from "react";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

function ContactUs() {
  const { register, onsubmit, handleSubmit, errors, isDisabled, validateForm } =
    useContactForm();
  return (
    <section
      id="contact"
      className="md:bg-[url('/images/contactBg.png')] bg-primary"
    >
      <div className="py-4 md:p-8">
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
              <div className="text-textColor text-sm font-semibold">Email</div>
              <input
                type="email"
                {...register("email", {
                  required: "email est requis",
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
              disabled={isDisabled}
              className={`${
                isDisabled
                  ? "btn_desabled active:scale-100"
                  : "btn bg-textColor"
              } py-1 px-4 text-center rounded-md text-white`}
            >
              Soumettre
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
