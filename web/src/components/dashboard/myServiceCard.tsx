import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { div } from "framer-motion/client";
import Image from "next/image";
import React from "react";

type MyServiceCardProps = {
  service: serviceEntity;
};
function Myservice({ service }: MyServiceCardProps) {
  return (
    <div className="rounded-xl shadow-md relative">
      <Image
        src={`/images/${service.image}`}
        alt="service"
        layout="responsive"
        width={75}
        height={25}
        className="rounded-t-xl"
        priority
      />
      <div className="flex justify-between w-full p-2">
        <div className="font-semibold text-lg">{service.title}</div>
        <div className="text-xs font-semibold btn mt-2">
          <a href={`services/${service.id}`} className="flex items-center gap-2 transition-all duration-150 hover:opacity-50">En savoir plus <Icon icon="rivet-icons:arrow-up-right" width="16" height="16"  style={{"color": "#000"}} /></a>
        </div>
      </div>
      <a href={`services/${service.id}/documents`} className="bg-btnSecondary m-4 text-white px-2 w-10/12 text-center block py-2 rounded-md transition-all duration-150 hover:opacity-80">
        Ajouter ses documents
      </a>
      <Icon icon="material-symbols:delete-rounded" width={32} className="absolute top-2 right-2 transition-all duration-150 hover:opacity-80 cursor-pointer text-secondary"/>
    </div>
  );
}

export default Myservice;
