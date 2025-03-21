"use client";

import Image from "next/image";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { getRelativeTime } from "@/lib/utils/relativeTime";

interface NotificationItemProps {
  item: {
    id: number;
    type: string;
    title: string;
    content: string;
    blogName?: string;
    serviceName?: string;
    status?: string;
    createdAt: string;
    updatedAt: string;
    user?: {
      id: number;
      name: string;
      avatar: string;
    };
  };
  onDelete: (id: number) => void;
}

const NotificationItem = ({ item, onDelete }: NotificationItemProps) => {
  return (
    <div className="flex flex-col gap-2 bg-[#385F7A] text-white px-8 py-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {item.user ? (
            !item.user?.avatar ? (
              <Image
                src={item.user?.avatar || ""}
                alt={item.user?.name || ""}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <button className="bg-secondary w-11 h-11 rounded-full text-center text-lg p-2 btn font-semibold shadow-lg">
                {item.user?.name[0]}
              </button>
            )
          ) : (
            ""
          )}
          <div className="text-xl font-bold">
            {item.user ? item.user?.name : item.type === "message" || item.type === "consultation" ? "Message from the admin" : item.title}
          </div>
        </div>
        <div className="flex items-center gap-2 md:flex hidden">
          <button
            className="px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-secondary hover:border hover:border-zinc-300"
            onClick={() => onDelete(item.id)}
          >
            <Icon icon="mdi:trash-can" width={18} />
            <span className="text-sm">Supprimer</span>
          </button>
          <div>{getRelativeTime(item.createdAt)}</div>
        </div>
      </div>
      <div className="flex w-full items-end justify-between">
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-base w-[60ch]">{item.content}</div>
          <div className="flex items-center justify-between flex md:hidden">
            <button
              className="py-3 rounded-md text-sm flex items-center gap-1 hover:bg-secondary hover:border hover:border-zinc-300"
              onClick={() => onDelete(item.id)}
            >
              <Icon icon="mdi:trash-can" width={18} />
              <span className="text-sm">Supprimer</span>
            </button>
            <div>{getRelativeTime(item.createdAt)}</div>
          </div>
          <div className="text-sm pb-1 self-center border-b-2 border-white flex md:hidden">
            {item.blogName}
          </div>
        </div>
        <div className="text-sm pb-1 border-b-2 border-white hidden md:flex">
          {item.type.toLowerCase() === "blog"
            ? item.blogName
            : item.type.toLowerCase() === "service"
            ? item.serviceName
            : item.status}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;