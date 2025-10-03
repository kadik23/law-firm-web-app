import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type MyServiceCardProps = {
  service: serviceEntity;
  remService: (id: number) => void;
};
function Myservice({ service, remService }: MyServiceCardProps) {
    const isValidCover =
  typeof service.coverImage === "string" &&
  service.coverImage.trim() !== "" &&
  (service.coverImage.startsWith("http") || service.coverImage.startsWith("/") || service.coverImage.startsWith("data:image"));

  const safeCoverImage = isValidCover ? service.coverImage : "/images/default-service.png";

  return (
    <div className="rounded-xl shadow-md relative">
      <Image
        src={safeCoverImage}
        alt="service"
        width={500}
        height={300}
        className="rounded-t-xl w-full h-36 sm:h-49 md:h-48 lg:h-52 object-cover"
      />
      <div className="flex justify-between w-full p-2">
        <div className="font-semibold text-lg">{service.name}</div>
        <div className="text-xs font-semibold btn mt-2">
          <Link
            href={`/services/${service.id}`}
            className="flex items-center gap-2 transition-all duration-150 hover:opacity-50"
          >
            En savoir plus{" "}
            <Icon
              icon="rivet-icons:arrow-up-right"
              width="16"
              height="16"
              style={{ color: "#000" }}
            />
          </Link>
        </div>
      </div>
      <a
        href={`services/${service.id}/documents`}
        className="bg-btnSecondary m-4 text-white px-2 w-10/12 text-center block py-2 rounded-md transition-all duration-150 hover:opacity-80"
      >
        Ajouter ses documents
      </a>
      <Icon
        icon="material-symbols:delete-rounded"
        onClick={() => remService(service.request_service_id as number)}
        width={32}
        className="absolute top-2 right-2 transition-all duration-150 hover:opacity-80 cursor-pointer text-secondary"
      />
    </div>
  );
}

export default Myservice;
