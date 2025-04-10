type DeleteConfirmationProps = {
    selectedAvocats: {
        id?: number;
        name: string;
        surname: string;
    }[];
    onCancel: () => void;
    onConfirm: () => void;
};

export const DeleteConfirmation = ({
    selectedAvocats,
    onCancel,
    onConfirm
}: DeleteConfirmationProps) => {
    return (
        <>
            <div className="text-center text-white font-semibold text-xl my-4">
                Do you want to delete {selectedAvocats.length > 1 ? 'these lawyers' : 'this lawyer'}?
            </div>
            
            <div className="mb-6">
                {selectedAvocats.map((avocat, index) => (
                    <div key={avocat.id} className="text-white mb-2">
                        {index + 1} - {avocat.surname} {avocat.name}
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