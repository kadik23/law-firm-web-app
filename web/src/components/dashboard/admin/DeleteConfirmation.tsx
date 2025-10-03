type DeleteConfirmationProps = {
  selectedAvocats:
    | (avocatEntity & { selected?: boolean } & { User?: User })[]
    | {
        id: number;
        title: string;
      }[];
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  itemType?: string;
};

export const DeleteConfirmation = ({
  selectedAvocats,
  onCancel,
  onConfirm,
  itemType = "lawyer",
  loading = false,
}: DeleteConfirmationProps) => {
  return (
    <>
      <div className="text-center text-white font-semibold text-xl my-4">
        Do you want to delete{" "}
        {selectedAvocats.length > 1 ? `these ${itemType}s` : `this ${itemType}`}?
      </div>

      <div className="mb-6">
        {selectedAvocats.map((avocat, index) => (
          <div key={avocat.id} className="text-white mb-2">
            {index + 1} - {
              'title' in avocat 
                ? avocat.title 
                : `${avocat.User?.surname || ''} ${avocat.User?.name || ''}`
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
          disabled={loading}
          onClick={onConfirm}
          className="bg-textColor text-white w-full font-bold py-2 px-14 rounded-md text-sm"
        >
          Delete
        </button>
      </div>
    </>
  );
};
