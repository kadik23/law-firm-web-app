type DeleteConfirmationProps = {
    selectedItems: {
        id: number;
        title?: string;
    }[];
    itemName?: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export const DeleteConfirmation = ({
    selectedItems,
    itemName,
    onCancel,
    onConfirm
}: DeleteConfirmationProps) => {
    return (
        <>
            <div className="text-center text-white font-semibold text-xl my-4">
                Are you sure you want to delete {selectedItems.length > 1 ? 'these' : 'this'} {itemName}{selectedItems.length > 1 ? 's' : ''}?
            </div>
            
            <div className="mb-6">
                {selectedItems.map((item, index) => (
                    <div key={item.id} className="text-white mb-2">
                        {index + 1} - {item.title}
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