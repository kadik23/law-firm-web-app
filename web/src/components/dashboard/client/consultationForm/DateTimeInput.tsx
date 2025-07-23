import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";

interface DateTimeInputProps {
  label: string;
  name?: string;
  type: "date" | "time";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: string;
  allowedDates?: string[]; // YYYY-MM-DD
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ label, name, type, value, onChange, icon, allowedDates }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleIconClick = () => {
    if (type === "date" && allowedDates && allowedDates.length > 0) {
      setShowDropdown((prev) => !prev);
    }
  };

  const handleDateSelect = (date: string) => {
    if (onChange) {
      const fakeEvent = { target: { value: date, name }, currentTarget: { value: date, name } } as React.ChangeEvent<HTMLInputElement>;
      onChange(fakeEvent);
    }
    setShowDropdown(false);
  };

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
        className="w-full border border-white text-white bg-transparent p-3 rounded focus:bg-white \
        focus:text-black focus:outline-none appearance-none pr-10 custom-input-date"
        min={type === "date" && allowedDates && allowedDates.length > 0 ? allowedDates[0] : undefined}
        max={type === "date" && allowedDates && allowedDates.length > 0 ? allowedDates[allowedDates.length - 1] : undefined}
        list={type === "date" && allowedDates ? `${name}-dates` : undefined}
      />
      <Icon
        icon={icon}
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer \
        ${isFocused ? "text-black" : "text-white"}`}
        onClick={handleIconClick}
      />
      {/* Dropdown for allowed dates */}
      {showDropdown && type === "date" && allowedDates && allowedDates.length > 0 && (
        <div className="absolute z-50 bg-white text-black rounded shadow top-14 left-0 w-full max-h-48 overflow-y-auto">
          {allowedDates.map((date) => (
            <div
              key={date}
              className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
              onClick={() => handleDateSelect(date)}
            >
              {date}
            </div>
          ))}
        </div>
      )}
      {/* Datalist for browser-native suggestions */}
      {type === "date" && allowedDates && (
        <datalist id={`${name}-dates`}>
          {allowedDates.map((date) => (
            <option value={date} key={date} />
          ))}
        </datalist>
      )}
    </div>
  );
};

export default DateTimeInput;
