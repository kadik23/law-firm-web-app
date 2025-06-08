import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Link from "next/link";

const ServiceCard = ({
  service,
  toggleSelect,
}: {
  service: serviceEntity & { selected?: boolean };
  toggleSelect: (id: number) => void;
}) => {

  return (
    <div
      className="w-full p-2 flex flex-col shadow-md rounded-md"
      style={{
        backgroundImage: "url('/icons/dashboard/admin/card-pattern.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full relative">
        <img
          src={service.coverImage}
          alt={service.name}
          className="rounded-md w-full object-cover mb-2 h-32 border"
        />
        <input
          type="checkbox"
          name="service-checkbox"
          className="w-5 h-5 absolute left-2 top-2"
          checked={service.selected}
          onChange={() => toggleSelect(service.id as number)}
        />
      </div>
      <div className="mb-3 flex flex-col items-center gap-1">
        <h3 className="text-sm font-semibold text-gray-900 text-center">
          {service.name}
        </h3>
        <p className="text-sm  text-justify text-center">{service.price} DA
            
        </p>
        <div className="flex justify-center items-center gap-2">
          <p className="text-sm text-gray-500 text-justify text-center">
            Description: {service.description.slice(0, 100)}...
          </p>
          <Link
            href={`/admin/dashboard/services/${service.id}`}
            className="text-sm flex gap-1 items-center hover:text-primary text-textColor"
          >
            Voir en détaille
            <Icon icon="mdi:arrow" width={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
