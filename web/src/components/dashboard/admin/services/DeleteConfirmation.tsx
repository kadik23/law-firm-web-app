type DeleteConfirmationProps = {
  selectedServices:
      | (serviceEntity & { selected?: boolean })[]
    | {
        id: number;
        title: string;
      }[];
  onCancel: () => void;
  onConfirm: () => void;
  itemType?: string;
};

export const DeleteConfirmation = ({
  selectedServices,
  onCancel,
  onConfirm,
  itemType = "service",
}: DeleteConfirmationProps) => {
  return (
    <>
      <div className="text-center text-white font-semibold text-xl my-4">
        Do you want to delete{" "}
        {selectedServices.length > 1 ? `these ${itemType}s` : `this ${itemType}`}?
      </div>

      <div className="mb-6">
        {selectedServices.map((service, index) => (
          <div key={service.id} className="text-white mb-2">
            {index + 1} - {
              'name' in service 
                ? service.name 
                : `${service.title || ''}`
            }
          </div>
        ))}
      </div>

      <div className="flex items-center pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-[#F2F3F4] mr-3 w-full text-primary font-bold py-2 px-14 rounded-md text-sm"
        >
          Return
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="bg-textColor text-white w-full font-bold py-2 px-14 rounded-md text-sm"
        >
          Delete
        </button>
      </div>
    </>
  );
};
