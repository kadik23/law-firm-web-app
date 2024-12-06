import React from 'react'
import Image from "next/image";

function AvisCard({name, image, avis, likes, creationDate}: avisEntity) {
  return (
    <div className="lg:max-w-[calc(100%/3)] max-w-full md:max-w-[calc(100%/2)] flex-shrink-0 py-4 px-8 rounded-lg text-white bg-primary p-4 ">
        <div className='flex gap-2 items-center'>
            <Image
                src={`/images/${image}`}
                alt="service"
                width={32}
                height={32}
                className="rounded-full"
                priority
            />
            <div className='font-semibold'>{name}</div>
        </div>
        <div className='mt-4'>{avis}</div>
    </div>
    )
}

export default AvisCard