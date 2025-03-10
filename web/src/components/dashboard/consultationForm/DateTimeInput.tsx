import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";

interface DateTimeInputProps {
  label: string;
  name: string;
  type: "date" | "time";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: string;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ label, name, type, value, onChange, icon }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="flex-1 relative">
      <label className="absolute left-2 -top-2 bg-[#2C3E50] px-2 text-sm font-medium text-white z-50">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full border border-white text-white bg-transparent p-3 rounded focus:bg-white 
        focus:text-black focus:outline-none appearance-none pr-10 custom-input-date"
      />
      <Icon
        icon={icon}
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none 
        ${isFocused ? "text-black" : "text-white"}`}
      />
    </div>
  );
};

export default DateTimeInput;
