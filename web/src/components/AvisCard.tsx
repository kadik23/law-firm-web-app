import React from "react";
import Image from "next/image";
import useDateFormatter from "@/hooks/useDateFormatter";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

function AvisCard({ user , image, feedback, createdAt, userId, serviceId }: avisEntity) {
  const formattedDate = useDateFormatter(createdAt || "");
  const {user : USERAuth} = useAuth();

  return (
    <div className="lg:max-w-[calc(100%/3)] max-w-full md:max-w-[calc(100%/2)] flex-shrink-0 py-6 px-8 rounded-lg text-white bg-primary">
      <div className="flex gap-4 items-center">
        <Image
          src={`/images/${image}`}
          alt="service"
          width={32}
          height={32}
          className="rounded-full"
          priority
        />
        <div className="font-semibold">{user.name}</div>
      </div>
      <div className="my-2 text-sm">{feedback}</div>
      {/* delete and modify buttons for authenticated users only */}
      <div className="pt-2 flex items-center justify-between">
        {USERAuth?.id == userId && (
          <div className="flex gap-2 items-center mr-4">
            {/* delete button */}
            <button className="px-3 py-1 border rounded-md border-white text-sm 
            flex items-center gap-1 bg-[rgba(217,217,217,0.26)] hover:bg-secondary">
              <Icon icon="mdi:trash-can" width={25} />
              Supprimer
            </button>
            {/* modify button */}
            <button className="px-3 py-1 border rounded-md border-white text-sm 
            flex items-center gap-1 bg-[rgba(217,217,217,0.26)] hover:bg-secondary">
              <Icon icon="mdi:pencil" width={25} />
              Modify
            </button>
          </div>
        )}
        {createdAt && (
          <div className="flex flex-col items-start">
            <div className="text-xs font-medium text-gray-300">
              {formattedDate}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AvisCard;
