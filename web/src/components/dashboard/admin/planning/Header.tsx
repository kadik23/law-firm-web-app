import React from "react";

export const Header = ({ onManageClick }: { onManageClick: () => void }) => (
  <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-0 md:items-center mb-6">
    <h1 className="text-xl md:text-3xl font-bold">Planning</h1>
    <div className="flex gap-4">
      <button
        onClick={onManageClick}
        className="bg-gray-800 text-sm md:text-base text-white px-4 py-2 rounded-md hover:bg-gray-900"
      >
        Manage recurring time
      </button>
    </div>
  </div>
);
