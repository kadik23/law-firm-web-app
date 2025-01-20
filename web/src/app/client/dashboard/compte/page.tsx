import Image from "next/image";

const Account = () => {
    const userInfo = [
        {
            id: 1,
            name: 'Yanis DR',
            email: 'anythings@gmail.com',
            image: '/images/profile.png',
            alt: "profile picture"
        },
    ];

    const infoToShow = [
        { label: 'Nom', value: 'yanis' },
        { label: 'Prénom', value: 'moha' },
        { label: 'Sex', value: 'Homme' },
        { label: 'Pays', value: 'Algérie' },
        { label: 'Age', value: '50' },
        { label: 'Ville', value: 'Boston' },
        { label: 'Numéro de téléphone', value: '06 56 62 49 81' },
    ];
    
    return (
        <div className="flex flex-col gap-10 w-full">
            {/* User Info */}
            <div className="flex items-center gap-4">
                <Image
                    src={userInfo[0].image}
                    alt={userInfo[0].alt}
                    className="rounded-full"
                    objectFit="cover"
                    width={50}
                    height={50}
                />
                <div className="flex flex-col gap-1">
                    <span className="font-semibold">{userInfo[0].name}</span>
                    <span className="text-xs text-gray-500">{userInfo[0].email}</span>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* Info to Show */}
                <div className="grid grid-cols-2 gap-6">
                    {infoToShow.slice(0, infoToShow.length - 1).map((info, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <span className="text-sm font-semibold">{info.label}</span>
                            <div className="text-sm uppercase w-full bg-[#F9F9F9] py-3 px-4 rounded-lg">
                                {info.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Last Item */}
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{infoToShow[infoToShow.length - 1].label}</span>
                    <div className="text-sm uppercase w-full bg-[#F9F9F9] py-3 px-4 rounded-lg">
                        {infoToShow[infoToShow.length - 1].value}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
