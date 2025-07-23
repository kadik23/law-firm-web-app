import React from "react";

interface SelectInputProps {
  label: string;
  name?: string;
  value?: string;
  options: { label: string; value: string }[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, name, value, options, onChange }) => {
  return (
    <div className="relative flex-1 h-full">
      <label className="rounded-md absolute left-2 -top-3 bg-[#2C3E50] px-2 text-sm font-medium text-white">
        {label}
      </label>
      <select
        {...(name ? { name } : {})}
        {...(value !== undefined ? { value } : {})}
        {...(onChange ? { onChange } : {})}
        className="h-full w-full border border-white text-white bg-transparent 
        p-3 rounded focus:bg-white focus:text-black focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
