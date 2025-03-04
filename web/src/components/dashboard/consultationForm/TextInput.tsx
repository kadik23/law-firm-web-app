import React from "react";

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) => {
  return (
    <div className="relative flex-1 h-full">
      <label className="rounded-md absolute left-2 -top-3 bg-[#2C3E50] 
      px-2 text-sm font-medium text-white">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="h-full w-full border border-white text-white bg-transparent 
                p-3 rounded focus:bg-white focus:text-black focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextInput;
