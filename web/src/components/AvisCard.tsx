import React from "react";
import Image from "next/image";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import useDateFormatter from "@/hooks/useDateFormatter";

function AvisCard({ name, image, avis, likes, creationDate }: avisEntity) {
  const formattedDate = useDateFormatter(creationDate || "");

  return (
    <div className="lg:max-w-[calc(100%/3)] max-w-full md:max-w-[calc(100%/2)] flex-shrink-0 py-4 px-8 rounded-lg text-white bg-primary p-4">
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
      {likes && creationDate && (
        <div className="pt-3 pb-5 flex items-center justify-between">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-1">
              <button>
                <Icon icon="mdi:like" width={20} />
              </button>
              {likes}
            </div>
            <div className="text-sm font-medium text-gray-300">
              {formattedDate}
            </div>
          </div>
          <div>
            <Icon icon="mdi:reply" width={20} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AvisCard;
