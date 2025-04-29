"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface DropdownProps {
  value: string;
  options: string[];
  onSelect: (option: string) => void;
}

const DropDown = ({ value, options, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        className="flex items-center justify-between px-3 py-1 gap-2 text-sm rounded-md bg-primary text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <Image
          src={`/icons/dashboard/drop${isOpen ? "up" : "down"}.svg`}
          alt={isOpen ? "Close" : "Open"}
          width={8}
          height={4}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full min-w-[160px] bg-white rounded-md shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                value === option
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(option)}
            >
              {value === option && (
                <Image
                  src="/icons/dashboard/check.svg"
                  alt="Selected"
                  width={16}
                  height={16}
                  className="text-white"
                />
              )}
              <span>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;