import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';

function Footer() {
    return (
        <div className='flex flex-col gap-8 bg-primary px-4 md:px-32 pb-8 pt-16 text-white'>
            <hr className='my-4 hidden md:block'/>
            <div className='flex flex-wrap gap-4 md:gap-0 md:justify-between items-center '>
                <Image
                    src="/images/whiteLogo.png"
                    alt="logo"
                    width={150}
                    height={150}
                    priority
                />
                <hr className='md:hidden my-4 w-full order-3'/>
                <div className='flex flex-col gap-2 md:gap-4 items-center text-xs font-light md:text-base order-3 md:order-2'>
                    <div className='flex gap-2 items-center'>
                        <Icon icon="mdi:location" width="20" height="20" />
                        <div>345 Faulconer Drive, Suite 4 • Charlottesville, CA, 12345</div>
                    </div>
                    <div className='flex items-start w-full justify-between gap-2 flex-col md:flex-row'>
                        <div className='flex gap-2 items-center'>
                            <Icon icon="ic:baseline-phone" width="20" height="20" />
                            <div>(123) 456-7890</div>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <Icon icon="entypo:old-phone" width="20" height="20" />     
                            <div>(123) 456-7890</div>
                        </div>
                    </div>
                    <div className='flex gap-4 flex-col md:flex-row'>
                        <div className='hidden md:block'>Social Media</div>
                        <div className='flex gap-2 items-center mt-4 md:mt-0'>
                            <Icon icon="devicon-plain:facebook" width="20" height="20" /> 
                            <Icon icon="ic:sharp-whatsapp" width="20" height="20" />
                            <Icon icon="flowbite:linkedin-solid" width="20" height="20" />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-2 text-xs md:text-sm text-start order-2 md:order-3'>
                    <a href='#Home'>HOME</a>
                    <a href='#A Propos'>A PROPOS</a>
                    <a href='#Nos services'>Nos services</a>
                    <a href='#nos avocats'>nos avocats</a>
                    <a href='#l’avis de nos clients'>l’avis de nos clients</a>
                </div>
            </div>
            <div className='text-sm'>
                <hr className='my-4'/>
                <div className='text-center text-sm md:text-base font-thin text-nowrap'>© 2025 LawSite, All rights reserved.</div>
            </div>
        </div>
    )
}

export default Footer