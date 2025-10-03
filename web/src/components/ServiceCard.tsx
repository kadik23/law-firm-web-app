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
  const isValidCover =
    typeof coverImage === "string" &&
    coverImage.trim() !== "" &&
    (coverImage.startsWith("http") ||
      coverImage.startsWith("/") ||
      coverImage.startsWith("data:image"));

  const safeCoverImage = isValidCover
    ? coverImage
    : "/images/default-service.png";

  return (
    <div className="max-w-full lg:max-w-[calc(100%/4)] md:max-w-[calc(100%/2)] w-full flex-shrink-0 h-full shadow-lg rounded-md bg-white flex flex-col">
      <Image
        src={safeCoverImage}
        alt="service"
        title={name}
        width={400}
        height={250}
        className="w-full h-48 object-cover rounded-t-md"
      />
      <div className={`flex-1 p-2 flex flex-col justify-between ${style}`}>
        <div>
          <div className="font-semibold text-lg text-textColor">{name}</div>
          {isDescription && (
            <div className="text-xs">{descriptionTruncated}</div>
          )}
        </div>
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
