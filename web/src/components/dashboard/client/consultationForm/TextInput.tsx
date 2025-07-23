import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, ...rest }, ref) => {
    return (
      <div className="relative flex-1 h-full">
        <label className="rounded-md absolute left-2 -top-3 bg-[#2C3E50] px-2 text-sm font-medium text-white">
          {label}
        </label>
        <input
          ref={ref}
          {...rest}
          className="h-full w-full border border-white text-white bg-transparent p-3 rounded focus:bg-white focus:text-black focus:outline-none"
        />
      </div>
    );
  }
);
TextInput.displayName = "TextInput";

export default TextInput;
