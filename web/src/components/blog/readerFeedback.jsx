"use client";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

const ReaderFeedback = () => {
    return (
        <div className="py-4 mb-8">
            <div className="w-full flex items-center justify-between py-4">
                <div className="font-bold text-3xl md:text-4xl text-center text-primary">
                    Avis des lecteurs de ce blog (255)
                </div>
                <button className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md
                        flex items-center gap-1">
                            {/* comment icon */}
                            <Icon
                                icon="mdi:comment"
                                width={20}
                                className="text-secondary outline-black"
                            />
                            <span className="">Commenter</span>
                </button>
            </div>
        </div>
    )
}

export default ReaderFeedback;