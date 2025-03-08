import React from "react";

interface RadioGroupProps {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, selectedValue, onChange }) => {
  return (
    <div className="relative w-full mt-4">
      <label className="rounded-md absolute left-2 -top-3 bg-[#2C3E50] px-2 text-sm font-medium text-white z-50">
        {label}
      </label>
      <div className="flex items-center gap-4 mt-1 p-3 border border-white rounded-md">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={onChange}
              className="accent-blue-600"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
