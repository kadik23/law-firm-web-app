import React from "react";
import Image from "next/image";
import useTruncateText from "@/hooks/useTruncateText";
import Link from "next/link";

type ServiceCardProps = serviceEntity & {
  isDescription: boolean;
  style: string;
  coverImage: string;
  id: number;
};

function ServiceCard({
  name,
  description,
  coverImage,
  id,
  isDescription,
  style,
}: ServiceCardProps) {
  const descriptionTruncated = useTruncateText(description, 100);
  return (
    <div className="max-w-full lg:max-w-[calc(100%/4)] md:max-w-[calc(100%/2)] w-full flex-shrink-0 h-full shadow-lg rounded-md bg-white">
      <Image
        src={`${coverImage}`}
        alt="service"
        layout="responsive"
        width={125}
        height={125}
        priority
      />
      <div className={`p-2 flex flex-col justify-center ${style} py-2`}>
        <div className="font-semibold text-lg text-textColor">{name}</div>
        {isDescription && <div className="text-xs">{descriptionTruncated}</div>}
        <div className="text-xs font-semibold btn mt-2">
          <Link href={`/services/${id}`} className="text-textColor">
            En savoir plus &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
