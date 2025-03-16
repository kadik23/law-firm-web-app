"use client";

import useOnClickOutside from "@/hooks/useOnClickOutside";
import Image from "next/image";
import { useRef } from "react";

interface DropdownProps {
  options: string[];
  value: string;
  iconSrc: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (option: string) => void;
}

const Dropdown = ({ options, value, iconSrc, isOpen, onToggle, onSelect }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useOnClickOutside(dropdownRef, () => {
    if (isOpen) {
      onToggle();
    }
  });

  return (
    <div
      ref={dropdownRef}
      className="relative w-fit gap-3 flex items-center rounded-full border border-secondary px-2 py-1 cursor-pointer"
      onClick={onToggle}
    >
      <Image src={iconSrc} alt="icon" width={24} height={24} />
      <span className="text-secondary">{value}</span>
      <Image
        src={`/icons/dashboard/drop${isOpen ? "up" : "down"}.svg`}
        alt="dropdown"
        width={8}
        height={4}
      />
      {isOpen && (
        <div className="absolute w-[160px] bg-secondary text-white rounded-md left-0 top-9">
          {options.map((option) => (
            <div
              key={option}
              className="py-1 px-2 cursor-pointer hover:bg-gray-200 hover:text-secondary"
              onClick={() => {
                onSelect(option);
                onToggle(); // Close the dropdown after selection
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;