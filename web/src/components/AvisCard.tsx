import React from "react";
import Image from "next/image";
import useDateFormatter from "@/hooks/useDateFormatter";

function AvisCard({ name, image, avis, creationDate }: avisEntity) {
  const formattedDate = useDateFormatter(creationDate || "");

  return (
    <div className="lg:max-w-[calc(100%/3)] max-w-full md:max-w-[calc(100%/2)] flex-shrink-0 py-6 px-8 rounded-lg text-white bg-primary">
      <div className="flex gap-2 items-center">
        <Image
          src={`/images/${image}`}
          alt="service"
          width={32}
          height={32}
          className="rounded-full"
          priority
        />
        <div className="font-semibold">{name}</div>
      </div>
      <div className="mt-4">{avis}</div>
      {creationDate && (
        <div className="pt-3 flex items-center justify-between">
          <div className="flex flex-col items-start">
            <div className="text-sm font-medium text-gray-300">
              {formattedDate}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvisCard;
