import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useState } from "react";

type ArrayInputProps = {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
};

const ArrayInput = ({ values, onChange, placeholder = "Add item", label }: ArrayInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <div className="text-textColor text-sm font-semibold">{label}</div>}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="py-1 px-4 outline-none text-sm text-white rounded-lg border border-white placeholder:text-sm bg-transparent flex-1"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-textColor text-white px-4 py-1 rounded-lg hover:bg-opacity-90 transition-all"
        >
          Add
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-center gap-2 bg-white/10 p-2 rounded-lg">
            <span className="text-white flex-1">{value}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-600"
            >
              <Icon icon="mdi:delete" width={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArrayInput; 