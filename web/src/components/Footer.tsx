import React from 'react'
import Image from "next/image";

function Footer() {
    return (
        <div className='flex flex-col gap-8 bg-primary px-8 md:px-32 pb-8 pt-16 text-white'>
            <div className='flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between items-center font-semibold'>
                <div>
                    <Image
                        src="/images/whiteLogo.png"
                        alt="logo"
                        width={150}
                        height={150}
                        priority
                    />
                </div>
                <div className='flex items-start gap-8 '>
                    <div className='flex flex-col gap-2'>
                        <a href='#Features'>Features</a>
                        <a href='#Pricing'>Pricing</a>
                        <a href='#Services'>Services</a>
                        <a href='#Partners'>Partners</a>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <a href='#About Us'>About Us</a>
                        <a href='#Help Center'>Help Center</a>
                        <a href='#Case Studies'>Case Studies</a>
                        <a href='#Contact Us'>Contact Us</a>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <a href='#Twitter'>Twitter</a>
                        <a href='#Facebook'>Facebook</a>
                        <a href='#Instagram'>Instagram</a>
                        <a href='#LinkedIn'>LinkedIn</a>
                    </div>
                </div>
            </div>
            <div className='text-sm'>
                <hr className='my-4'/>
                <div className='flex flex-col md:flex-row gap-8 justify-between'>
                    <div className='text-center'>© 2025 LawSite, All rights reserved.</div>
                    <div className='flex gap-4'>
                        <a href='#Terms & Conditions'>Terms & Conditions</a>
                        <a href='#Privacy Policy'>Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer