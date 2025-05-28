import DropDown from "./dropDown";

interface DropdownProps {
    categoryValue: string;
    timeValue: string;
    categoryOptions: string[];
    timeOptions: string[];
    onCategorySelect: (category: string) => void;
    onTimeSelect: (time: string) => void;
  }
  
  const FilterBar = ({
    categoryValue,
    timeValue,
    categoryOptions,
    timeOptions,
    onCategorySelect,
    onTimeSelect,
  }: DropdownProps) => {
    return (
      <div className="w-full flex-col md:flex-row px-5 py-2 justify-between lg:w-auto flex items-center gap-4 bg-primary p-2 rounded-md">
        <div className="text-white text-xs">Filter By:</div>
        <DropDown
          value={categoryValue}
          options={categoryOptions}
          onSelect={onCategorySelect}
        />
        <DropDown
          value={timeValue}
          options={timeOptions}
          onSelect={onTimeSelect}
        />
      </div>
    );
  };
  
  export default FilterBar;