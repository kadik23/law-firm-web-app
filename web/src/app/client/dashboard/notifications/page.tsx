"use client";

import FilterControls from "@/components/dashboard/Notification/FilterControls";
import Image from "next/image";
import { useState } from "react";

const NotificationData = [
    {
        id: 1,
        type: "notification",
        title: "New case #12345",
        content: "A new case has been opened by Jane Doe",
        createdAt: "2022-02-15T10:00:00",
        updatedAt: "2022-02-15T10:00:00",
        user: {
            id: 1,
            name: "Jane Doe",
            avatar: "/images/user-1.jpg",
        },
    },
]

const Notifications = () => {
    const [postTimeValue, setPostTimeValue] = useState("Posted at");
    const [notificationTypeValue, setNotificationTypeValue] = useState("Notifications");
    const [consultationTimeValue, setConsultationTimeValue] = useState("Posted at");
    const [consultationTypeValue, setConsultationTypeValue] = useState("Consultations");
        
    return (
        <div>
            <div className="mb-8 flex items-center gap-2 text-3xl font-black text-primary">
                <Image
                src="/icons/notification-primary.svg"
                alt="notification"
                width={28}
                height={33}
                />
                Notifications
            </div>
            <FilterControls
                postTimeValue={postTimeValue}
                notificationTypeValue={notificationTypeValue}
                consultationTimeValue={consultationTimeValue}
                consultationTypeValue={consultationTypeValue}
                onPostTimeChange={setPostTimeValue}
                onNotificationTypeChange={setNotificationTypeValue}
                onConsultationTimeChange={setConsultationTimeValue}
                onConsultationTypeChange={setConsultationTypeValue}
            />
            <div className="flex flex-col gap-4">
                {NotificationData.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2 bg-[#385F7A] text-white px-8 py-4 rounded-lg">
                        <div className="flex items-center gap-2">
                            {(!item.user.avatar) ?
                                <Image
                                src={item.user.avatar}
                                alt={item.user.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                                />
                                
                                : 
                                <button className="bg-secondary w-11 h-11 rounded-full text-center text-lg p-2 btn font-semibold shadow-lg">
                                    {item.user?.name[0]}
                                </button>
                             
                            }
                            <div className="flex flex-col gap-1">
                                <div className="text-sm font-semibold">{item.user.name}</div>
                                <div className="text-xs">{item.createdAt}</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold">{item.title}</div>
                            <div className="text-sm">{item.content}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold">{postTimeValue}</div>
                            <div className="text-sm">{item.updatedAt}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;