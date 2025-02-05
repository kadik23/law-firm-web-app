import React from "react";

function AvocatCard({ attorney, attorneyNbr }: { attorney: avocatEntity, attorneyNbr: number }) {
  return (
    <div className={`${attorneyNbr >= 4 ? 'lg:w-[calc(100%/4)]' : `lg:w-[calc(100%/${attorneyNbr})]`} w-full md:w-[calc(100%/3)] overflow-hidden rounded-lg bg-white`}>
      <div
        className="bg-cover bg-center h-40 "
        style={{ backgroundImage: `url(${attorney.picture})` }}
      >
        <div className="text-white font-bold text-xl pl-2 pt-2">
          {attorney.name}
        </div>
        <div className="text-white text-md pl-2">
          Member since {attorney.createdAt.split("T")[0]}
        </div>
      </div>
      <div className="py-4 px-2 flex items-center justify-center">
        <a
          href={attorney.linkedin_url}
          className="btn w-full text-center bg-secondary text-sm px-2 py-2 rounded-md text-white"
        >
          Voir son LinkedIn{" "}
        </a>
      </div>
    </div>
  );
}

export default AvocatCard;
