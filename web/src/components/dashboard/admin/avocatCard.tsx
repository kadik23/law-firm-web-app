import Image from "next/image";

type AvocatProps = {
    avocat: {
        id: number;
        nom: string;
        prenom: string;
        password: string;
        email: string;
        linkedin: string;
        image: string;
        selected: boolean;
    };
    toggleSelect: (id: number) => void;
};

const AvocatCard = ({ avocat, toggleSelect }: AvocatProps) => {
    return (
        <div
            className="bg-white px-4 py-2 flex flex-col items-center rounded-lg"
            style={{
                backgroundImage: "url('/icons/dashboard/admin/card-pattern.svg')",
                backgroundSize: "cover",
            }}
        >
            <div className="w-full flex justify-start">
                <input
                    type="checkbox"
                    checked={avocat.selected}
                    onChange={() => toggleSelect(avocat.id)}
                    className="cursor-pointer bg-transparent w-6 h-6"
                />
            </div>
            <div className="flex flex-col items-center">
                <Image
                    src={avocat.image}
                    alt="Avocat Image"
                    objectFit="cover"
                    width={110}
                    height={110}
                    className="rounded-full h-[110px] mb-6"
                />
                <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold text-[#202224] mb-3">{avocat.prenom} {avocat.nom}</div>
                    <div className="text-xs text-gray-500 text-[#202224/80] mb-2">{avocat.email}</div>
                    <div className="text-xs text-gray-500 text-[#202224/80] mb-4">
                        <a href={avocat.linkedin} target="_blank" className="text-blue-500">LinkedIn</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvocatCard;
