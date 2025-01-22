import React from "react";
import Image from "next/image";

type ServiceCardProps = serviceEntity & {
  isDescription: boolean;
  style: string
};

function ServiceCard({ title, body, image, isDescription, style }: ServiceCardProps) {
  return (
    <div className="lg:max-w-[calc(100%/3.5)] max-w-full md:max-w-[calc(100%/2)] flex-shrink-0 shadow-lg rounded-md bg-white">
      <Image
        src={`/images/${image}`}
        alt="service"
        layout="responsive"
        width={125}
        height={125}
        priority
      />
      <div className={`p-2 flex flex-col justify-center ${style} py-2`}>
        <div className="font-semibold text-lg">{title}</div>
        {isDescription && <div>{body}</div>}
        <div className="text-xs font-semibold btn mt-2">
          <a href="#service">En savoir plus &gt;</a>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
