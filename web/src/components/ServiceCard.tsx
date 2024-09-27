import React from 'react'
import Image from "next/image";


function ServiceCard({ title, body, image }: serviceEntity) {
    return (
        <div className="lg:max-w-[calc(100%/3.5)] max-w-full md:max-w-[calc(100%/2)] flex-shrink-0 p-4 shadow-lg rounded-md bg-white">
            <Image
                src={`/images/${image}`}
                alt="service"
                layout="responsive"
                width={125}
                height={125}
                priority
            />
            <div className="p-2 flex flex-col items-start justify-center">
                <div className="text-textColor font-semibold text-xl">{title}</div>
                <div >{body}</div>
                <div className="text-textColor text-sm font-semibold btn mt-2">
                    <a href='#service'>Learn More &gt;</a>
                </div>
            </div>
        </div>
    )
}

export default ServiceCard