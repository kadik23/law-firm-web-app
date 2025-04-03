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
      <div className="w-full justify-between lg:w-auto flex items-center gap-4 bg-primary p-2 rounded-md">
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
        <button className="bg-secondary text-white px-4 py-1 rounded-md text-sm hover:bg-white hover:text-secondary">
          Filtrer
        </button>
      </div>
    );
  };
  
  export default FilterBar;